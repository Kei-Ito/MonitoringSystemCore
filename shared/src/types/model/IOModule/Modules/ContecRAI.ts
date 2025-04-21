import { IOModule } from "@shared/types/model/IOModule";

/**
 * ContecのRaspberry pi用IOモジュール
 */
export interface ContecRAI_DeviceSetting{
    device_name: string; // 接続時に必要なデバイス名
}


export type ContecRAI = IOModule<ContecRAI_DeviceSetting,{},{}>;
