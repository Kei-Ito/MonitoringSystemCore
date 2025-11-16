import * as api from '@/api'
import { handleApiRequest } from '@/service/handle';


/**
 * UIレイアウトを取得する（純粋API呼び出し）
 * データの更新はStore側が責任を持つ
 */
export const fetchUiLayouts = () =>
    handleApiRequest({
        apiCall: () => api.getUiLayouts(),
        onSuccess: (val) => val, // データをそのまま返す
        errorMsg: "UIレイアウトの取得に失敗しました",
    });