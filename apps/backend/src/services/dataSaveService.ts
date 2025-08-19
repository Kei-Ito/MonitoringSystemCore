import { getIOModuleInputResponse } from '@monitoring/shared/api';
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
  const fh = await fs.promises.open(filePath, 'r');
  const buffer = Buffer.alloc(1024); // 先頭1KBだけ読めば大抵は収まる
  await fh.read(buffer, 0, buffer.length, 0);
  await fh.close();

  const content = buffer.toString('utf-8');
  const firstLine = content.split(/\r?\n/)[0]; // 最初の1行
  return firstLine.split(',');
}

export async function saveInputDatas(data_list: getIOModuleInputResponse[]): Promise<void> {
    console.log("Saving input data to database...");
    if (data_list.length === 0) return;
    
    const timestamp = data_list[0].timestamp;
    const data_path = generatePathfromDate(new Date(timestamp));
    const dir = path.dirname(data_path);

    await fs.promises.mkdir(dir, { recursive: true });

    const [channel_uuids, value_map] = getChannel_UUIDs(data_list);

    const header = ['timestamp', ...channel_uuids];
    let existingHeader: string[];

    try {
        existingHeader = await readHeaderLine(data_path);
    } catch {
        // ファイルがなければ新規作成
        await fs.promises.writeFile(data_path, header.join(',') + '\n');
        existingHeader = header;
    }

    // ヘッダーに従って並び替え
    const sortedValues = existingHeader.slice(1).map(uuid => value_map.get(uuid) ?? 0);
    await fs.promises.appendFile(data_path, [timestamp, ...sortedValues].join(',') + '\n');
}
