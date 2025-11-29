import { defineStore } from 'pinia';
import { useChartStore } from './chartStore';
import { useChannelValuesStore } from './channelValuesStore';
import { getTrendData, getAggregatedTrendData } from '@/service/trendDataService';
import type { ChartOptions } from '@monitoring/shared/types/model/ChartConfig/ChartConfig';

export const useTrendStore = defineStore('trendStore', {
  state: () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    return {
      selectedDateRange: {
        startDate: today,
        endDate: endOfToday
      },
      isLoading: false,
      isRealtimeMode: true
    };
  },
  actions: {
    setTrendCondition(isRealtime: boolean, range: { startDate: Date; endDate: Date }) {
      this.selectedDateRange = range;
      this.isRealtimeMode = isRealtime;
      this.fetchAllTrendData();
    },
    /**
     * 日付が変わったかどうかをチェックし、
     * 今日モードであれば日付範囲を更新する
     */
    checkDateChange() {
      if (!this.isRealtimeMode) return;
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      
      // ストアのstartDateと比較
      // もしストアのstartDateが今日でなければ（つまり日付が変わっていたら）、更新する
      if (this.selectedDateRange.startDate.getTime() !== todayStart.getTime()) {
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        
        // 日付が変わったので、既存の時系列データをクリア
        const channelValuesStore = useChannelValuesStore();
        channelValuesStore.clearAllTimeSeries();

        this.selectedDateRange = {
          startDate: todayStart,
          endDate: todayEnd
        };
        
        // データ再取得
        this.fetchAllTrendData();
      }
    },
    async fetchAllTrendData() {
      this.isLoading = true;
      try {
        const chartStore = useChartStore();
        const channelValuesStore = useChannelValuesStore();
        const { trendCharts } = chartStore;
        
        const channel_uuid_list = new Set<string>();
        // チャンネルごとの取得モードを記録 (uuid -> options)
        const channelOptions = new Map<string, ChartOptions | null>();
        
        // チャートで使用しているチャンネルの一覧を取得
        Object.keys(trendCharts).forEach((key) => {
          const chart = trendCharts[key];
          if (chart.channel_uuids && chart.channel_uuids.length > 0) {
            const options = chart.chart_options as ChartOptions;
            chart.channel_uuids.forEach((uuid) => {
              channel_uuid_list.add(uuid);
              
              // 積算設定があればそれを採用
              if (options?.isCumulative) {
                  channelOptions.set(uuid, options);
              } else if (!channelOptions.has(uuid)) {
                  channelOptions.set(uuid, null);
              }
            });
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

        // 取得が必要なチャンネルを特定
        const targetUuids: string[] = [];
        for (const uuid of channel_uuid_list) {
          const hasData = !!channelValuesStore.channelValues[uuid]?.timeSeries;
          if (!(isSameRange && hasData)) {
            targetUuids.push(uuid);
          }
        }

        // 先にすべてローディング状態にする（待機中もローディング表示するため）
        targetUuids.forEach(uuid => channelValuesStore.setChannelLoading(uuid, true));

        for (const uuid of targetUuids) {
          try {
            const options = channelOptions.get(uuid);
            if (options?.isCumulative && options.cumulativeIntervalMinutes) {
                await getAggregatedTrendData(
                    uuid,
                    this.selectedDateRange.startDate,
                    this.selectedDateRange.endDate,
                    options.cumulativeIntervalMinutes
                );
            } else {
                await getTrendData(
                  uuid, 
                  this.selectedDateRange.startDate, 
                  this.selectedDateRange.endDate
                );
            }
          } finally {
            channelValuesStore.setChannelLoading(uuid, false);
          }
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
});
