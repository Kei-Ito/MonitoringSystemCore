// apiClient.ts

import axios from 'axios'
import { getIOModuleInputResponse,IOModuleStatusResponse } from '@monitoring/shared/api';
import { Result, ok, err } from '@monitoring/shared/utils';
import { IOModuleStatus } from '@monitoring/shared/enum';
import { IOModule,IChannelSetting } from '@monitoring/shared/model';

const API_BASE_URL = 'http://localhost:8000'; // APIのベースURL

/**
 * IOモジュールの状態をハードウェア制御ソフトウェアと同期するAPI
 * @param module 
 * @returns 
 */
export const fetchIOModule = async (module: IOModule): Promise<IOModuleStatusResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/fetch_module/`, module);
        return response.data;
    }
    catch (error: any) {
        // エラーハンドリング
        if (axios.isAxiosError(error) && error.response) {
            // サーバーからのエラーレスポンスがある場合
            console.error(`Error ${error.response.status}:`, error.response.data.detail || error.response.data);

            if (error.response.status === 400) {
                console.error('Invalid module type or request data.');
            } else {
                console.error('Unexpected error:', error.response.data);
            }
        } else if (error.request) {
            // リクエストがサーバーに到達しなかった場合
            console.error('No response received from server');
        } else {
            // その他のエラー（リクエスト構築エラーなど）
            console.error('Error in request configuration:', error.message);
        }
        return {
            module_uuid: module.module_uuid,
            status: IOModuleStatus.Inactive,
        };
    }

};

/**
 * すべてのIOモジュールの状態をハードウェア制御ソフトウェアと同期するAPI
 * @summary fetchIOModule APIとの違いは、ハードウェア制御ソフトウェアで動作しているIOモジュールがバックエンドで管理されていない場合にハードウェアの終了処理を実行する点
 * @param modules バックエンドで管理しているすべてのIOモジュール
 * @returns 
 */
export async function fetchAllIOModules(modules: IOModule[]): Promise<IOModuleStatusResponse[]>  {
    try {
        const response = await axios.post(`${API_BASE_URL}/fetch_all_modules/`, modules);
        return response.data;
    }
    catch (error: any) {
        // エラーハンドリング
        if (axios.isAxiosError(error) && error.response) {
            // サーバーからのエラーレスポンスがある場合
            console.error(`Error ${error.response.status}:`, error.response.data.detail || error.response.data);

            if (error.response.status === 400) {
                console.error('Invalid module type or request data.');
            } else {
                console.error('Unexpected error:', error.response.data);
            }
        } else if (error.request) {
            // リクエストがサーバーに到達しなかった場合
            console.error('No response received from server');
        } else {
            // その他のエラー（リクエスト構築エラーなど）
            console.error('Error in request configuration:', error.message);
        }

        const status_list= modules.map(module => {
            return {
                module_uuid: module.module_uuid,
                status: IOModuleStatus.Unknown,
            }
        });
        return status_list;
    }
};

export const addIOModule = async (module: IOModule): Promise<Result<IOModule>> => {
    try {
        
        const response = await axios.post<IOModule>(`${API_BASE_URL}/add_module/`, module);
        const response_module_data={
            ...module,
            status:response.data.status,
        }

        return ok(response_module_data);
    }
    catch (error: any) {
        return err(error instanceof Error ? error.message : "Unknown error occurred");
    }
};

export async function updateIOModule(module: IOModule): Promise<Result<IOModuleStatus>> {
    try{
        const response=await axios.post<{}>(`${API_BASE_URL}/update_module/`,module);
        return ok(response.data as IOModuleStatus);
    }
    catch(error:any){
        console.log(error);
        return err(error instanceof Error ? error.message : "Unknown error occurred");
    }
}

export async function addChannel(channel:IChannelSetting):Promise<Result<{}>>{
    try{
        const response=await axios.post<{}>(`${API_BASE_URL}/add_channel/`,channel);
        return ok(response.data);
    }
    catch(error:any){
        return err(error instanceof Error ? error.message : "Unknown error occurred");
    }
}


export async function deleteChannel(channel_setting: IChannelSetting) :Promise<Result<void>>{
    try{
        const response=await axios.delete(`${API_BASE_URL}/delete_channel/`,
            {params:{
                module_uuid:channel_setting.module_uuid,
                channel_id:channel_setting.channel_id,
                direction:channel_setting.direction}});
        return ok(response.data);
    }
    catch(error:any){
        return err(error instanceof Error ? error.message : "Unknown error occurred");
    }
}

// センサーの値取得
export const getIOModuleInput = async (module: IOModule): Promise<Result<getIOModuleInputResponse>> => {
    try {
        const response = await axios.get<getIOModuleInputResponse>(`${API_BASE_URL}/module_input/`, {
            params: {
                module_uuid: module.module_uuid,
                module_type: module.module_type,
            },
        });
        return ok(response.data);
    }
    catch (error: any) {
        return err(error instanceof Error ? error.message : "Unknown error occurred");
    }

};

// センサーの終了（削除）
export const finalizeIOModule = async (module: IOModule): Promise<string> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/module_finalize/`, {
            params: {
                module_uuid: module.module_uuid,
            },
        });
        return response.data.status;
    }
    catch (error: any) {
        return error instanceof Error ? error.message : "Unknown error occurred";
    }
};
