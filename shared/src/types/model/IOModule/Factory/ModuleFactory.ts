import { IOModuleTypes } from "@shared/enum";
import { IOModule } from "@shared/types/model/IOModule";
import * as IModules from "@shared/types/model/IOModule/Modules";
import { IChannelSetting } from "@shared/types/model/IOModule/utils/IChannelSetting";
import { v4 as uuidv4 } from "uuid";

import * as Handlers from "./Handlers";
import { IModuleHandler } from "./Handlers/IModuleHandler";

// ハンドラのマッピング
const handlers: Record<IOModuleTypes, IModuleHandler> = {
    [IOModuleTypes.Dummy]: new Handlers.DummyHandler(),
    [IOModuleTypes.HPADDA_Raspi]: new Handlers.HPADDA_RaspiHandler(),
    [IOModuleTypes.ModbusRTU]: new Handlers.ModbusRTUHandler(),
    [IOModuleTypes.ModbusTCP]: new Handlers.ModbusTCPHandler(),
    [IOModuleTypes.ContecRAI]: new Handlers.ContecRAIHandler(),

    // 新規モジュールタイプを追加するときはここにハンドラを登録
    // 例: [IOModuleTypes.XYZModule]: new XYZModuleHandler(),
};

export interface ModuleTypeMap {
    [IOModuleTypes.Dummy]: IModules.Dummy;
    [IOModuleTypes.HPADDA_Raspi]: IModules.HPADDA_Raspi;
    [IOModuleTypes.ModbusRTU]: IModules.ModbusRTU;
    [IOModuleTypes.ModbusTCP]: IModules.ModbusTCP;
    [IOModuleTypes.ContecRAI]: IModules.ContecRAI;
    // 新規モジュールタイプを追加するときはここにモジュールを登録
    // 例: [IOModuleTypes.XYZModule]:IModules.XYZModule;
}

export function createModuleForInitialization(module_uuid: string, module_name: string, module_type: IOModuleTypes): IOModule {
    const handler = handlers[module_type];
    if (!handler) {
        throw new Error(`Module type :${module_type} はファクトリメソッドで未対応です。`);
    }
    return handler.createModuleForInitialization(module_uuid, module_name, module_type);
}

/**
 * それぞれのモジュールに固有の入力チャンネル設定を生成する
 * @param module_uuid 
 * @param channel_id 
 * @param module_type 
 * @returns 
 */
export function createInputChannelForInitialization(module_uuid: string,module_type:IOModuleTypes): IChannelSetting {
    const handler = handlers[module_type];
    if (!handler) {
        throw new Error(`Module type :${module_type} はファクトリメソッドで未対応です。`);
    }

    const channel_uuid = uuidv4();
    return {
        channel_uuid: channel_uuid,
        channel_name: "",
        module_uuid: module_uuid,
        direction: "input",
        unit: "",
        channel_number: -1,
        decimals: 2,
        normalize:{
            is_enabled: false,
            src_min: 0,
            src_max: 5,
            dst_min: 0,
            dst_max: 5,
        },
        threshold:{
            warning_min_threshold: null,
            warning_max_threshold: null,
            alert_min_threshold: null,
            alert_max_threshold: null,
        },
        specific_channel_setting: handler.createDefaultSpecificInputChannelSetting(),
        created_at: new Date(),
        updated_at: new Date(),
    }
}

/**
 * それぞれのモジュールに固有の出力チャンネル設定を生成する
 * @param module_uuid 
 * @param channel_id 
 * @param module_type 
 * @returns 
 */
export function createOutputChannelForInitialization(module_uuid: string,module_type:IOModuleTypes): IChannelSetting {
    const handler = handlers[module_type];
    if (!handler) {
        throw new Error(`Module type :${module_type} はファクトリメソッドで未対応です。`);
    }

    const channel_uuid = uuidv4();

    return {
        channel_uuid: channel_uuid,
        channel_name: "",
        module_uuid: module_uuid,
        direction: "output",
        unit: "",
        channel_number: -1,
        decimals: 2,
        normalize:{
            is_enabled: false,
            src_min: 0,
            src_max: 5,
            dst_min: 0,
            dst_max: 5,
        },
        threshold:{
            warning_min_threshold: null,
            warning_max_threshold: null,
            alert_min_threshold: null,
            alert_max_threshold: null,
        },
        specific_channel_setting: handler.createDefaultSpecificOutputChannelSetting(),
        created_at: new Date(),
        updated_at: new Date(),
    }
}

