/**
 * サンプリングインターバル追加リクエスト
 */
export interface AddSamplingIntervalRequest {
    name: string;
    period: number; // ミリ秒単位
    requiresAdmin?: boolean; // 編集に管理者権限が必要かどうか（デフォルト: false）
}

/**
 * サンプリングインターバル更新リクエスト
 */
export interface UpdateSamplingIntervalRequest {
    name?: string;
    period?: number; // ミリ秒単位
    requiresAdmin?: boolean; // 編集に管理者権限が必要かどうか
}
