import { IChannelSetting } from "@shared/types/model/IOModule/utils/IChannelSetting";
export interface ChannelRuntimeValue {
    channel_uuid: string; // チャンネルのユニークID
    value: number; // チャンネルの値
    timestamp: Date; // 値が更新された日時
}

type Merge<A,B> = Omit<A, keyof B> & B;
export type ChannelSeries = Merge<IChannelSetting,ChannelRuntimeValue>;
