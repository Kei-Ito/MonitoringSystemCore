import fs from 'fs/promises';
import path from 'path';
import { SystemSettingService } from 'src/config/SystemSetting';

const configService = SystemSettingService.getInstance();

// クリーンアップの実行間隔（ミリ秒）: 24時間
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

// クリーンアップタイマーのID
let cleanupTimerId: NodeJS.Timeout | null = null;

/**
 * データクリーンアップサービス
 * 設定された保存期間を過ぎた古いデータとキャッシュを自動削除する
 */

/**
 * 指定されたディレクトリが空かどうかを確認する
 * @param dirPath ディレクトリパス
 * @returns 空の場合true
 */
async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
    try {
        const entries = await fs.readdir(dirPath);
        return entries.length === 0;
    } catch {
        return true;
    }
}

/**
 * 空の親ディレクトリを再帰的に削除する
 * @param dirPath 削除対象のディレクトリパス
 * @param rootPath データルートパス（これより上は削除しない）
 */
async function cleanupEmptyParentDirectories(dirPath: string, rootPath: string): Promise<void> {
    let currentPath = dirPath;
    
    while (currentPath !== rootPath && currentPath.startsWith(rootPath)) {
        try {
            if (await isDirectoryEmpty(currentPath)) {
                await fs.rmdir(currentPath);
                console.log(`[DataCleanup] Removed empty directory: ${currentPath}`);
                // 親ディレクトリへ移動
                currentPath = path.dirname(currentPath);
            } else {
                // 空でなければ終了
                break;
            }
        } catch (error) {
            // 削除できなければ終了
            break;
        }
    }
}

/**
 * 保存期間を過ぎた日付のディレクトリを取得する
 * @param rootPath データルートパス
 * @param retentionDays 保存期間（日数）
 * @returns 削除対象のディレクトリパスリスト
 */
