import { getIOModuleInputResponse } from '@monitoring/shared/api';
import { csvDataRequest, trendDataRequest, getIsDataExistRequestModel } from '@monitoring/shared/api';
import { SystemSettingService } from 'src/config/SystemSetting';
import { Result, ok, err } from '@monitoring/shared/utils';
import readline from 'readline';
import csv from "csv-parser";

import path from 'path';
import fs from 'fs';

const configService = SystemSettingService.getInstance();

/**
 * SystemSettingServiceに登録されているルートディレクトリと日付からログデータのパスを生成する
 * @param date 日付
 * @param suffix ファイル名の接尾辞（サンプリング周期UUIDなど）
 * @returns パス
 */
function generatePathfromDate(date: Date, suffix?: string): string {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fileName = suffix ? `data_${suffix}.csv` : 'data.csv';
    return path.join(configService.getSystemSetting().dataRootPath, year, month, day, fileName);
}

/**
 * 指定された日付のログディレクトリパスを取得する
 * @param date 日付
 * @returns ディレクトリパス
 */
function getLogDir(date: Date): string {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return path.join(configService.getSystemSetting().dataRootPath, year, month, day);
}

/**
 * チャンネルUUIDのリストを取得する
 */
function getChannel_UUIDs(data_list: getIOModuleInputResponse[]): [string[], Map<string, number>] {
    const channel_uuids = [];
    // チャンネルUUIDごとの値のマップ
    const value_map: Map<string, number> = new Map<string, number>();
    for (const data of data_list) {
        for (const channel of data.channels) {
            if (channel.channel_uuid) {
                channel_uuids.push(channel.channel_uuid);
                // チャンネルUUIDごとの値をマップに追加
                value_map.set(channel.channel_uuid, channel.input_data);
            }
        }
    }
    return [channel_uuids, value_map];
}


async function readFirstNLines(filePath: string, n: number): Promise<string[]> {
    if (!fs.existsSync(filePath)) return [];
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines: string[] = [];
    for await (const line of rl) {
        // 1行目の先頭にあるBOMを除去
        if (lines.length === 0) {
            lines.push(line.replace(/^\uFEFF/, ''));
        } else {
            lines.push(line);
        }

        if (lines.length >= n) {
            break;
        }
    }
    rl.close();
    fileStream.destroy();
    return lines;
}

// 簡易的なMutex
let isSaving = false;
const waitQueue: (() => void)[] = [];

// ヘッダー情報のキャッシュ (ファイルパス -> ヘッダーUUIDリスト)
const headerCache = new Map<string, string[]>();

async function acquireLock(): Promise<void> {
    if (!isSaving) {
        isSaving = true;
        return;
    }
    return new Promise<void>(resolve => {
        waitQueue.push(resolve);
    });
}

function releaseLock() {
    if (waitQueue.length > 0) {
        const next = waitQueue.shift();
        next!();
    } else {
        isSaving = false;
    }
}

/**
 * CSVファイルのヘッダーを確認し、必要であれば更新する
 * @param data_path ファイルパス
 * @param inputChannelUuids 今回保存するデータのチャンネルUUIDリスト
 * @param channelMeta チャンネルのメタデータ（名前、単位）
 * @returns 最新のヘッダーUUIDリスト
 */
