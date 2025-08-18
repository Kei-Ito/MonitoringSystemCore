import * as json from 'src/utils/json';
import { ChartConfig } from "@monitoring/shared/model";

const jsonFilePath: string = './LocalData/uiLayouts.json';
let layouts : Record<string, ChartConfig[]> = {};

export async function initializeLayouts(): Promise<void> {
  const result = await json.loadJson<Record<string, ChartConfig[]>>(jsonFilePath);
  if (result.ok) {
    layouts = result.value;
  } else {
    console.error('レイアウトの設定ファイルの読み込みに失敗しました:', result.error);
    // 初期化に失敗した場合は空の配列を使用
    layouts = {};
  }
}

/**
 * 現在のUIレイアウト設定を返す
 * @returns 現在のレイアウト設定
 */
export function getLayouts(): Record<string, ChartConfig[]> {
    console.log('getLayouts called');
  return layouts;
}