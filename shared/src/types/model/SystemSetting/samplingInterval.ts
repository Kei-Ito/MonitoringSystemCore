export interface SamplingInterval {
    name: string;
    uuid: string;
    period: number; // ミリ秒単位
    requiresAdmin: boolean; // 編集に管理者権限が必要かどうか
}
