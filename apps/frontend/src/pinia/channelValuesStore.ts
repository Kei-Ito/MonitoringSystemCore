import type { ChannelValue, ChannelRuntimeValue, RuntimeValue } from "@monitoring/shared/model";
import { defineStore } from "pinia";
import { markRaw } from "vue";
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum';
import { useToast } from "vue-toastification";

/** デバイスの健康状態 */
interface DeviceHealthStatus {
    name: string;
    status: DeviceHealthEnum;
}

/** フロントエンド用に拡張したChannelValue型 */
interface StoreChannelValue extends ChannelValue {
    realtimeSeries: RuntimeValue[];
    /**
     * データのバージョン管理用カウンター
     * timeSeriesをmarkRawで非リアクティブ化しているため、
     * 変更検知のためにこの値をインクリメントして使用する
     */
    dataVersion: number;
}

/**
 * IOモジュールのチャンネルごとにランタイム値や時系列データを保持するストア
 */
export const useChannelValuesStore = defineStore("channelValues", {
    /** ------------state-------------- */
    state: () => ({
        /** チャンネルUUID → 値のマッピング */
        channelValues: {} as Record<string, StoreChannelValue>,
        /** デバイス健康状態の配列 */
        deviceHealthStatuses: [] as DeviceHealthStatus[],
        /** 初期化済みフラグ */
        isInitialized: false,
        /** 読み込まれているデータの期間 */
        loadedDateRange: null as { startDate: Date, endDate: Date } | null,
        /** チャンネルごとのローディング状態 */
        loadingChannels: {} as Record<string, boolean>,
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
         * 指定チャンネルがローディング中かどうかを取得
         */
        isChannelLoading: (state) => (channelUuid: string): boolean => {
            return !!state.loadingChannels[channelUuid];
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
                const rv = {
                    value: v.value,
                    timestamp: v.timestamp,
                };
                this._updateChannelValue(v.channel_uuid, rv);
                this._appendRealtimeSeries(v.channel_uuid, rv);
            });
        },
        
        /**
         * 単一チャンネルのランタイム値を更新（手入力キャリブレーション等）
         */
        setRuntimeValue(channelUuid: string, value: number) {
            const runtimeValue = {
                value,
                timestamp: new Date(),
            };
            this._updateChannelValue(channelUuid, runtimeValue);
            this._appendRealtimeSeries(channelUuid, runtimeValue);
            this._appendTimeSeries(channelUuid, runtimeValue);
        },
        
        /**
         * 指定チャンネルの時系列データを設定
         * 
         * メモリ最適化のため、timeSeriesはmarkRawでラップしてVueの監視対象外とする。
         * 代わりにdataVersionを更新して変更を通知する。
         */
        setTimeSeries(channelUuid: string, timeSeries: RuntimeValue[]) {
            if (!this.channelValues[channelUuid]) {
                this.channelValues[channelUuid] = {
                    channel_uuid: channelUuid,
                    runtimeValue: { value: 0, timestamp: new Date() },
                    timeSeries: markRaw([]),
                    realtimeSeries: [],
                    dataVersion: 0,
                };
            }
            this.channelValues[channelUuid].timeSeries = markRaw(timeSeries);
            this.channelValues[channelUuid].dataVersion++;
        },
        
        /**
         * 読み込まれているデータの期間を設定
         */
        setLoadedDateRange(range: { startDate: Date, endDate: Date }) {
            this.loadedDateRange = range;
        },

        /**
         * 指定チャンネルのローディング状態を設定
         */
        setChannelLoading(channelUuid: string, isLoading: boolean) {
            this.loadingChannels[channelUuid] = isLoading;
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

        /**
         * 全チャンネルの時系列データをクリア
         */
        clearAllTimeSeries() {
            Object.values(this.channelValues).forEach(channel => {
                channel.timeSeries = markRaw([]);
                channel.dataVersion++;
            });
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
                    timeSeries: markRaw([]),
                    realtimeSeries: [],
                    dataVersion: 0,
                };
            } else {
                this.channelValues[channelUuid].runtimeValue = runtimeValue;
            }
        },
        
        /**
         * リアルタイム時系列データに追加（最大点数制限あり）
         * @private
         */
        _appendRealtimeSeries(channelUuid: string, runtimeValue: RuntimeValue) {
            // _updateChannelValueで初期化されているはずだが念のため
            if (!this.channelValues[channelUuid]) {
                this._updateChannelValue(channelUuid, runtimeValue);
            }
            
            const series = this.channelValues[channelUuid].realtimeSeries;
            series.push(runtimeValue);
            
            // 最大点数を制限（例: 300点）
            // サンプリング周期によるが、1秒1回なら5分、100msなら30秒程度
            const MAX_POINTS = 300;
            if (series.length > MAX_POINTS) {
                series.shift();
            }
        },

        /**
         * トレンド用時系列データに追加
         * @private
         */
        _appendTimeSeries(channelUuid: string, runtimeValue: RuntimeValue) {
            if (!this.channelValues[channelUuid]) return;
            
            // loadedDateRange のチェック
            if (this.loadedDateRange) {
                const time = runtimeValue.timestamp.getTime();
                const start = this.loadedDateRange.startDate.getTime();
                const end = this.loadedDateRange.endDate.getTime();
                
                // 範囲内であれば追加
                if (time >= start && time <= end) {
                    // markRawされた配列へのpushはリアクティブ更新をトリガーしないため
                    // dataVersionをインクリメントして変更を通知する
                    this.channelValues[channelUuid].timeSeries.push(runtimeValue);
                    this.channelValues[channelUuid].dataVersion++;
                }
            }
        },

        /**
         * リアルタイムデータの受信ハンドラ（分岐処理）
         */
        updateRealtimeData(channelUuid: string, runtimeValue: RuntimeValue, isCumulative: boolean = false, intervalMinutes: number = 60) {
            // 積算計算用に前回の値を取得しておく
            const previousRuntimeValue = this.channelValues[channelUuid]?.runtimeValue;

            // 共通: 最新値(runtimeValue)の更新
            this._updateChannelValue(channelUuid, runtimeValue);

            if (isCumulative) {
                // 積算値の場合の更新ロジック
                this._updateCumulativeSeries(channelUuid, runtimeValue, previousRuntimeValue, intervalMinutes);
            } else {
                // 通常（瞬時値）の場合の更新ロジック
                this._appendRealtimeSeries(channelUuid, runtimeValue);
                this._appendTimeSeries(channelUuid, runtimeValue);
            }
        },

        /**
         * 積算グラフ用のリアルタイム更新処理
         * 最新の区間に対して積分値を加算する
         * @private
         */
        _updateCumulativeSeries(channelUuid: string, currentRuntimeValue: RuntimeValue, previousRuntimeValue: RuntimeValue | undefined, intervalMinutes: number) {
            if (!this.channelValues[channelUuid]) return;
            
            const timeSeries = this.channelValues[channelUuid].timeSeries;
            // データがない場合は何もしない（初回ロード待ち）か、新規作成する
            if (timeSeries.length === 0) return;

            // 配列の最後の要素（最新の区間）を取得
            // markRawされているため、直接変更してもVueは検知しないことに注意
            const lastIndex = timeSeries.length - 1;
            const lastPoint = timeSeries[lastIndex];
            
            const currentTimestamp = new Date(currentRuntimeValue.timestamp).getTime();
            const lastBucketStart = new Date(lastPoint.timestamp).getTime();
            const intervalMs = intervalMinutes * 60 * 1000;

            // 現在のデータが「最新の区間」に含まれるか判定
            if (currentTimestamp < lastBucketStart + intervalMs) {
                // --- ケースA: 同じ区間内なら値を更新（積分） ---
                
                if (previousRuntimeValue) {
                    const prevTimestamp = new Date(previousRuntimeValue.timestamp).getTime();
                    const timeDiffSec = (currentTimestamp - prevTimestamp) / 1000;
                    
                    // 5分以上の間隔がある場合はスキップ（AnalysisServiceと同様）
                    const skipThresholdSec = 300;
                    
                    if (timeDiffSec > 0 && timeDiffSec < skipThresholdSec) {
                        // 台形積分: (前回値 + 今回値) / 2 * 秒数
                        const addedValue = ((previousRuntimeValue.value + currentRuntimeValue.value) / 2) * timeDiffSec;
                        
                        lastPoint.value += addedValue;
                        this.channelValues[channelUuid].dataVersion++;
                    }
                }
            } else {
                // --- ケースB: 新しい区間に入った場合 ---
                
                // 新しい区間の開始時刻を計算
                const newBucketStart = Math.floor(currentTimestamp / intervalMs) * intervalMs;
                
                // 新しい要素を追加
                const newPoint = {
                    timestamp: new Date(newBucketStart),
                    value: 0 
                };
                
                timeSeries.push(newPoint);
                this.channelValues[channelUuid].dataVersion++;
                
                // 再帰的に呼び出して、新しい区間に値を加算する
                this._updateCumulativeSeries(channelUuid, currentRuntimeValue, previousRuntimeValue, intervalMinutes);
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
