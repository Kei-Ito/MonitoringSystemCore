import * as fs from 'fs/promises';
import { Result,ok,err } from "@monitoring/shared/utils";

export async function loadJson<T>(filePath: string , encoding: BufferEncoding = 'utf-8'): Promise<Result<T>> {
  try {
    const data = await fs.readFile(filePath, encoding);
    const obj = JSON.parse(data);

    // TODO: 型チェックを追加するべき（zodなどを使用）
    return ok(obj as T);

  } catch (error) {
    const message = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message?: string }).message
      : undefined;
    return err(message || 'JSON読み込みエラー'); 
  }
}

/**
 * 任意のオブジェクトを JSON ファイルに非同期保存する
 * @param filePath 保存先ファイルパス
 * @param data 保存するオブジェクト
 * @param encoding 文字コード (デフォルト: 'utf-8')
 */
export async function saveJson<T>(filePath: string, data: T, encoding: BufferEncoding = 'utf-8'): Promise<void> {
  try {
    const json = JSON.stringify(data, null, 2); // 整形付きで保存（読みやすい）
    //const json = JSON.stringify(data); // 整形なしで保存
    await fs.writeFile(filePath, json, { encoding });
  } catch (err) {
    console.error('JSON書き込みエラー:', err);
    throw err; // エラーを再スロー
  }
}