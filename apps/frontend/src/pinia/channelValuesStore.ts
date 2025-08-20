import type { ChannelValue,ChannelRuntimeValue,RuntimeValue } from "@monitoring/shared/model";
import { defineStore } from "pinia";
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import { useToast } from "vue-toastification";


/**
 * IOモジュールのチャンネルごとにランタイム値や時系列データを保持するストア
 */
export const useChannelValuesStore = defineStore("channelValues", {
    /** ------------state-------------- */
    state: () => ({
        channelValues: {} as Record<string, ChannelValue>,
        DeviceHealth:[
            {
                name: "照射炉1",
                status: DeviceHealthEnum.Stop
            },
            {
                name: "照射炉2",
                status: DeviceHealthEnum.Caution
            },
            {
                name: "照射炉3",
                status:     DeviceHealthEnum.Good
            }
        ]
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
        setDeviceHealth(deviceName: string, status: DeviceHealthEnum) {
            
            const device = this.DeviceHealth.find((d) => d.name === deviceName);
            if (device) {
                const last_status = device.status;
                device.status = status;
                if (last_status !== DeviceHealthEnum.Error && status === DeviceHealthEnum.Error) {
                    const toast = useToast();

                    // エラー以外の状態からエラーになった場合にtoastでerrorを通知
                    toast.error(`${deviceName}で閾値外の値が検出されました`);
                }
                else if (last_status !== DeviceHealthEnum.Error && last_status !== DeviceHealthEnum.Caution && status === DeviceHealthEnum.Caution) {
                    const toast = useToast();

                    // エラーと警告以外の状態から警告になった場合にtoastでwarningを通知
                    toast.warning(`${deviceName}で警告値が検出されました`);
                }
            }
        }
    }
});