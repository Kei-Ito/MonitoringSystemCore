import { trendSpan } from '@shared/enum/trendSpan';
/**
 * フロントエンドからバックエンドにトレンドデータ取得のリクエストを送る際に使用するモデル
 * 
 * @remarks
 * - 複数日にわたるトレンドデータの取得をサポート
 * - start_time と end_time で指定された期間のデータを取得
 * - CSV ファイルは日付ごとに分割されているため、バックエンドで複数ファイルを読み取って結合
 */
export interface trendDataRequest {
  channel_uuid: string;    // 入力チャンネルUUID
  start_time: string;      // 取得するトレンドデータの開始時刻(ISO8601形式) 例: 2024-01-01T00:00:00.000Z
  end_time: string;        // 取得するトレンドデータの終了時刻(ISO8601形式) 例: 2024-01-31T23:59:59.999Z
  span: trendSpan;         // 取得するトレンドデータの時間間隔(Daily/Weekly/Monthly)
}
