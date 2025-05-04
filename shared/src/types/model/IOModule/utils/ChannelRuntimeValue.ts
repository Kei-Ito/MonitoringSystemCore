export interface ChannelRuntimeValue {
    channel_uuid: string; // チャンネルのユニークID
    value: number; // チャンネルの値
    timestamp: Date; // 値が更新された日時
}