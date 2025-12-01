/**
 * 積算計算に関する共通ロジック
 * バックエンドの AnalysisService とフロントエンドの channelValuesStore で使用
 */

/** スキップ判定の閾値（秒） - 5分以上の間隔がある場合は積分をスキップ */
export const SKIP_THRESHOLD_SEC = 300;

/** スキップ判定の閾値（ミリ秒） */
export const SKIP_THRESHOLD_MS = SKIP_THRESHOLD_SEC * 1000;

/**
 * 台形積分で積算値を計算する
 * 単位: W から Wh への変換を含む
 * 
 * @param prevValue 前回の値 (W)
 * @param currentValue 今回の値 (W)
 * @param timeDiffSec 時間差 (秒)
 * @returns 積算値 (Wh)
 */
export function calculateTrapezoidalIntegral(
    prevValue: number,
    currentValue: number,
    timeDiffSec: number
): number {
    // 台形積分: (前回値 + 今回値) / 2 * 秒数
    // Ws (J) -> Wh に変換するため 3600 で割る
    return (((prevValue + currentValue) / 2) * timeDiffSec) / 3600;
}

/**
 * 指定されたタイムスタンプが属する区間の開始時刻を計算する
 * ローカル日付の0:00を基準に intervalMinutes 分ごとに区切る
 * 
 * @param timestamp タイムスタンプ (ミリ秒)
 * @param intervalMinutes 区間の長さ (分)
 * @returns 区間の開始時刻 (ミリ秒)
 */
export function calculateBucketStart(
    timestamp: number,
    intervalMinutes: number
): number {
    const date = new Date(timestamp);
    const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
    ).getTime();
    
    const intervalMs = intervalMinutes * 60 * 1000;
    const millisSinceDayStart = timestamp - dayStart;
    const bucketIndex = Math.floor(millisSinceDayStart / intervalMs);
    
    return dayStart + bucketIndex * intervalMs;
}

/**
 * 時間差がスキップ閾値内かどうかを判定する
 * 
 * @param timeDiffSec 時間差 (秒)
 * @returns スキップすべきでなければ true
 */
export function isWithinSkipThreshold(timeDiffSec: number): boolean {
    return timeDiffSec > 0 && timeDiffSec < SKIP_THRESHOLD_SEC;
}
