import type { IOModule,IChannelSetting } from '@monitoring/shared/model';
import type { IOModuleStatusResponse } from '@monitoring/shared/api';
import { IOModuleStatus } from '@monitoring/shared/enum';
import { request } from '@/api/apiClient';

/**
 * 全てのIOモジュールを取得するAPI関数
 */
export const getIOModules = () => request<IOModule[]>( 'get', '/io_module/get_io_modules/' );

/**
 * 新しいIOモジュールをシステムに追加するAPI関数
 * @param moduleData 追加するIOモジュールのデータ
 */
export const addIOModule = (moduleData: IOModule) => request<IOModule>('post', '/io_module/add_io_module/', moduleData );

/**
 * 既存のIOモジュールの情報を更新するAPI関数
 * @param moduleData 更新するIOモジュールのデータ
 */
export const updateIOModule = (moduleData: IOModule) => request<IOModuleStatus>('patch', '/io_module/update_io_module/', moduleData );

/**
 * 指定されたUUIDのIOモジュールを削除するAPI関数
 * @param moduleUUID 削除するモジュールのUUID
 */
export const deleteIOModule = (moduleUUID: string) => request<void>('delete', `/io_module/delete_io_module/?module_uuid=${moduleUUID}` );

/**
 * IOモジュールにチャンネルを追加するAPI関数
 * @param channel 追加するチャンネル設定
 */
export const addChannel = (channel: IChannelSetting) => request<IChannelSetting>('post', '/io_module/add_channel/', channel );

/**
 * IOモジュールからチャンネルを削除するAPI関数
 * @param channel 削除するチャンネル設定
 */
export const deleteChannel = (channel: IChannelSetting) => request<void>('post', '/io_module/delete_channel/', channel );

/**
 * IOモジュールのサンプリングを開始するAPI関数
 */
export const startSampling = () => request<IOModuleStatusResponse[]>('post', '/io_module/start/' );

/**
 * IOモジュールのサンプリングを停止するAPI関数
 */
export const stopSampling = () => request<void>('post', '/io_module/stop/' );