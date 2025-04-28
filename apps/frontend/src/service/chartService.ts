import type { ChartSetting } from '@monitoring/shared/model'
import type { ApiError } from '@monitoring/shared/api'
import { err } from '@monitoring/shared/utils'
import * as api from '@/api'
import { useChartStore } from '@/pinia/chartStore';
import { handleApiRequest } from '@/service/handle';
import { RequestLock } from '@/utils/requestLock';


/** チャート追加ボタン連打の対策 */
const chartLock = new RequestLock<number>(); // key = chartID

/** ダッシュボードのグラフの設定をbackendから取得するメソッド */
export const getDashboardCharts = () =>
    handleApiRequest({
        apiCall: () => api.getDashboardCharts(),
        onSuccess: (val) => {
            useChartStore().$patch({ dashboardCharts: val });
        },
        errorMsg: "ダッシュボードの取得に失敗しました",
    });

/** ダッシュボードのグラフの追加をbackendにpushするメソッド */
export const addDashboardChart = (chart: ChartSetting) =>
    handleApiRequest({
        apiCall: async () => {
            // === ロック取得 ===
            if (!chartLock.tryLock(chart.chart_id)) {
                // すでに送信中: 直ちにエラー扱いで Result を返す
                // TODO: エラーを返してしまうとtoastで表示されてしまうので、実装を見直したほうがいいかも
                return err<ApiError>({ message: '同じグラフを追加中です' });
            }
            try {
                return await api.addDashboardChart(chart);          // ← 通常の API 呼び出し
            } finally {
                chartLock.release(chart.chart_id);           // === 解放 ===
            }
        },
        onSuccess: () => {
            useChartStore().dashboardCharts.push(chart);
        },
        errorMsg: "グラフの追加に失敗しました",
    });

/** ダッシュボードのグラフの設定更新をbackendにpushするメソッド */

export const updateDashboardChart = (chart: ChartSetting) =>
    handleApiRequest({
        apiCall: () => api.updateDashboardChart(chart),
        onSuccess: () => {
            useChartStore().updateDashboardChart(chart);
        },
        errorMsg: "更新に失敗しました",
    });