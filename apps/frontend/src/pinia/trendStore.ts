import { defineStore } from 'pinia';
import { useChartStore } from './chartStore';
import { useChannelValuesStore } from './channelValuesStore';
import { getTrendData, getAggregatedTrendData } from '@/service/trendDataService';
import type { ChartOptions } from '@monitoring/shared/types/model/ChartConfig/ChartConfig';
import { TrendPresetMode } from '@monitoring/shared/enum';

/**
 * プリセットモードに応じた日付範囲を計算する
 */
function calculateDateRangeForPreset(mode: TrendPresetMode): { startDate: Date; endDate: Date } {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  switch (mode) {
    case TrendPresetMode.Realtime: {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      return { startDate: today, endDate: endOfToday };
    }
    case TrendPresetMode.LastWeek: {
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
      return { startDate: weekAgo, endDate: endOfToday };
    }
    case TrendPresetMode.LastMonth: {
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0);
      return { startDate: monthAgo, endDate: endOfToday };
    }
    default:
      // Custom モードでは既存の日付範囲を維持するため、ここでは今日をデフォルト
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      return { startDate: today, endDate: endOfToday };
  }
}

export const useTrendStore = defineStore('trendStore', {
  state: () => {
    const initialRange = calculateDateRangeForPreset(TrendPresetMode.Realtime);
    
    return {
      selectedDateRange: initialRange,
      isLoading: false,
      /** @deprecated 後方互換性のため残す。presetMode を使用してください */
      isRealtimeMode: true,
      /** 現在のプリセットモード */
      presetMode: TrendPresetMode.Realtime as TrendPresetMode
    };
  },
  actions: {
    /**
     * プリセットモードで表示条件を設定
     */
    setPresetMode(mode: TrendPresetMode, customRange?: { startDate: Date; endDate: Date }) {
      this.presetMode = mode;
      // 後方互換性: isRealtimeMode を更新
      this.isRealtimeMode = mode === TrendPresetMode.Realtime;
      
      if (mode === TrendPresetMode.Custom && customRange) {
        this.selectedDateRange = customRange;
      } else {
        this.selectedDateRange = calculateDateRangeForPreset(mode);
      }
      
      this.fetchAllTrendData();
    },
    /**
     * @deprecated 後方互換性のため残す。setPresetMode を使用してください
     */
    setTrendCondition(isRealtime: boolean, range: { startDate: Date; endDate: Date }) {
      if (isRealtime) {
        this.setPresetMode(TrendPresetMode.Realtime);
      } else {
        this.setPresetMode(TrendPresetMode.Custom, range);
      }
    },
    /**
     * 日付が変わったかどうかをチェックし、
     * プリセットモード（リアルタイム、直近1週間、直近1ヶ月）であれば日付範囲を更新する
     */
    checkDateChange() {
      // カスタムモードの場合は何もしない
      if (this.presetMode === TrendPresetMode.Custom) return;
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      
      // 現在の endDate の日付部分を取得
      const currentEndDateStart = new Date(
        this.selectedDateRange.endDate.getFullYear(),
        this.selectedDateRange.endDate.getMonth(),
        this.selectedDateRange.endDate.getDate(),
        0, 0, 0
      );
      
      // 日付が変わっていたら更新
      if (currentEndDateStart.getTime() !== todayStart.getTime()) {
        // 日付が変わったので、既存の時系列データをクリア
        const channelValuesStore = useChannelValuesStore();
        channelValuesStore.clearAllTimeSeries();

        // プリセットモードに応じた新しい日付範囲を計算
        this.selectedDateRange = calculateDateRangeForPreset(this.presetMode);
        
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
