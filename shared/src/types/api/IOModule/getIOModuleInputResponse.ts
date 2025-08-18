
interface InputStruct{
    channel_uuid:string;
    input_data:number;
}

/**
 * Hardware から取得した入力値を格納するためのインターフェース
 */
export interface getIOModuleInputResponse {
    channels: InputStruct[]; // チャンネルごとの入力値
    module_uuid:string; // モジュールのUUID
    timestamp: string; // タイムスタンプ
}