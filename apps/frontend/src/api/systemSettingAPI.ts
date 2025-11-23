import type { SystemSettingData, SamplingInterval } from '@monitoring/shared/model';
import type { AddSamplingIntervalRequest, UpdateSamplingIntervalRequest } from '@monitoring/shared/api';

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
 * サンプリングインターバル一覧を取得するAPI関数
 * 
 * @returns サンプリングインターバル一覧
 */
export const getSamplingIntervals = () => request<SamplingInterval[]>({
    method: 'get',
    url: '/system_setting/sampling_intervals',
});

/**
 * サンプリングインターバルを追加するAPI関数
 * 
 * @param data - 追加するサンプリングインターバルの情報
 * @returns 追加されたサンプリングインターバル
 */
export const addSamplingInterval = (data: AddSamplingIntervalRequest) => request<SamplingInterval>({
    method: 'post',
    url: '/system_setting/sampling_intervals',
    data
});

/**
 * サンプリングインターバルを更新するAPI関数
 * 
 * @param uuid - 更新するサンプリングインターバルのUUID
 * @param data - 更新する情報
 * @returns 更新されたサンプリングインターバル
 */
export const updateSamplingInterval = (uuid: string, data: UpdateSamplingIntervalRequest) => request<SamplingInterval>({
    method: 'put',
    url: `/system_setting/sampling_intervals/${uuid}`,
    data
});

/**
 * サンプリングインターバルを削除するAPI関数
 * 
 * @param uuid - 削除するサンプリングインターバルのUUID
 */
export const deleteSamplingInterval = (uuid: string) => request<{ message: string }>({
    method: 'delete',
    url: `/system_setting/sampling_intervals/${uuid}`,
});