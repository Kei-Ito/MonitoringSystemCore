import { getIOModuleInputResponse } from '@monitoring/shared/api';
import { csvDataRequest ,trendDataRequest,getIsDataExistRequestModel } from '@monitoring/shared/api';
import { SystemSettingService } from 'src/config/SystemSetting';
import readline from 'readline';

import path from 'path';
import fs from 'fs';

const configService = SystemSettingService.getInstance();

/**
 * SystemSettingServiceに登録されているルートディレクトリと日付からログデータのパスを生成する
 * @param date 日付
 * @returns パス
 */
function generatePathfromDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return path.join(configService.getSystemSetting().dataRootPath, year, month, day,'data.csv');
}

/**
 * チャンネルUUIDのリストを取得する
 */
function getChannel_UUIDs(data_list: getIOModuleInputResponse[]) : [string[], Map<string, number>] {
    const channel_uuids = [];
    // チャンネルUUIDごとの値のマップ
    const value_map : Map<string, number > =  new Map<string, number >();
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


async function readHeaderLine(filePath: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        rl.close();
        fileStream.destroy();
        return line.split(',');
    }
    return [];
}

// 簡易的なMutex
let isSaving = false;
const waitQueue: (() => void)[] = [];

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

export async function saveInputDatas(data_list: getIOModuleInputResponse[]): Promise<void> {
    if (data_list.length === 0) return;
    
    await acquireLock();
    try {
        const timestamp = data_list[0].timestamp;
        const data_path = generatePathfromDate(new Date(timestamp));
        const dir = path.dirname(data_path);

        await fs.promises.mkdir(dir, { recursive: true });

        const [channel_uuids, value_map] = getChannel_UUIDs(data_list);

        let existingHeader: string[] = [];
        let fileExists = false;

        try {
            existingHeader = await readHeaderLine(data_path);
            if (existingHeader.length > 0) {
                fileExists = true;
            }
        } catch {
            fileExists = false;
        }

        if (!fileExists) {
            // 新規作成
            const header = ['timestamp', ...channel_uuids];
            await fs.promises.writeFile(data_path, header.join(',') + '\n');
            existingHeader = header;
        } else {
            // ヘッダー更新チェック
            const missingChannels = channel_uuids.filter(uuid => !existingHeader.includes(uuid));
            
            if (missingChannels.length > 0) {
                console.log(`Adding missing channels to CSV: ${missingChannels.join(', ')}`);
                const content = await fs.promises.readFile(data_path, 'utf-8');
                const lines = content.split(/\r?\n/);
                
                // ヘッダー更新
                const newHeader = [...existingHeader, ...missingChannels];
                
                // データ行更新
                const updatedLines = lines.map((line, index) => {
                    if (index === 0) return newHeader.join(',');
                    if (line.trim() === '') return line;
                    return line + ','.repeat(missingChannels.length);
                });

                await fs.promises.writeFile(data_path, updatedLines.join('\n'));
                existingHeader = newHeader;
            }
        }

        // ヘッダーに従って並び替え
        // 値がない場合は空文字にする
        const sortedValues = existingHeader.slice(1).map(uuid => value_map.get(uuid) ?? '');
        await fs.promises.appendFile(data_path, [timestamp, ...sortedValues].join(',') + '\n');
    } catch (error) {
        console.error('Error saving input data:', error);
    } finally {
        releaseLock();
    }
}

import csv from "csv-parser";

async function loadCsvColumn(
  filePath: string,
  targetColumn: string
): Promise<{ timestamp: Date; value: number }[]> {
  return new Promise((resolve, reject) => {
    const results: { timestamp: Date; value: number }[] = [];

    // ファイルが存在しない場合は空配列を返す
    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row[targetColumn] !== undefined) {
          results.push({
            timestamp: new Date(row.timestamp),
            value: Number(row[targetColumn]),
          });
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

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
    console.log('Fetching trend data from files...');
    
    const startDate = new Date(trendDataRequest.start_time);
    const endDate = new Date(trendDataRequest.end_time);
    const dateList = getDateRangeList(startDate, endDate);
    
    // 各日付のデータを並列で取得
    const dataPromises = dateList.map(date => {
        const filePath = generatePathfromDate(date);
        return loadCsvColumn(filePath, trendDataRequest.channel_uuid);
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
