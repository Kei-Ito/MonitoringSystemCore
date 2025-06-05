import { IOModuleStatus,IOModuleTypes } from "@shared/enum";

import { ContecRAI,ContecRAI_DeviceSetting } from "../../Modules";
import { createInputChannelForInitialization } from "../ModuleFactory";
import { IModuleHandler} from "./IModuleHandler";


export class ContecRAIHandler implements IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): ContecRAI {
        // Dummy固有の初期化処理
        const contecRAIModule: ContecRAI = {
            module_uuid: module_uuid,
            module_type: module_type,
            module_name: module_name,
            status: IOModuleStatus.Uninitialized,
            input_channel_num: 8,
            output_channel_num: 0,
            created_at: new Date(),
            updated_at: new Date(),
            specific_device_setting: {
                device_name:"AIO000",
            } as ContecRAI_DeviceSetting,
            input_channels: [],
            output_channels: [],
            is_editable_input_channel: false,
            is_editable_output_channel: false
        };

        
        for (let i = 0; i < contecRAIModule.input_channel_num; i++) {
            contecRAIModule.input_channels.push(createInputChannelForInitialization(module_uuid,module_type));
            contecRAIModule.input_channels[i].channel_name = "input"+i.toString();
        }

        return contecRAIModule;
    }

    createDefaultSpecificInputChannelSetting():{} {
        return {
        };
    }

    createDefaultSpecificOutputChannelSetting():{} {
        return {
        };
    }
}