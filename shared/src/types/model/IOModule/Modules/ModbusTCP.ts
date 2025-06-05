import { ModbusFunctionCode } from "@shared/enum/ModbusFunctionCode";
import { IOModule } from "@shared/types/model/IOModule";

/**
 * ModbusTCPのデバイスに固有の設定
 */
export interface ModbusTCP_DeviceSetting{
    host_address:string //サーバーのIPアドレス
    port:number //サーバーのポート
    //必要に応じて拡張
}

/**
 * ModbusTCPの入力チャンネルに固有の設定
 */
export interface ModbusTCP_InputChannelSetting{
    register_address: number; // レジスタアドレス
    data_length: number; // 読み取り時のデータ長 
    slave_id: number; // スレーブID
    function_code: ModbusFunctionCode; 
    //必要に応じて拡張
}

/**
 * ModbusTCPの出力チャンネルに固有の設定
 */
export interface ModbusTCP_OutputChannelSetting{
    register_address: number; // レジスタアドレス
    slave_id: number; // スレーブID
    function_code: ModbusFunctionCode; 
    //必要に応じて拡張
}

export type ModbusTCP = IOModule<ModbusTCP_DeviceSetting,ModbusTCP_InputChannelSetting,ModbusTCP_OutputChannelSetting>;
