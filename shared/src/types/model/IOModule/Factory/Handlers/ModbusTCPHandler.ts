import { IOModuleTypes ,IOModuleStatus} from "@shared/enum";
import { IModuleHandler} from "./IModuleHandler";
import { ModbusTCP,ModbusTCP_DeviceSetting ,ModbusTCP_InputChannelSetting,ModbusTCP_OutputChannelSetting} from "@shared/types/model/IOModule/Modules";


export class ModbusTCPHandler implements IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): ModbusTCP {
        // ModbusRTU固有の初期化処理
        const modbusRTUModule: ModbusTCP = {
            module_uuid: module_uuid,
            module_type: module_type,
            module_name: module_name,
            status: IOModuleStatus.Uninitialized,
            input_channel_num: 0,
            output_channel_num: 0,
            created_at: new Date(),
            updated_at: new Date(),
            specific_device_setting: {
                host_address:"localhost",
                port:2480
            } as ModbusTCP_DeviceSetting,
            input_channels: [],
            output_channels: [] ,
            is_editable_input_channel: true,
            is_editable_output_channel: true
        };
        return modbusRTUModule;
    }

    createDefaultSpecificInputChannelSetting():ModbusTCP_InputChannelSetting {
        return {
            register_address:1,
            data_length:1,
            slave_id:1,
            function_code:3
        };
    }

    createDefaultSpecificOutputChannelSetting():ModbusTCP_OutputChannelSetting {
        return {
            register_address:1,
            slave_id:1,
            function_code:3
        };
    }
}
