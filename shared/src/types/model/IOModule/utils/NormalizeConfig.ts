export interface NormalizeConfig {
    is_enabled: boolean; // 正規化の有効/無効
    src_min: number; // チャンネルの最小値
    src_max: number; // チャンネルの最大値
    dst_min: number; // チャンネルの変換後の最小値
    dst_max: number; // チャンネルの変換後の最大値
}