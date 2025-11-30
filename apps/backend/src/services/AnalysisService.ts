import { Mesurement } from 'src/models/MesurementModel';
import * as dataSaveService from 'src/services/dataSaveService';
import * as cacheService from 'src/services/cumulativeCacheService';
import { trendDataRequest } from '@monitoring/shared/api';

/**
 * 指定された期間のデータを指定された間隔で集計し、時系列の積算データを返す
 * @param dataRequest トレンドデータリクエスト
 * @param intervalMinutes 集計間隔（分）
 */
export async function getAggregatedCumulativeTrend(dataRequest: trendDataRequest, intervalMinutes: number): Promise<{ timestamp: Date, value: number }[]> {
  const startTime = new Date(dataRequest.start_time);
  const endTime = new Date(dataRequest.end_time);
  const now = new Date();
  
  const result: { timestamp: Date, value: number }[] = [];
  
  // キャッシュされていない区間を特定するために、まずは全期間のデータを取得するのではなく
  // 区間ごとにキャッシュ確認 -> なければデータ取得というフローにするか、
  // あるいは一括でデータ取得してから計算済みのところはスキップするか。
  // パフォーマンスを考えると、データ取得（CSV読み込み）が最も重い処理なので、
  // キャッシュがある区間はCSV読み込みをスキップしたい。
  // しかし、CSVは日単位で保存されているため、1時間だけ読み込むというのは難しい（ファイル全体を読むことになる）。
  // なので、日単位で「その日のデータが必要か」を判断するのが効率的だが、実装が複雑になる。
  
  // 今回はシンプルに、「区間ごとにキャッシュ確認 -> なければその区間のデータをメモリ上の全データから計算して保存」とする。
  // CSV読み込み自体は dataSaveService.getTrendData で行われるが、これは指定期間の全データを返す。
  // キャッシュヒット率が高ければ、そもそも getTrendData を呼ばずに済むようにしたいが、
  // 部分的にキャッシュがない場合は結局データが必要になる。
  
  // 戦略:
  // 1. まず要求された全期間の区間リストを作成する
  // 2. 各区間についてキャッシュをファイルから問い合わせる
  // 3. キャッシュがない区間が一つでもあれば、全期間（あるいは必要な日だけ）の生データを取得する
  // 4. キャッシュがない区間について計算し、結果をファイルに保存（過去データのみ）
  // 5. 結果を結合して返す

  let currentIntervalStart = new Date(startTime);
  const intervals: { start: Date, end: Date, value: number | null }[] = [];

  while (currentIntervalStart < endTime) {
    const currentIntervalEnd = new Date(currentIntervalStart.getTime() + intervalMinutes * 60 * 1000);
    intervals.push({ start: new Date(currentIntervalStart), end: new Date(currentIntervalEnd), value: null });
    currentIntervalStart = currentIntervalEnd;
  }

  // キャッシュ確認
  // 日付ごとにキャッシュファイルをロードして確認
  const dateCacheMap = new Map<string, cacheService.DailyIntervalCache>();
  
  // 必要な日付のリストアップ
  const datesToCheck = new Set<string>();
  intervals.forEach(i => {
      const d = i.start;
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; // 単純なキー
      datesToCheck.add(dateKey);
  });

  // 各日付のキャッシュをロード
  // 注意: Setのイテレーションで非同期処理を行うため、Promise.allを使う
  // しかし、日付キーからDateオブジェクトを復元するのが面倒なので、intervalsループの中でロードする戦略にするか、
  // あるいは日付ごとにグループ化するか。
  
  // 日付ごとにインターバルをグループ化
  const intervalsByDate = new Map<string, typeof intervals>();
  intervals.forEach(i => {
      const d = i.start;
      // Dateオブジェクトの時刻を0:00:00にしたものをキーにする
      const dateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dateKey = dateObj.getTime().toString();
      
      if (!intervalsByDate.has(dateKey)) {
          intervalsByDate.set(dateKey, []);
      }
      intervalsByDate.get(dateKey)!.push(i);
  });

  let needsRawData = false;

  // 日付ごとにキャッシュをロードして適用
  for (const [dateKey, dateIntervals] of intervalsByDate) {
      const dateObj = new Date(Number(dateKey));
      const cache = await cacheService.loadAggregatedCache(dataRequest.channel_uuid, intervalMinutes, dateObj);
      dateCacheMap.set(dateKey, cache); // 後で保存時に使うために保持

      for (const interval of dateIntervals) {
          // キャッシュキーは "HH:mm:ss"
          const timeKey = interval.start.toTimeString().split(' ')[0];
          if (cache[timeKey] !== undefined) {
              interval.value = cache[timeKey];
          } else {
              needsRawData = true;
          }
      }
  }

  // 全てキャッシュにあれば終了
  if (!needsRawData) {
    return intervals.map(i => ({ timestamp: i.start, value: i.value! }));
  }

  // 生データ取得
  const dataList = await dataSaveService.getTrendData(dataRequest);
  // タイムスタンプでソート
  dataList.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // 変更があったキャッシュファイルを追跡
  const dirtyDates = new Set<string>();

  for (const interval of intervals) {
    if (interval.value !== null) {
      result.push({ timestamp: interval.start, value: interval.value });
      continue;
    }

    // この区間のデータを抽出
    const intervalData = dataList.filter(d => 
      d.timestamp >= interval.start && d.timestamp < interval.end
    );

    // 積算値を計算
    const cumulativeValue = calculateCumulativeValue(intervalData);
    interval.value = cumulativeValue;
    
    result.push({
      timestamp: interval.start,
      value: cumulativeValue
    });

    // 過去の確定した区間であればキャッシュに保存
    // 区間の終了時刻が現在時刻より前であれば保存対象
    if (interval.end < now) {
        const d = interval.start;
        const dateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dateKey = dateObj.getTime().toString();
        const timeKey = interval.start.toTimeString().split(' ')[0];
        
        let cache = dateCacheMap.get(dateKey);
        if (!cache) {
            cache = {};
            dateCacheMap.set(dateKey, cache);
        }
        cache[timeKey] = cumulativeValue;
        dirtyDates.add(dateKey);
    }
  }

  // 変更があったキャッシュを保存
  for (const dateKey of dirtyDates) {
      const dateObj = new Date(Number(dateKey));
      const cache = dateCacheMap.get(dateKey);
      if (cache) {
          await cacheService.saveAggregatedCache(dataRequest.channel_uuid, intervalMinutes, dateObj, cache);
      }
  }

  return result;
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
    // Ws (J) -> Wh に変換するため 3600 で割る
    const sectionValue = (avgValue * timeDiffSec) / 3600;
    totalValue += sectionValue
  }

  return totalValue;
}