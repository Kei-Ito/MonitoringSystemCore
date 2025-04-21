import { IOModule } from "@shared/types/model/IOModule";
import { IOModuleTypes } from "@shared/enum";


export interface IModuleHandler {
    createModuleForInitialization(module_uuid:string,module_name:string,module_type:IOModuleTypes): IOModule;
    createDefaultSpecificInputChannelSetting(): any;
    createDefaultSpecificOutputChannelSetting(): any;
}
