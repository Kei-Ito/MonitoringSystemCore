/**
 * フロントエンドからバックエンドにCSVデータ取得リクエストを送る際に使用するモデル
 * 
 * @remarks
 * - 複数チャンネルの複数日データを一括エクスポート
 * - start_date と end_date で指定された期間のCSVデータを取得
 * - バックエンドで複数日のデータを結合して単一のCSVとして返却
 */
export interface csvDataRequest {
    input_channel_ids: number[];  // エクスポート対象のチャンネルIDリスト
    start_date: string;           // エクスポート開始日(ISO8601形式) 例: 2024-01-01T00:00:00.000Z
    end_date: string;             // エクスポート終了日(ISO8601形式) 例: 2024-01-31T23:59:59.999Z
}