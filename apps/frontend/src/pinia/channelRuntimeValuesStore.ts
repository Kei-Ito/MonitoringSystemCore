import { defineStore } from "pinia";
import type { ChannelRuntimeValue } from "@monitoring/shared/model";

/**
 * IOモジュールのランタイム値を管理するストア
 */
export const useChannelRuntimeValuesStore = defineStore("runtimeValues", {
    /** ------------state-------------- */
    state: () => ({
        runtimeValues: {"channel_mock_uuid0":{
            channel_uuid: "channel_mock_uuid0",
            value: 20,
            timestamp: new Date(),
        },
        "channel_mock_uuid1":{
            channel_uuid: "channel_mock_uuid1",
            value: 30,
            timestamp: new Date(),
        },
        "channel_mock_uuid2":{
            channel_uuid: "channel_mock_uuid2",
            value: 40,
            timestamp: new Date(),
        },
        "channel_mock_uuid3":{
            channel_uuid: "channel_mock_uuid3",
            value: 40,
            timestamp: new Date(),
        },
        "channel_mock_uuid4":{
            channel_uuid: "channel_mock_uuid4",
            value: 100,
            timestamp: new Date(),
        },
        "channel_mock_uuid5":{
            channel_uuid: "channel_mock_uuid5",
            value: 80,
            timestamp: new Date(),
        },
        "channel_mock_uuid6":{
            channel_uuid: "channel_mock_uuid6",
            value: 40,
            timestamp: new Date(),
        },
        "channel_mock_uuid7":{
            channel_uuid: "channel_mock_uuid7",
            value: 60,
            timestamp: new Date(),
        },
            } as Record<string, ChannelRuntimeValue>,
    }),
    /** ------------actions-------------- */
    actions: {
        /** サンプリングタスクからまとめて反映 */
        bulkUpdate(payload: ChannelRuntimeValue[]) {
            payload.forEach((v) => {
                this.runtimeValues[v.channel_uuid] = v
            })
        },
        /** 単一値だけ更新 (手入力キャリブレーション等) */
        setValue(channel_uuid: string, value: number) {
            this.runtimeValues[channel_uuid] = {
                channel_uuid,
                value,
                timestamp: new Date(),
            }
        },
    }
});