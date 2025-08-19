export interface ThresholdConfig {
    warning_min_threshold: number|null; // チャンネルの警告最小閾値
    warning_max_threshold: number|null; // チャンネルの警告最大閾値
    alert_min_threshold: number|null; // チャンネルのアラート最小閾値
    alert_max_threshold: number|null; // チャンネルのアラート最大閾値
}