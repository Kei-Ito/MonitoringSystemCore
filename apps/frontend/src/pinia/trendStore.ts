import { defineStore } from 'pinia';
import { useChartStore } from './chartStore';
import { useChannelValuesStore } from './channelValuesStore';
import { getTrendData } from '@/service/trendDataService';

export const useTrendStore = defineStore('trendStore', {
  state: () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    return {
      selectedDateRange: {
        startDate: today,
        endDate: endOfToday
      }
    };
  },
  actions: {
    setDateRange(range: { startDate: Date; endDate: Date }) {
      this.selectedDateRange = range;
      this.fetchAllTrendData();
    },
    async fetchAllTrendData() {
      const chartStore = useChartStore();
      const channelValuesStore = useChannelValuesStore();
      const { trendCharts } = chartStore;
      
      const channel_uuid_list = new Set<string>();
      
      // チャートで使用しているチャンネルの一覧を取得
      Object.keys(trendCharts).forEach((key) => {
        const chart = trendCharts[key];
        if (chart.channel_uuids && chart.channel_uuids.length > 0) {
          chart.channel_uuids.forEach((uuid) => channel_uuid_list.add(uuid));
        }
      });

      // 不要なデータを削除
      channelValuesStore.prune(channel_uuid_list);

      // 期間チェック
      const isSameRange = channelValuesStore.loadedDateRange && 
        channelValuesStore.loadedDateRange.startDate.getTime() === this.selectedDateRange.startDate.getTime() &&
        channelValuesStore.loadedDateRange.endDate.getTime() === this.selectedDateRange.endDate.getTime();

      if (!isSameRange) {
        channelValuesStore.setLoadedDateRange(this.selectedDateRange);
      }

      for (const uuid of channel_uuid_list) {
        const hasData = !!channelValuesStore.channelValues[uuid]?.timeSeries;
        if (isSameRange && hasData) {
          continue;
        }
        await getTrendData(
          uuid, 
          this.selectedDateRange.startDate, 
          this.selectedDateRange.endDate
        );
      }
    }
  }
});
