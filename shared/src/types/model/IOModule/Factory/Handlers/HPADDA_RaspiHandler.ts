import { IOModuleStatus,IOModuleTypes } from "@shared/enum";

import { HPADDA_Raspi } from "../../Modules";
import { createInputChannelForInitialization } from "../ModuleFactory";
import { IModuleHandler} from "./IModuleHandler";


export class HPADDA_RaspiHandler implements IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): HPADDA_Raspi {
        // Dummy固有の初期化処理
        const dummyModule: HPADDA_Raspi = {
            module_uuid: module_uuid,
            module_type: module_type,
            module_name: module_name,
            status: IOModuleStatus.Uninitialized,
            input_channel_num: 0,
            output_channel_num: 0,
            created_at: new Date(),
            updated_at: new Date(),
            specific_device_setting: {},
            input_channels: [],
            output_channels: [],
            is_editable_input_channel: false,
            is_editable_output_channel: false
        };
        
        for (let i = 0; i < dummyModule.input_channel_num; i++) {
            dummyModule.input_channels.push(createInputChannelForInitialization(module_uuid,module_type));
        }

        return dummyModule;
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