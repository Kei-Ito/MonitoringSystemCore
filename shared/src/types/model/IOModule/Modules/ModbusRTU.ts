import { IOModule } from "@shared/types/model/IOModule";

/**
 * ModbusRTUのデバイスに固有の設定
 */
export interface ModbusRTU_DeviceSetting{
    port: string; // ポート
    baudrate: number; // ボーレート
    parity: string; // パリティ
    stop_bits: number; // ストップビット
    byte_size: number; // バイトサイズ
    timeout: number; // タイムアウト
    //必要に応じて拡張
}

/**
 * ModbusRTUの入力チャンネルに固有の設定
 */
export interface ModbusRTU_InputChannelSetting{
    register_address: number; // レジスタアドレス
    data_type: string; // データ型
    slave_id: number; // スレーブID
    data_length: number; // データ長
    //必要に応じて拡張
}

/**
 * ModbusRTUの出力チャンネルに固有の設定
 */
export interface ModbusRTU_OutputChannelSetting{
    register_address: number; // レジスタアドレス
    data_type: string; // データ型
    slave_id: number; // スレーブID
    data_length: number; // データ長
    //必要に応じて拡張
}

export type ModbusRTU = IOModule<ModbusRTU_DeviceSetting,ModbusRTU_InputChannelSetting,ModbusRTU_OutputChannelSetting>;
