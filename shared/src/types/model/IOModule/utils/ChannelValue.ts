import { IChannelSetting } from "@shared/types/model/IOModule/utils/IChannelSetting";

export interface RuntimeValue{
    value: number;// チャンネルの値
    timestamp: Date;// 値が更新された日時
}

/**
 * サンプリング時に取得するデータ構造
 */
export interface ChannelRuntimeValue{
    channel_uuid: string;// チャンネルのユニークID
    value: number;// チャンネルの値
    timestamp: Date;// 値が更新された日時
}

export interface ChannelValue {
    channel_uuid: string; // チャンネルのユニークID
    runtimeValue: RuntimeValue;
    timeSeries: RuntimeValue[];
}

type Merge<A,B> = Omit<A, keyof B> & B;
export type ChannelSeries = Merge<IChannelSetting,ChannelValue>;
