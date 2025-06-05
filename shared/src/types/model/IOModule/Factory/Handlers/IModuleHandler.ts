import { IOModuleTypes } from "@shared/enum";
import { IOModule } from "@shared/types/model/IOModule";


export interface IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): IOModule;
    createDefaultSpecificInputChannelSetting(): any;
    createDefaultSpecificOutputChannelSetting(): any;
}
