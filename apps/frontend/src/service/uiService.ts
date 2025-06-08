import type { ApiError } from '@monitoring/shared/api'
import type { ChartConfig } from '@monitoring/shared/model'
import { err } from '@monitoring/shared/utils'

import * as api from '@/api'
import { useChartStore } from '@/pinia/chartStore';
import { handleApiRequest } from '@/service/handle';


export const getUiLayouts = () =>
    handleApiRequest({
        apiCall: () => api.getUiLayouts(),
        onSuccess: (val) => {
            useChartStore().$patch({ uiLayouts: val });
        },
        errorMsg: "UIレイアウトの取得に失敗しました",
    });