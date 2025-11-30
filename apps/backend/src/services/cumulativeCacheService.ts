import fs from 'fs/promises';
import path from 'path';
import { SystemSettingService } from 'src/config/SystemSetting';
import HealthCheckService from 'src/services/healthCheckService';

const configService = SystemSettingService.getInstance();

// キャッシュデータの型: 時刻(HH:mm:ss) -> 値
export type DailyIntervalCache = Record<string, number>;

function getCacheBaseDir(): string {
    return path.join(configService.getSystemSetting().dataRootPath, 'cache');
}

function getAggregatedCachePath(channel_uuid: string, intervalMinutes: number, date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return path.join(getCacheBaseDir(), 'aggregated', channel_uuid, String(intervalMinutes), `${dateStr}.json`);
}

function getDailyTotalCachePath(channel_uuid: string, date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return path.join(getCacheBaseDir(), 'daily_total', channel_uuid, `${dateStr}.json`);
}

// --- Aggregated Cache (Interval based) ---

export async function loadAggregatedCache(channel_uuid: string, intervalMinutes: number, date: Date): Promise<DailyIntervalCache> {
    const filePath = getAggregatedCachePath(channel_uuid, intervalMinutes, date);
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return {};
    }
}

export async function saveAggregatedCache(channel_uuid: string, intervalMinutes: number, date: Date, cache: DailyIntervalCache): Promise<void> {
    // ドライブがマウントされていない場合は保存しない
    const healthService = HealthCheckService.getInstance();
    if (!healthService.getHealthStatus().drivesMounted) {
        return;
    }

    const filePath = getAggregatedCachePath(channel_uuid, intervalMinutes, date);
    const dirPath = path.dirname(filePath);
    
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to save aggregated cache: ${filePath}`, error);
    }
}

// --- Daily Total Cache ---

export async function loadDailyTotalCache(channel_uuid: string, date: Date): Promise<number | null> {
    const filePath = getDailyTotalCachePath(channel_uuid, date);
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return typeof data.value === 'number' ? data.value : null;
    } catch (error) {
        return null;
    }
}

export async function saveDailyTotalCache(channel_uuid: string, date: Date, value: number): Promise<void> {
    // ドライブがマウントされていない場合は保存しない
    const healthService = HealthCheckService.getInstance();
    if (!healthService.getHealthStatus().drivesMounted) {
        return;
    }

    const filePath = getDailyTotalCachePath(channel_uuid, date);
    const dirPath = path.dirname(filePath);
    
    try {
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify({ value }, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Failed to save daily total cache: ${filePath}`, error);
    }
}
