import { defineStore } from "pinia";
import type { ChannelRuntimeValue } from "@monitoring/shared/model";

/**
 * IOモジュールのランタイム値を管理するストア
 */
export const useChannelRuntimeValuesStore = defineStore("runtimeValues", {
    /** ------------state-------------- */
    state: () => ({
        runtimeValues: {} as Record<string, ChannelRuntimeValue>,
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