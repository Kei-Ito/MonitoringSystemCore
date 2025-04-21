import { Mesurement } from '@/models/MesurementModel';
import * as database from '@/services/databaseService';
import { saveDailyCumulativeValue, findCumulativeValueForDate } from '@/infra/database/trendDatabase';
import { trendDataRequest } from '@monitoring/shared/api';

/**
 * 累積データを取得するメソッド\
 * 単位はvalue * sec\
 * 要求されたデータが当日のものの場合、都度集計する
 * @param dataList 
 */
export async function getCumulativeValue(dataRequest: trendDataRequest): Promise<number> {

  const end_time = dataRequest.end_time;
  const end_time_date = new Date(end_time);
  const today = new Date();

  // 既にデータベースに集計データが存在するか確認
  const cumulativeValueResult = await findCumulativeValueForDate(end_time_date, dataRequest.channel_id);

  // すでに集計されている場合はその値を返す
  if (cumulativeValueResult.ok) {
    console.log('Cumulative data found');
    return cumulativeValueResult.value;
  }

  // 集計されていない場合や、当日のデータの場合はデータを取得して集計する
  const dataList = await database.getTrendData(dataRequest);
  const cumulativeValue = calculateCumulativeValue(dataList);

  // 当日のデータでなければ、集計データを保存
  if (end_time_date.getFullYear() !== today.getFullYear() || end_time_date.getMonth() !== today.getMonth() || end_time_date.getDate() !== today.getDate()) {
    // 集計データを保存(終了を待たない)
    saveDailyCumulativeValue(end_time_date, dataRequest.channel_id, cumulativeValue);
  }
  return cumulativeValue;
}


/**
 * 累積データを計算するメソッド。
 * 単位はvalue * sec 
 * @param dataList 累積データを計算するためのデータリスト
 * @param skipThreshold スキップする時間間隔の閾値（ミリ秒）
 */
function calculateCumulativeValue(
  dataList: Mesurement[],
  skipThreshold: number = 300000
): number {
  if (dataList.length === 0) {
    return 0;
  }

  // タイムスタンプでソート
  dataList.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  let totalValue: number = 0;

  for (let i = 0; i < dataList.length - 1; i++) {
    const currentData = dataList[i];
    const next = dataList[i + 1];

    const timeDiffMs = next.timestamp.getTime() - currentData.timestamp.getTime();
    const timeDiffSec = timeDiffMs / 1000;

    // 5分以上の間隔がある場合はスキップ
    if (timeDiffMs >= skipThreshold) {
      continue;
    }

    const avgValue = (currentData.value + next.value) / 2;
    const sectionValue = avgValue * timeDiffSec;
    totalValue += sectionValue
  }

  return totalValue;
}