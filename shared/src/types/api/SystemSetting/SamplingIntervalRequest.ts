/**
 * サンプリングインターバル追加リクエスト
 */
export interface AddSamplingIntervalRequest {
    name: string;
    period: number; // ミリ秒単位
}

/**
 * サンプリングインターバル更新リクエスト
 */
export interface UpdateSamplingIntervalRequest {
    name?: string;
    period?: number; // ミリ秒単位
}
