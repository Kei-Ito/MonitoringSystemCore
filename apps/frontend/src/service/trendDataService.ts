import * as api from '@/api'
import { handleApiRequest } from '@/service/handle';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';



/**
 * トレンドデータを取得し、ストアへ反映する
 */
export const getTrendData = (channel_uuid:string,startDate:Date, endDate:Date) =>
    handleApiRequest({
        apiCall: () => api.getTrendData(channel_uuid,startDate,endDate),
        onSuccess: (val) => {

            const channelValuesStore = useChannelValuesStore();
            channelValuesStore.setTimeSeries(channel_uuid, val);
        },
        errorMsg: "UIレイアウトの取得に失敗しました",
    });