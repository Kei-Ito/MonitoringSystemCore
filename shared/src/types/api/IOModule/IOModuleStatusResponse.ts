import { IOModuleStatus } from '@shared/enum/';

export interface IOModuleStatusResponse {
    module_uuid: string;
    status: IOModuleStatus;
}