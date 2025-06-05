import { IOModuleStatus,IOModuleTypes } from "@shared/enum";
import { ModbusRTU,ModbusRTU_InputChannelSetting,ModbusRTU_OutputChannelSetting } from "@shared/types/model/IOModule/Modules";

import { IModuleHandler} from "./IModuleHandler";


export class ModbusRTUHandler implements IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): ModbusRTU {
        // ModbusRTU固有の初期化処理
        const modbusRTUModule: ModbusRTU = {
            module_uuid: module_uuid,
            module_type: module_type,
            module_name: module_name,
            status: IOModuleStatus.Uninitialized,
            input_channel_num: 0,
            output_channel_num: 0,
            created_at: new Date(),
            updated_at: new Date(),
            specific_device_setting: {
                port: "/dev/ttyUSB0",
                baudrate: 9600,
                parity: "E",
                stop_bits: 2,
                byte_size: 8,
                timeout: 1
            },
            input_channels: [],
            output_channels: [],
            is_editable_input_channel: true,
            is_editable_output_channel: true
        };
        return modbusRTUModule;
    }

    createDefaultSpecificInputChannelSetting(): ModbusRTU_InputChannelSetting {
        return {
            register_address: 0,
            slave_id: 1,
            data_type: "float",
            data_length: 1,
        };
    }

    createDefaultSpecificOutputChannelSetting():ModbusRTU_OutputChannelSetting {
        return {
            register_address: 0,
            slave_id: 1,
            data_type: "float",
            data_length: 1,
        };
    }
}
