import axios from 'axios';
import type { SystemSettingData } from '@monitoring/shared/model';

const protocol = window.location.protocol;
const host = window.location.hostname;

export async function getSystemSetting(): Promise<SystemSettingData> {
    const endpoint = `${protocol}//${host}:2478/api/system_setting/get_system_setting/`;
    return axios.get(endpoint)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting SystemSetting:', error);
            throw error;
        });
}

export async function setSamplingInterval(samplingInterval:number): Promise<void> {
    const endpoint = `${protocol}//${host}:2478/api/system_setting/set_sampling_interval/`;
    return axios.post(endpoint,{samplingInterval:samplingInterval})
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting SystemSetting:', error);
            throw error;
        });
}