/**
 * トレンド画面の表示期間プリセットモード
 */
export const TrendPresetMode = {
  /** リアルタイム（今日のデータを表示） */
  Realtime: 'realtime',
  /** 直近1週間 */
  LastWeek: 'last_week',
  /** 直近1ヶ月 */
  LastMonth: 'last_month',
  /** カスタム期間 */
  Custom: 'custom',
} as const;

export type TrendPresetMode = typeof TrendPresetMode[keyof typeof TrendPresetMode];
