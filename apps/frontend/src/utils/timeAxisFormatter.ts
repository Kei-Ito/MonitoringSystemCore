/**
 * 時系列チャートのX軸フォーマット関連ユーティリティ
 * LineChart, BarChart などの時系列グラフで共通使用
 */

/**
 * データの時間範囲（時間単位）を計算する
 * @param seriesData 時系列データの配列 ([timestamp, value][] の配列)
 * @returns 時間範囲（時間単位）
 */
export function calculateTimeRangeHours(seriesData: [number, number][][]): number {
  let minTime = Infinity
  let maxTime = -Infinity

  for (const data of seriesData) {
    if (data.length > 0) {
      // データは [timestamp, value] の形式でソート済み
      const firstTime = data[0][0]
      const lastTime = data[data.length - 1][0]
      if (firstTime < minTime) minTime = firstTime
      if (lastTime > maxTime) maxTime = lastTime
    }
  }

  if (minTime === Infinity || maxTime === -Infinity) {
    return 0
  }

  return (maxTime - minTime) / (1000 * 60 * 60)
}

/**
 * 時間範囲に応じたフォーマッターを取得する
 * - 24時間未満: HH:mm:ss
 * - 24時間以上72時間未満: MM/DD HH:mm
 * - 72時間以上: MM/DD
 * @param rangeHours 時間範囲（時間単位）
 * @returns フォーマッター関数
 */
export function getTimeFormatter(rangeHours: number): (value: string | number) => string {
  if (rangeHours < 24) {
    // 24時間未満: HH:mm:ss
    return (value: string | number) => {
      const d = new Date(value)
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    }
  } else if (rangeHours < 72) {
    // 24時間以上72時間未満: MM/DD HH:mm
    return (value: string | number) => {
      const d = new Date(value)
      const month = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      const hours = d.getHours().toString().padStart(2, '0')
      const minutes = d.getMinutes().toString().padStart(2, '0')
      return `${month}/${day} ${hours}:${minutes}`
    }
  } else {
    // 72時間以上: MM/DD
    return (value: string | number) => {
      const d = new Date(value)
      const month = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      return `${month}/${day}`
    }
  }
}

/**
 * 時間範囲に応じたX軸の最小表示間隔を取得する
 * - 24時間未満: 自動（制限なし）
 * - 24時間以上72時間未満: 2時間（ラベルが長いため間隔を広げる）
 * - 72時間以上: 自動（制限なし）
 * @param rangeHours 時間範囲（時間単位）
 * @returns 最小表示間隔（ミリ秒）、undefinedの場合は自動
 */
export function getMinInterval(rangeHours: number): number | undefined {
  if (rangeHours >= 24 && rangeHours < 72) {
    // 2時間間隔（ミリ秒）
    return 2 * 60 * 60 * 1000
  }
  return undefined
}

/**
 * 時系列データからX軸のラベル設定を取得する
 * @param seriesData 時系列データの配列 ([timestamp, value][] の配列)
 * @returns X軸のaxisLabel設定オブジェクト
 */
export function getTimeAxisLabelConfig(seriesData: [number, number][][]): {
  formatter: (value: string | number) => string
  minInterval?: number
} {
  const rangeHours = calculateTimeRangeHours(seriesData)
  const formatter = getTimeFormatter(rangeHours)
  const minInterval = getMinInterval(rangeHours)

  return {
    formatter,
    ...(minInterval ? { minInterval } : {})
  }
}
