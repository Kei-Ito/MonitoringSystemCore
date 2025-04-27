import type { ChartSetting } from '@monitoring/shared/model';
import { request } from '@/api/apiClient';


/**
 * ダッシュボードチャートの設定を取得するAPI関数
 * 
 * @returns ダッシュボードチャートの設定を含むPromiseオブジェクト
 */
export const getDashboardCharts = () => request<ChartSetting[]>('get', '/chart/get_dashboard_charts/');

/**
 * ダッシュボードチャートを追加するAPI関数
 * 
 * @param chart - 追加するチャートの設定
 */
export const addDashboardChart= (chart: ChartSetting) => request<void>('post', '/chart/add_dashboard_chart/', chart);

/**
 * ダッシュボードチャートを更新するAPI関数
 * 
 * @param chart - 更新するチャートの設定
 */
export const updateDashboardChart = (chart: ChartSetting) => request<void>('post', '/chart/update_dashboard_chart/', chart);
