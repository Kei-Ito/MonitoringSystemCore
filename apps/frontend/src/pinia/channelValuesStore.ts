import type { ChannelValue, ChannelRuntimeValue, RuntimeValue } from "@monitoring/shared/model";
import { defineStore } from "pinia";
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import { useToast } from "vue-toastification";

/** デバイスの健康状態 */
interface DeviceHealthStatus {
    name: string;
    status: DeviceHealthEnum;
}

/**
 * IOモジュールのチャンネルごとにランタイム値や時系列データを保持するストア
 */
export const useChannelValuesStore = defineStore("channelValues", {
    /** ------------state-------------- */
    state: () => ({
        /** チャンネルUUID → 値のマッピング */
        channelValues: {} as Record<string, ChannelValue>,
        /** デバイス健康状態の配列 */
        deviceHealthStatuses: [] as DeviceHealthStatus[],
        /** 初期化済みフラグ */
        isInitialized: false,
    }),
    
    /** ------------getters-------------- */
    getters: {
        /**
         * 指定チャンネルの最新値を取得
         */
        getRuntimeValue: (state) => (channelUuid: string): RuntimeValue | undefined => {
            return state.channelValues[channelUuid]?.runtimeValue;
        },
        
        /**
         * 指定チャンネルの時系列データを取得
         */
        getTimeSeries: (state) => (channelUuid: string): RuntimeValue[] => {
            return state.channelValues[channelUuid]?.timeSeries ?? [];
        },
        
        /**
         * 指定デバイスの健康状態を取得
         */
        getDeviceHealth: (state) => (deviceName: string): DeviceHealthEnum | undefined => {
            return state.deviceHealthStatuses.find(d => d.name === deviceName)?.status;
        },
        
        /**
         * 全デバイスの健康状態を取得
         */
        allDeviceHealthStatuses: (state) => state.deviceHealthStatuses,
    },
    
    /** ------------actions-------------- */
    actions: {
        /**
         * デバイス健康状態を初期化
         * アプリケーション起動時に呼び出される
         */
        initializeDeviceHealth(devices: DeviceHealthStatus[]) {
            this.deviceHealthStatuses = devices;
            this.isInitialized = true;
        },
        
        /**
         * サンプリングタスクから複数チャンネル値を一括更新
         */
        bulkUpdate(payload: ChannelRuntimeValue[]) {
            payload.forEach((v) => {
                this._updateChannelValue(v.channel_uuid, {
                    value: v.value,
                    timestamp: v.timestamp,
                });
            });
        },
        
        /**
         * 単一チャンネルのランタイム値を更新（手入力キャリブレーション等）
         */
        setRuntimeValue(channelUuid: string, value: number) {
            this._updateChannelValue(channelUuid, {
                value,
                timestamp: new Date(),
            });
        },
        
        /**
         * 指定チャンネルの時系列データを設定
         */
        setTimeSeries(channelUuid: string, timeSeries: RuntimeValue[]) {
            if (!this.channelValues[channelUuid]) {
                this.channelValues[channelUuid] = {
                    channel_uuid: channelUuid,
                    runtimeValue: { value: 0, timestamp: new Date() },
                    timeSeries: [],
                };
            }
            this.channelValues[channelUuid].timeSeries = timeSeries;
        },
        
        /**
         * アクティブなチャンネル以外のデータを削除（メモリ節約）
         * @param activeChannelUuids 保持するチャンネルUUIDのセット
         */
        prune(activeChannelUuids: Set<string>) {
            Object.keys(this.channelValues).forEach((key) => {
                if (!activeChannelUuids.has(key)) {
                    delete this.channelValues[key];
                }
            });
        },
        
        /**
         * デバイスの健康状態を更新し、必要に応じて通知を発火
         */
        setDeviceHealth(deviceName: string, status: DeviceHealthEnum) {
            const device = this.deviceHealthStatuses.find((d) => d.name === deviceName);
            if (!device) {
                console.warn(`Device "${deviceName}" not found in health statuses`);
                return;
            }
            
            const previousStatus = device.status;
            device.status = status;
            
            // 状態変化時の通知（副作用を分離）
            this._notifyHealthStatusChange(deviceName, previousStatus, status);
        },
        
        /**
         * 全チャンネルデータをクリア
         */
        clear() {
            this.channelValues = {};
        },
        
        // ----- Private methods -----
        
        /**
         * チャンネル値を内部的に更新（共通処理）
         * @private
         */
        _updateChannelValue(channelUuid: string, runtimeValue: RuntimeValue) {
            if (!this.channelValues[channelUuid]) {
                this.channelValues[channelUuid] = {
                    channel_uuid: channelUuid,
                    runtimeValue,
                    timeSeries: [],
                };
            } else {
                this.channelValues[channelUuid].runtimeValue = runtimeValue;
            }
        },
        
        /**
         * 健康状態変化時の通知処理（UI副作用を分離）
         * @private
         */
        _notifyHealthStatusChange(
            deviceName: string,
            previousStatus: DeviceHealthEnum,
            newStatus: DeviceHealthEnum
        ) {
            const toast = useToast();
            
            // エラー状態への遷移
            if (previousStatus !== DeviceHealthEnum.Error && newStatus === DeviceHealthEnum.Error) {
                toast.error(`${deviceName}で閾値外の値が検出されました`);
            }
            // 警告状態への遷移
            else if (
                previousStatus !== DeviceHealthEnum.Error &&
                previousStatus !== DeviceHealthEnum.Caution &&
                newStatus === DeviceHealthEnum.Caution
            ) {
                toast.warning(`${deviceName}で警告値が検出されました`);
            }
        },
    }
});
