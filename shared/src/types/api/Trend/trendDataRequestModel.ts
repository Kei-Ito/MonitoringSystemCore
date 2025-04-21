import { trendSpan } from '@shared/enum/trendSpan';
/**
 * フロントエンドからバックエンドにトレンドデータ取得のリクエストを送る際に使用するモデル
 */
export interface trendDataRequest {
  channel_id: number;    // 入力チャンネルID
  start_time: string;     // 取得するトレンドデータの開始時刻(ISO8601形式)
  end_time: string;     // 取得するトレンドデータの終了時刻(ISO8601形式)
  span: trendSpan;      // 取得するトレンドデータの時間間隔
}
