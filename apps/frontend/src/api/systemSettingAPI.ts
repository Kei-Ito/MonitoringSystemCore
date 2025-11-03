import type { SystemSettingData } from '@monitoring/shared/model';

import { request } from '@/api/apiClient';

/**
 * システム設定データを取得するAPI関数
 *
 * @returns システム設定データを含むPromiseオブジェクト
 */
export const getSystemSetting = () => request<SystemSettingData>({
    method: 'get',
    url: '/system_setting/get_system_setting/',
});

/**
 * サンプリング間隔を設定するAPI関数
 * 
 * @param samplingInterval - 設定するサンプリング間隔（単位：ミリ秒）
 */
export const setSamplingInterval = (samplingInterval: number) => request<void>({
    method: 'post',
    url: '/system_setting/set_sampling_interval/',
    data: { samplingInterval }
});