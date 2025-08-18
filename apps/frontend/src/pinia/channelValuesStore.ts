import type { ChannelValue,ChannelRuntimeValue,RuntimeValue } from "@monitoring/shared/model";
import { defineStore } from "pinia";


/**
 * IOモジュールのチャンネルごとにランタイム値や時系列データを保持するストア
 */
export const useChannelValuesStore = defineStore("channelValues", {
    /** ------------state-------------- */
    state: () => ({
        channelValues: {"channel_mock_uuid0":{
            channel_uuid: "channel_mock_uuid0",
            runtimeValue:{
                value:20,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid1":{
            channel_uuid: "channel_mock_uuid1",
            runtimeValue:{
                value:40,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid2":{
            channel_uuid: "channel_mock_uuid2",
            runtimeValue:{
                value:50,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid3":{
            channel_uuid: "channel_mock_uuid3",
            runtimeValue:{
                value:70,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid4":{
            channel_uuid: "channel_mock_uuid4",
            runtimeValue:{
                value:100,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid5":{
            channel_uuid: "channel_mock_uuid5",
            runtimeValue:{
                value:80,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid6":{
            channel_uuid: "channel_mock_uuid6",
            runtimeValue:{
                value:40,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "channel_mock_uuid7":{
            channel_uuid: "channel_mock_uuid7",
            runtimeValue:{
                value:60,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "000001_1":{
            channel_uuid: "000001_1",
            runtimeValue:{
                value:0,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "000001_2":{
            channel_uuid: "000001_2",
            runtimeValue:{
                value:0,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "000001_3":{
            channel_uuid: "000001_3",
            runtimeValue:{
                value:25,
                timestamp: new Date(),
            },
            timeSeries: []
        },
        "000001_4":{
            channel_uuid: "000001_4",
            runtimeValue:{
                value:60,
                timestamp: new Date(),
            },
            timeSeries: []
        },
            } as Record<string, ChannelValue>,
    }),
    /** ------------actions-------------- */
    actions: {
        /** サンプリングタスクからまとめて反映 */
        bulkUpdate(payload: ChannelRuntimeValue[]) {
            payload.forEach((v) => {
                this.channelValues[v.channel_uuid]= {
                    ...this.channelValues[v.channel_uuid],
                    runtimeValue: {
                        value: v.value,
                        timestamp: v.timestamp,
                    }
                }
            })
        },
        /** 単一値だけ更新 (手入力キャリブレーション等) */
        setRuntimeValue(channelUuid: string, value: number) {
            this.channelValues[channelUuid] = {
                ...this.channelValues[channelUuid],
                runtimeValue: {
                    value,
                    timestamp: new Date(),
                },
            }
        },

        setTimeSeries(channelUuid: string, timeSeries: RuntimeValue[]) {
            this.channelValues[channelUuid] = {
                ...this.channelValues[channelUuid],
                timeSeries,
            }
        },
    }
});