async function getExpiredDateDirectories(rootPath: string, retentionDays: number): Promise<string[]> {
    const expiredDirs: string[] = [];
    
    // 期限日を計算（今日から retentionDays 日前）
    const now = new Date();
    const cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - retentionDays);
    
    try {
        // 年ディレクトリを走査
        const years = await fs.readdir(rootPath);
        
        for (const year of years) {
            // 'cache' ディレクトリはスキップ（別途処理）
            if (year === 'cache') continue;
            
            const yearPath = path.join(rootPath, year);
            const yearStat = await fs.stat(yearPath);
            
            if (!yearStat.isDirectory() || !/^\d{4}$/.test(year)) continue;
            
            // 月ディレクトリを走査
            const months = await fs.readdir(yearPath);
            
            for (const month of months) {
                const monthPath = path.join(yearPath, month);
                const monthStat = await fs.stat(monthPath);
                
                if (!monthStat.isDirectory() || !/^\d{2}$/.test(month)) continue;
                
                // 日ディレクトリを走査
                const days = await fs.readdir(monthPath);
                
                for (const day of days) {
                    const dayPath = path.join(monthPath, day);
                    const dayStat = await fs.stat(dayPath);
                    
                    if (!dayStat.isDirectory() || !/^\d{2}$/.test(day)) continue;
                    
                    // 日付をパース
                    const dirDate = new Date(
                        parseInt(year, 10),
                        parseInt(month, 10) - 1,
                        parseInt(day, 10)
                    );
                    
                    // 期限日より古ければ削除対象に追加
                    if (dirDate < cutoffDate) {
                        expiredDirs.push(dayPath);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`[DataCleanup] Error scanning directories: ${error}`);
    }
    
    return expiredDirs;
}

/**
 * キャッシュディレクトリから期限切れのデータを取得する
 * @param rootPath データルートパス
 * @param retentionDays 保存期間（日数）
 * @returns 削除対象のキャッシュディレクトリパスリスト
 */
async function getExpiredCacheDirectories(rootPath: string, retentionDays: number): Promise<string[]> {
    const expiredDirs: string[] = [];
    const cacheBasePath = path.join(rootPath, 'cache');
    
    // 期限日を計算
    const now = new Date();
    const cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - retentionDays);
    
    try {
        // キャッシュディレクトリが存在しない場合は空配列を返す
        try {
            await fs.access(cacheBasePath);
        } catch {
            return expiredDirs;
        }
        
        // キャッシュには複数の種類がある (aggregated, daily_total など)
        // それぞれのディレクトリ構造を走査
        const cacheTypes = await fs.readdir(cacheBasePath);
        
        for (const cacheType of cacheTypes) {
            const cacheTypePath = path.join(cacheBasePath, cacheType);
            const cacheTypeStat = await fs.stat(cacheTypePath);
            
            if (!cacheTypeStat.isDirectory()) continue;
            
            // aggregated: cache/aggregated/{channel_uuid}/{intervalMinutes}/{date}.json
            // daily_total: cache/daily_total/{channel_uuid}/{date}.json
            // 通常キャッシュ: cache/{year}/{month}/{day}/cache_*.json
            
            if (/^\d{4}$/.test(cacheType)) {
                // 年ベースの通常キャッシュ構造
                const months = await fs.readdir(cacheTypePath);
                
                for (const month of months) {
                    const monthPath = path.join(cacheTypePath, month);
                    const monthStat = await fs.stat(monthPath);
                    
                    if (!monthStat.isDirectory() || !/^\d{2}$/.test(month)) continue;
                    
                    const days = await fs.readdir(monthPath);
                    
                    for (const day of days) {
                        const dayPath = path.join(monthPath, day);
                        const dayStat = await fs.stat(dayPath);
                        
                        if (!dayStat.isDirectory() || !/^\d{2}$/.test(day)) continue;
                        
                        const dirDate = new Date(
                            parseInt(cacheType, 10),
                            parseInt(month, 10) - 1,
                            parseInt(day, 10)
                        );
                        
                        if (dirDate < cutoffDate) {
                            expiredDirs.push(dayPath);
                        }
                    }
                }
            } else {
                // aggregated/daily_total などのチャンネルベースキャッシュ
                await collectExpiredCacheFiles(cacheTypePath, cutoffDate, expiredDirs);
            }
        }
    } catch (error) {
        console.error(`[DataCleanup] Error scanning cache directories: ${error}`);
    }
    
    return expiredDirs;
}

/**
 * チャンネルベースのキャッシュから期限切れファイルを収集
 * @param basePath キャッシュのベースパス
 * @param cutoffDate 期限日
 * @param expiredDirs 削除対象リスト（参照渡し）
 */
async function collectExpiredCacheFiles(basePath: string, cutoffDate: Date, expiredDirs: string[]): Promise<void> {
    try {
        const channels = await fs.readdir(basePath);
        
        for (const channel of channels) {
            const channelPath = path.join(basePath, channel);
            const channelStat = await fs.stat(channelPath);
            
            if (!channelStat.isDirectory()) continue;
            
            // チャンネルディレクトリ内のファイル/サブディレクトリを走査
            const entries = await fs.readdir(channelPath);
            
            for (const entry of entries) {
                const entryPath = path.join(channelPath, entry);
                const entryStat = await fs.stat(entryPath);
                
                if (entryStat.isDirectory()) {
                    // intervalMinutes ディレクトリの場合
                    const files = await fs.readdir(entryPath);
                    
                    for (const file of files) {
                        const match = file.match(/^(\d{4})-(\d{2})-(\d{2})\.json$/);
                        if (match) {
                            const fileDate = new Date(
                                parseInt(match[1], 10),
                                parseInt(match[2], 10) - 1,
                                parseInt(match[3], 10)
                            );
                            
                            if (fileDate < cutoffDate) {
                                expiredDirs.push(path.join(entryPath, file));
                            }
                        }
                    }
                } else {
                    // 直接JSONファイルの場合 (daily_total)
                    const match = entry.match(/^(\d{4})-(\d{2})-(\d{2})\.json$/);
                    if (match) {
                        const fileDate = new Date(
                            parseInt(match[1], 10),
                            parseInt(match[2], 10) - 1,
                            parseInt(match[3], 10)
                        );
                        
                        if (fileDate < cutoffDate) {
                            expiredDirs.push(entryPath);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(`[DataCleanup] Error collecting expired cache files: ${error}`);
    }
}

/**
 * ファイルまたはディレクトリを削除する
 * @param targetPath 削除対象のパス
 */
async function removeTarget(targetPath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(targetPath);
        
        if (stat.isDirectory()) {
            await fs.rm(targetPath, { recursive: true, force: true });
        } else {
            await fs.unlink(targetPath);
        }
        
        return true;
    } catch (error) {
        console.error(`[DataCleanup] Failed to remove: ${targetPath}`, error);
        return false;
    }
}

/**
 * データクリーンアップを実行する
 * @returns 削除されたデータディレクトリ数とキャッシュ数
 */
export async function runDataCleanup(): Promise<{ dataDeleted: number; cacheDeleted: number }> {
    const systemSetting = configService.getSystemSetting();
    const dataRootPath = systemSetting.dataRootPath;
    const retentionDays = systemSetting.dataRetentionDays;
    
    // dataRootPathが設定されていない場合はスキップ
    if (!dataRootPath) {
        console.log('[DataCleanup] dataRootPath is not configured. Skipping cleanup.');
        return { dataDeleted: 0, cacheDeleted: 0 };
    }
    
    // retentionDaysが0以下の場合は削除しない
    if (retentionDays <= 0) {
        console.log('[DataCleanup] dataRetentionDays is 0 or negative. Skipping cleanup.');
        return { dataDeleted: 0, cacheDeleted: 0 };
    }
    
    console.log(`[DataCleanup] Starting cleanup. Retention days: ${retentionDays}, Root path: ${dataRootPath}`);
    
    let dataDeleted = 0;
    let cacheDeleted = 0;
    
    try {
        // 1. データディレクトリの削除
        const expiredDataDirs = await getExpiredDateDirectories(dataRootPath, retentionDays);
        console.log(`[DataCleanup] Found ${expiredDataDirs.length} expired data directories`);
        
        for (const dir of expiredDataDirs) {
            if (await removeTarget(dir)) {
                dataDeleted++;
                console.log(`[DataCleanup] Deleted data directory: ${dir}`);
                
                // 空の親ディレクトリを削除
                await cleanupEmptyParentDirectories(path.dirname(dir), dataRootPath);
            }
        }
        
        // 2. キャッシュの削除
        const expiredCachePaths = await getExpiredCacheDirectories(dataRootPath, retentionDays);
        console.log(`[DataCleanup] Found ${expiredCachePaths.length} expired cache entries`);
        
        for (const cachePath of expiredCachePaths) {
            if (await removeTarget(cachePath)) {
                cacheDeleted++;
                console.log(`[DataCleanup] Deleted cache: ${cachePath}`);
                
                // 空の親ディレクトリを削除
                const cacheBasePath = path.join(dataRootPath, 'cache');
                await cleanupEmptyParentDirectories(path.dirname(cachePath), cacheBasePath);
            }
        }
        
        console.log(`[DataCleanup] Cleanup completed. Data: ${dataDeleted}, Cache: ${cacheDeleted}`);
    } catch (error) {
        console.error('[DataCleanup] Cleanup failed:', error);
    }
    
    return { dataDeleted, cacheDeleted };
}

/**
 * 定期的なデータクリーンアップを開始する
 * サーバー起動時に呼び出し、1日1回実行
 */
export function startDataCleanupScheduler(): void {
    // 既存のタイマーがあればクリア
    if (cleanupTimerId) {
        clearInterval(cleanupTimerId);
    }
    
    // 起動時に即時実行
    console.log('[DataCleanup] Starting initial cleanup...');
    runDataCleanup().catch(error => {
        console.error('[DataCleanup] Initial cleanup failed:', error);
    });
    
    // 定期実行を設定（24時間ごと）
    cleanupTimerId = setInterval(() => {
        console.log('[DataCleanup] Running scheduled cleanup...');
        runDataCleanup().catch(error => {
            console.error('[DataCleanup] Scheduled cleanup failed:', error);
        });
    }, CLEANUP_INTERVAL_MS);
    
    console.log(`[DataCleanup] Scheduler started. Interval: ${CLEANUP_INTERVAL_MS / 1000 / 60 / 60} hours`);
}

/**
 * データクリーンアップスケジューラを停止する
 */
export function stopDataCleanupScheduler(): void {
    if (cleanupTimerId) {
        clearInterval(cleanupTimerId);
        cleanupTimerId = null;
        console.log('[DataCleanup] Scheduler stopped.');
    }
}
