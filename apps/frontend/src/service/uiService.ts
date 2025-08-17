import type { ChartConfig } from '@monitoring/shared/model'

import * as api from '@/api'
import { useChartStore } from '@/pinia/chartStore';
import { handleApiRequest } from '@/service/handle';


/**
 * UIレイアウトを取得し、ストアへ反映する
 */
export const getUiLayouts = () =>
    handleApiRequest({
        apiCall: () => api.getUiLayouts(),
        onSuccess: (val) => {

            const chartStore = useChartStore();
            /** 配列をUUIDキーのRecordに変換 */
            const arrayToRecord = (arr: ChartConfig[] = []): Record<string, ChartConfig> =>
                Object.fromEntries(arr.map((c) => [c.chart_uuid, c]));
            
            chartStore.$patch({
                uiLayouts: val,
                dashboardCharts: arrayToRecord(val.dashboard),
                trendCharts: arrayToRecord(val.trend),
            });
        },
        errorMsg: "UIレイアウトの取得に失敗しました",
    });