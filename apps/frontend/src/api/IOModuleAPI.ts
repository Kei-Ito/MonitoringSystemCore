import axios from 'axios';
import type { IOModule,IChannelSetting } from '@monitoring/shared/model';
import type { IOModuleStatusResponse } from '@monitoring/shared/api';
import {type Result , ok , err} from '@monitoring/shared/utils';
import { IOModuleStatus } from '@monitoring/shared/enum';

const protocol = window.location.protocol;
const host = window.location.hostname;

export async function getIOModules(): Promise<IOModule[]> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/get_io_modules/`;
    return axios.get(endpoint)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error getting IOModules:', error);
            throw error;
        });
}

export async function addIOModule(request: IOModule): Promise<Result<IOModule>> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/add_io_module/`;
    return axios.post(endpoint, request)
        .then(response => {
            return ok(response.data);
        })
        .catch(error => {
            console.error('Error adding IOModule:', error);
            return err(error);
        });
}

export async function updateIOModule(IOModule: IOModule):Promise<Result<IOModuleStatus>> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/update_io_module/`;
    return axios.patch(endpoint, IOModule)
        .then(response => {
            return ok(response.data);
        })
        .catch(error => {
            console.error('Error updating IOModule:', error);
            return err(error);
        });
}

export async function deleteIOModule(moduleUUID: string) : Promise<Result<void>> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/?module_uuid=${moduleUUID}`;
    return axios.delete(endpoint)
        .then(response => {
            console.log('Delete successful:', response.data);
            return ok(void 0);
        })
        .catch(error => {
            console.error('Error deleting IOModule:', error);
            return err(error);
        });
}


export async function addChannel(channel: IChannelSetting): Promise<IChannelSetting> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/add_channel/`;
    return axios.post(endpoint, channel)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error adding Channel:', error);
            throw error;
        });
}

export async function deleteChannel(channel_setting: IChannelSetting) {
    const endpoint = `${protocol}//${host}:2478/api/io_module/delete_channel/`;
    return axios.post(endpoint, channel_setting)
        .then(response => {
            console.log('Delete successful:', response.data);
            return;
        })
        .catch(error => {
            console.error('Error deleting Channel:', error);
            throw error;
        });
}

export async function startSampling(): Promise<Result<IOModuleStatusResponse[]>> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/start/`;
    return await axios.post(endpoint)
        .then(response => {
            return ok(response.data);
        })
        .catch(error => {
            return err(error);
        });
}

export async function stopSampling() : Promise<Result<void>> {
    const endpoint = `${protocol}//${host}:2478/api/io_module/stop/`;
    return await axios.post(endpoint)
        .then(response => {
            console.log('Data sent successfully:', response.data);
            return ok(void 0);
        })
        .catch(error => {
            console.error('Error sending data:', error);
            return err(error);
        });
}