async function ensureCsvHeader(
    data_path: string,
    inputChannelUuids: string[],
    channelMeta?: Map<string, { name: string, unit: string }>
): Promise<string[]> {
    // キャッシュチェック
    if (headerCache.has(data_path)) {
        // ファイルが存在しない場合はキャッシュを破棄して処理を続行（新規作成扱いになる）
        if (!fs.existsSync(data_path)) {
            headerCache.delete(data_path);
        } else {
            const cachedHeader = headerCache.get(data_path)!;
            const missingInCache = inputChannelUuids.filter(uuid => !cachedHeader.includes(uuid));
            if (missingInCache.length === 0) {
                return cachedHeader;
            }
        }
    }

    let existingLines: string[] = [];
    try {
        existingLines = await readFirstNLines(data_path, 3);
    } catch {
        // ファイルがない場合など
    }

    // 3行未満なら新規作成扱い
    const isNewFile = existingLines.length < 3;

    let currentHeaderUuids: string[] = [];
    const existingMetaMap = new Map<string, { name: string, unit: string }>();

    if (isNewFile) {
        currentHeaderUuids = ['HEADER'];
    } else {
        // 既存ファイル（3行目からUUIDを取得）
        const line1 = existingLines[0].split(',');
        const line2 = existingLines[1].split(',');
        const line3 = existingLines[2].split(',');

        currentHeaderUuids = line3;

        // 既存のメタデータをマップに保存
        currentHeaderUuids.forEach((uuid, index) => {
            const key = String(uuid).trim();
            if (key === 'HEADER') return;
            const name = index < line1.length ? line1[index] : uuid;
            const unit = index < line2.length ? line2[index] : '';
            existingMetaMap.set(key, { name, unit });
        });
    }

    // カラム不足チェック
    const missingChannels = inputChannelUuids.filter(uuid => !currentHeaderUuids.includes(uuid));
    const isHeaderInvalid = !currentHeaderUuids.includes('HEADER');

    if (missingChannels.length === 0 && !isNewFile && !isHeaderInvalid) {
        headerCache.set(data_path, currentHeaderUuids);
        return currentHeaderUuids;
    }

    // メタデータ取得ヘルパー
    const getName = (uuid: string) => {
        const key = String(uuid).trim();
        if (channelMeta?.has(key)) return channelMeta.get(key)!.name;
        if (existingMetaMap.has(key)) return existingMetaMap.get(key)!.name;
        return uuid;
    };
    const getUnit = (uuid: string) => {
        const key = String(uuid).trim();
        if (channelMeta?.has(key)) return channelMeta.get(key)!.unit;
        if (existingMetaMap.has(key)) return existingMetaMap.get(key)!.unit;
        return '';
    };

    return await rewriteHeader(data_path, isNewFile, currentHeaderUuids, missingChannels, getName, getUnit);
}

/**
 * CSVファイルのヘッダーが不足している場合に列を追加する処理。変更されたデータはこのメソッド内で保存される。（頻度は低いのでI/O負荷は許容する）
 * @param data_path csvファイルのパス
 * @param isNewFile 新しいファイルかどうか
 * @param currentHeaderUuids 現在のcsvファイルのヘッダー
 * @param missingChannels 不足しているチャンネルUUIDリスト（追加する列）
 * @param getName UUIDに対応する名前を取得するメソッド（UUIDのリストだけでなく、名前、Unitも構造体として渡せば不要かも）
 * @param getUnit UUIDに対応する単位を取得するメソッド（UUIDのリストだけでなく、名前、Unitも構造体として渡せば不要かも）
 * @returns UUIDリスト
 */
async function rewriteHeader(data_path: string, isNewFile: boolean, currentHeaderUuids: string[], missingChannels: string[],
    getName: (uuid: string) => string, getUnit: (uuid: string) => string): Promise<string[]> {
    let lines: string[] = [];

    if (!isNewFile) {
        // 既存ファイルを読み込んでカラム追加
        const content = await fs.promises.readFile(data_path, 'utf-8');
        // 空行を除去しつつ読み込み
        lines = content.split(/\r?\n/).filter(l => l.trim() !== '');

        // 既存のヘッダー3行を削除（後で再構築して追加するため）
        lines.splice(0, 3);
    }

    // 新しいヘッダーの構成
    // 既存のUUID順序 + 新規追加分
    const finalUuids = [...currentHeaderUuids.filter(u => u !== 'HEADER'), ...missingChannels];

    const newHeaderNames = ['HEADER', ...finalUuids.map(u => getName(u))];
    const newHeaderUnits = ['HEADER', ...finalUuids.map(u => getUnit(u))];
    const newHeaderUuids = ['HEADER', ...finalUuids];

    // データ行の更新（カラム追加がある場合、カンマを追加）
    const updatedDataLines = lines.map(line => {
        if (missingChannels.length > 0) {
            return line + ','.repeat(missingChannels.length);
        }
        return line;
    });

    const newContent = [
        newHeaderNames.join(','),
        newHeaderUnits.join(','),
        newHeaderUuids.join(','),
        ...updatedDataLines
    ].join('\n') + '\n';

    // BOM付きで保存
    await fs.promises.writeFile(data_path, BOM + newContent);

    // ヘッダーのキャッシュ更新
    headerCache.set(data_path, newHeaderUuids);

    return newHeaderUuids;
}

const BOM = '\uFEFF';

