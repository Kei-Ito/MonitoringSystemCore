/** システム設定関連のapiリクエストとstoreの管理を行うメソッド群 */
import type { IChannelSetting, IOModule } from '@monitoring/shared/model'
import type { ApiError } from '@monitoring/shared/api'
import { err } from '@monitoring/shared/utils'
import * as api from '@/api'
import { useMonitoringStore } from '@/pinia/monitoringStore'
import { handleApiRequest } from '@/service/handle';
import { RequestLock } from '@/utils/requestLock';

/** チャンネル追加ボタン連打の対策 */
const channelLock = new RequestLock<string>(); // key = channelUUID など


/** システム設定をbackendから取得してstoreを更新するメソッド */
export const fetchSystemSetting = () =>
    handleApiRequest({
        apiCall: () => api.getSystemSetting(),
        onSuccess: (val) => {
            // TODO: 以前の実装の名残。修正が望ましい。
            useMonitoringStore().samplingInterval=val.samplingInterval;
        },
        errorMsg: "システム設定の取得に失敗しました",
    });

/** samplingIntervalを更新し、backendへ変更をpushするメソッド */
export const updateSamplingInterval = (samplingInterval: number) =>
    handleApiRequest({
        apiCall: () => api.setSamplingInterval(samplingInterval),
        onSuccess: () => {
            useMonitoringStore().samplingInterval = samplingInterval;
        },
        successMsg: "サンプリング周期を更新しました",
        errorMsg: "サンプリング周期の更新に失敗しました",
    });

/** IOModulesを取得し、backendへ変更をpushするメソッド */
export const getIOModules = () =>
    handleApiRequest({
        apiCall: () => api.getIOModules(),
        onSuccess: (val) => {
            useMonitoringStore().setIOModules(val);
        },
        errorMsg: "IOモジュールの取得に失敗しました",
    });

/** IOModuleを追加し、backendへ変更をpushするメソッド */
export const addIOModule = (module: IOModule) =>
    handleApiRequest({
        apiCall: () => api.addIOModule(module),
        onSuccess: (val) => {
            useMonitoringStore().ioModules.push(val);
        },
        successMsg: "IOモジュールの追加に成功しました",
        errorMsg: "IOモジュールの追加に失敗しました",
    });

/** IOModuleを更新し、backendへ変更をpushするメソッド */
export const updateIOModule = (updatedModule: IOModule) =>
    handleApiRequest({
        apiCall: () => api.updateIOModule(updatedModule),
        onSuccess: (val) => {
            // TODO: ステータスの更新はstore内で行う等変更したほうがいい
            updatedModule.status = val;
            useMonitoringStore().updateIOModule(updatedModule);
        },
        successMsg: "IOモジュールの設定を更新しました",
        errorMsg: "IOモジュールの更新に失敗しました",
    });

/** IOModuleを削除し、backendへ変更をpushするメソッド */
export const deleteIOModule = (moduleUUID: string) =>
    handleApiRequest({
        apiCall: () => api.deleteIOModule(moduleUUID),
        onSuccess: () => {
            useMonitoringStore().deleteIOModule(moduleUUID);
        },
        successMsg: "IOモジュールの削除に成功しました",
        errorMsg: "IOモジュールの削除に失敗しました",
    });

/** IOModuleにチャンネルを追加し、backendへ変更をpushするメソッド */
export const addChannel = (channel: IChannelSetting) =>
    handleApiRequest({
        apiCall: async () => {
            // === ロック取得 ===
            if (!channelLock.tryLock(channel.module_uuid)) {
                // すでに送信中: 直ちにエラー扱いで Result を返す
                // TODO: エラーを返してしまうとtoastで表示されてしまうので、実装を見直したほうがいいかも
                return err<ApiError>({ message: '同じチャンネルを追加中です' });
            }
            try {
                return await api.addChannel(channel);          // ← 通常の API 呼び出し
            } finally {
                channelLock.release(channel.module_uuid);     // === 解放 ===
            }
        },
        onSuccess: (val) => {
            useMonitoringStore().addChannel(val);
        },
        errorMsg: "IOモジュールのチャンネルの追加に失敗しました",
    });

/** IOModuleのチャンネルを削除し、backendへ変更をpushするメソッド */
export const deleteChannel = (channel: IChannelSetting) =>
    handleApiRequest({
        apiCall: () => api.deleteChannel(channel),
        onSuccess: () => {
            useMonitoringStore().deleteChannel(channel);
        },
        errorMsg: "IOモジュールのチャンネルの削除に失敗しました",
    });

/** IOモジュールのサンプリング開始をbackendに通知するメソッド */
export const startSampling = () =>
    handleApiRequest({
        apiCall: () => api.startSampling(),
        onSuccess: (dataList) => {
            useMonitoringStore().$patch(store => {
                dataList.forEach((data) => {
                    const module = store.ioModules.find(m => m.module_uuid === data.module_uuid);
                    if (module) {
                        module.status = data.status;
                    }
                });
            });
        },
        successMsg: "サンプリングを開始しました",
        errorMsg: "サンプリング開始エラー",
    });

/** IOモジュールのサンプリング停止をbackendに通知するメソッド */
export const stopSampling = () =>
    handleApiRequest({
        apiCall: () => api.stopSampling(),
        successMsg: "サンプリングを停止しました",
        errorMsg: "サンプリング停止エラー",
    });

