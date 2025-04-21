/**
 * フロントエンドからバックエンドにCSVデータ取得リクエストを送る際に使用するモデル
 */
export interface csvDataRequest {
    input_channel_ids: number[]  
    date:string
}