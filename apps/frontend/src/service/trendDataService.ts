import * as api from '@/api'
import { handleApiRequest } from '@/service/handle';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';

const inFlight = new Map<string, { key: string; controller: AbortController }>();
const latestKey = new Map<string, string>();

function buildKey(channelUuid: string, startDate: Date, endDate: Date) {
    return `${channelUuid}:${startDate.getTime()}:${endDate.getTime()}`;
}


/**
 * トレンドデータを取得し、ストアへ反映する
 */
export const getTrendData = (channel_uuid: string, startDate: Date, endDate: Date) => {
    const key = buildKey(channel_uuid, startDate, endDate);
    const prev = inFlight.get(channel_uuid);
    prev?.controller.abort();
    const controller = new AbortController();
    inFlight.set(channel_uuid, { key, controller });
    latestKey.set(channel_uuid, key);
    const request = handleApiRequest({
        apiCall: () => api.getTrendData(channel_uuid, startDate, endDate, { signal: controller.signal }),
        onSuccess: (val) => {
            if (latestKey.get(channel_uuid) !== key) return;
            const channelValuesStore = useChannelValuesStore();
            channelValuesStore.setTimeSeries(channel_uuid, val);
        },
        errorMsg: "トレンドデータ取得に失敗しました",
    });

    return request.finally(() => {
        const current = inFlight.get(channel_uuid);
        if (current && current.key === key) {
            inFlight.delete(channel_uuid);
        }
    });
};

/**
 * 積算トレンドデータを取得し、ストアへ反映する
 */
export const getAggregatedTrendData = (channel_uuid: string, startDate: Date, endDate: Date, intervalMinutes: number) => {
    const key = buildKey(channel_uuid, startDate, endDate);
    const prev = inFlight.get(channel_uuid);
    prev?.controller.abort();
    const controller = new AbortController();
    inFlight.set(channel_uuid, { key, controller });
    latestKey.set(channel_uuid, key);
    
    const request = handleApiRequest({
        apiCall: () => api.getAggregatedTrendData(channel_uuid, startDate, endDate, intervalMinutes, { signal: controller.signal }),
        onSuccess: (val) => {
            if (latestKey.get(channel_uuid) !== key) return;
            const channelValuesStore = useChannelValuesStore();
            // APIから返ってくる timestamp は string なので Date に変換が必要
            const parsedVal = val.map(v => ({
                value: v.value,
                timestamp: new Date(v.timestamp)
            }));
            channelValuesStore.setTimeSeries(channel_uuid, parsedVal);
        },
        errorMsg: "積算データ取得に失敗しました",
    });

    return request.finally(() => {
        const current = inFlight.get(channel_uuid);
        if (current && current.key === key) {
            inFlight.delete(channel_uuid);
        }
    });
};

export function cancelTrendDataRequests() {
    inFlight.forEach(({ controller }) => controller.abort());
    inFlight.clear();
    latestKey.clear();
}