export async function saveInputDatas(data_list: getIOModuleInputResponse[], channelMeta?: Map<string, { name: string, unit: string }>, suffix?: string): Promise<Result<void>> {
    if (data_list.length === 0) return ok(void 0);

    await acquireLock();

    try {
        const timestamp = data_list[0].timestamp;

        //　timestampからcsvのパスを生成
        const data_path = generatePathfromDate(new Date(timestamp), suffix);

        // ディレクトリがなければ作成
        await fs.promises.mkdir(path.dirname(data_path), { recursive: true });

        const [channel_uuids, value_map] = getChannel_UUIDs(data_list);

        // ヘッダーの整合性を確保し、最新のUUID順序を取得
        const currentHeaderUuids = await ensureCsvHeader(data_path, channel_uuids, channelMeta);

        // データの追記
        const sortedValues = currentHeaderUuids.slice(1).map(uuid => value_map.get(uuid) ?? '');
        await fs.promises.appendFile(data_path, [timestamp, ...sortedValues].join(',') + '\n');

        return ok(void 0);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error saving input data:', errorMessage);
        return err(`Failed to save data: ${errorMessage}`);
    } finally {
        releaseLock();
    }
}



async function loadCsvColumn(
    filePath: string,
    targetColumn: string
): Promise<{ timestamp: Date; value: number }[]> {
    // キャッシュまたはファイルからヘッダーを取得して確認
    let headerUuids = headerCache.get(filePath);

    if (!headerUuids) {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        // ヘッダー読み込み (3行目)
        const lines = await readFirstNLines(filePath, 3);
        if (lines.length < 3) {
            return [];
        }
        // BOM除去などはreadFirstNLinesで行われている前提
        headerUuids = lines[2].split(',').map(s => s.trim());
        headerCache.set(filePath, headerUuids);
    }

    // ターゲットカラムが存在しない場合は空配列を返す
    if (!headerUuids.includes(targetColumn)) {
        return [];
    }

    return new Promise((resolve, reject) => {
        const results: { timestamp: Date; value: number }[] = [];
        const skipLines = 2; // 1,2行目をスキップ、3行目をヘッダーとして使用

        fs.createReadStream(filePath)
            .pipe(csv({ skipLines: skipLines }))
            .on("data", (row) => {
                if (row[targetColumn] !== undefined) {
                    const val = Number(row[targetColumn]);
                    // 1列目のヘッダー名は 'HEADER' なので、row['HEADER'] でタイムスタンプを取得
                    if (!isNaN(val) && row['HEADER']) {
                        results.push({
                            timestamp: new Date(row['HEADER']),
                            value: val,
                        });
                    }
                }
            })
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}
// ...existing code...

/**
 * 指定された日付範囲の全日付リストを生成
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 日付の配列
 */
function getDateRangeList(startDate: Date, endDate: Date): Date[] {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const dateArray: Date[] = [];
    let current = new Date(start);

    while (current <= end) {
        dateArray.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dateArray;
}

/**
 * 複数日のトレンドデータを取得
 * @param trendDataRequest トレンドデータリクエスト
 * @returns タイムスタンプと値の配列
 */
export async function getTrendData(trendDataRequest: trendDataRequest): Promise<{ timestamp: Date; value: number }[]> {

    const startDate = new Date(trendDataRequest.start_time);
    const endDate = new Date(trendDataRequest.end_time);
    const dateList = getDateRangeList(startDate, endDate);

    // 各日付のデータを並列で取得
    const dataPromises = dateList.map(async date => {
        const dirPath = getLogDir(date);
        if (!fs.existsSync(dirPath)) return [];

        // ディレクトリ内のCSVファイルを検索 (data*.csv)
        const files = await fs.promises.readdir(dirPath);
        const csvFiles = files.filter(f => f.startsWith('data') && f.endsWith('.csv'));

        // 各CSVファイルからデータを読み込む
        const filePromises = csvFiles.map(file => {
            const filePath = path.join(dirPath, file);
            return loadCsvColumn(filePath, trendDataRequest.channel_uuid);
        });

        const results = await Promise.all(filePromises);
        return results.flat();
    });

    const dataArrays = await Promise.all(dataPromises);

    // 全データを結合し、時刻でフィルタリング
    const allData = dataArrays.flat();
    const filteredData = allData.filter(item => {
        const timestamp = item.timestamp.getTime();
        return timestamp >= startDate.getTime() && timestamp <= endDate.getTime();
    });

    // タイムスタンプでソート
    filteredData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return filteredData;
}
