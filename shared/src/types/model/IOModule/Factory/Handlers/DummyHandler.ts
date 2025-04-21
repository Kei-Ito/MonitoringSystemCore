import { IOModuleTypes ,IOModuleStatus} from "@shared/enum";
import { Dummy } from "../../Modules/Dummy";
import { IModuleHandler} from "./IModuleHandler";
import { createInputChannelForInitialization } from "../ModuleFactory";


export class DummyHandler implements IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): Dummy {
        // Dummy固有の初期化処理
        const dummyModule: Dummy = {
            module_uuid: module_uuid,
            module_type: module_type,
            module_name: module_name,
            status: IOModuleStatus.Uninitialized,
            input_channel_num: 8,
            output_channel_num: 0,
            created_at: new Date(),
            updated_at: new Date(),
            specific_device_setting: {},
            input_channels: [],
            output_channels: [],
            is_editable_input_channel: true,
            is_editable_output_channel: false
        };

        
        for (let i = 0; i < dummyModule.input_channel_num; i++) {
            dummyModule.input_channels.push(createInputChannelForInitialization(module_uuid,-1,module_type));
            dummyModule.input_channels[i].channel_name = "input"+i.toString();
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