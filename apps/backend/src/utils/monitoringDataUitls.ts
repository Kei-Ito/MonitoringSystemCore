export interface TimeSeriesData {
    timestamp: Date;
    value: number;
}

/**
 * 時系列データを指定された目標点数以下になるように間引く
 * 単純な間引き（Decimation）を行う
 * @param data 元の時系列データ
 * @param targetCount 目標データ点数
 * @returns 間引き後のデータ
 */
export function downsampleData(data: TimeSeriesData[], targetCount: number): TimeSeriesData[] {
    if (data.length <= targetCount) {
        return data;
    }

    const step = data.length / targetCount;
    const result: TimeSeriesData[] = [];

    for (let i = 0; i < targetCount; i++) {
        const index = Math.floor(i * step);
        if (index < data.length) {
            result.push(data[index]);
        }
    }

    // 最後のデータポイントを含めることで、範囲の終了を正確に表現する（オプション）
    // 今回は単純な分布を重視して上記の実装とするが、
    // グラフの端点が重要な場合は末尾を追加するロジックも検討可能。
    // ここでは均等に間引くことを優先する。

    return result;
}

/**
 * 時系列データを指定された時間間隔で間引く（平均値を使用）
 * @param data 元の時系列データ
 * @param intervalMs 間引き間隔（ミリ秒）
 * @returns 間引き後のデータ
 */
export function downsampleDataByInterval(data: TimeSeriesData[], intervalMs: number): TimeSeriesData[] {
    if (intervalMs <= 0 || data.length === 0) {
        return data;
    }

    const result: TimeSeriesData[] = [];
    let currentBucketStart = Math.floor(data[0].timestamp.getTime() / intervalMs) * intervalMs;
    let sum = 0;
    let count = 0;

    for (const point of data) {
        const timestamp = point.timestamp.getTime();
        
        // 新しいバケットに移った場合、前のバケットの結果を保存
        if (timestamp >= currentBucketStart + intervalMs) {
            if (count > 0) {
                result.push({
                    timestamp: new Date(currentBucketStart),
                    value: sum / count
                });
            }
            
            // 次のバケットへ（データが飛んでいる場合も考慮してwhileではなく再計算）
            currentBucketStart = Math.floor(timestamp / intervalMs) * intervalMs;
            sum = 0;
            count = 0;
        }

        sum += point.value;
        count++;
    }

    // 最後のバケットを保存
    if (count > 0) {
        result.push({
            timestamp: new Date(currentBucketStart),
            value: sum / count
        });
    }

    return result;
}
