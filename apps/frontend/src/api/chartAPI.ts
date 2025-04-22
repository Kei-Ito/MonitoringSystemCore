import axios from 'axios';
import type { ChartSetting } from '@monitoring/shared/model';

const protocol = window.location.protocol;
const host = window.location.hostname;

export async function getDashboardCharts(): Promise<ChartSetting[]> {
    const endpoint = `${protocol}//${host}:2478/api/chart/get_dashboard_charts/`;
    return axios.get(endpoint)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error getting Dashboard Chart:', error);
            throw error;
        });
}

export async function addDashboardChart(chart: ChartSetting): Promise<void> {
    const endpoint = `${protocol}//${host}:2478/api/chart/add_dashboard_chart/`;
    return axios.post(endpoint, chart)
        .then(() => {
            console.log('Chart added:', chart.channel_id);
        })
        .catch(error => {
            console.error('Error adding chart:', error);
            throw error;
        });
}

export async function updateDashboardChart(chart: ChartSetting): Promise<void> {
    const endpoint = `${protocol}//${host}:2478/api/chart/update_dashboard_chart/`;
    return axios.post(endpoint, chart)
        .then(() => {
            console.log('Chart updated:', chart.channel_id);
        })
        .catch(error => {
            console.error('Error updating chart:', error);
            throw error;
        });
}
