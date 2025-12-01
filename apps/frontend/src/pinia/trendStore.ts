import { defineStore } from 'pinia';
import { useChartStore } from './chartStore';
import { useChannelValuesStore } from './channelValuesStore';
import { getTrendData, getAggregatedTrendData } from '@/service/trendDataService';
import type { ChartOptions, ChartConfig } from '@monitoring/shared/types/model/ChartConfig/ChartConfig';
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

/**
 * チャートの個別区間設定から日付範囲を計算する
 */
function calculateDateRangeForChart(options: ChartOptions): { startDate: Date; endDate: Date } {
  if (!options.useCustomDateRange) {
    throw new Error('useCustomDateRange is not enabled');
  }

  const mode = options.customPresetMode ?? TrendPresetMode.Realtime;

  if (mode === TrendPresetMode.Custom) {
    // カスタム期間の場合は保存された日付を使用
    const startDate = options.customStartDate 
      ? new Date(options.customStartDate)
      : new Date();
    const endDate = options.customEndDate 
      ? new Date(options.customEndDate)
      : new Date();
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return { startDate, endDate };
  }

  // プリセットモードの場合は計算
  return calculateDateRangeForPreset(mode);
}

/**
 * チャートが個別区間設定を持つかどうかを判定
 */
function hasCustomDateRange(chart: ChartConfig): boolean {
  const options = chart.chart_options as ChartOptions | undefined;
  return options?.useCustomDateRange === true;
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
        
        // グローバル期間のチャンネルと個別期間のチャンネルを分離
        const globalChannels = new Set<string>();
        const globalChannelOptions = new Map<string, ChartOptions | null>();
        
        // 個別期間設定を持つチャートごとの取得リスト
        // key: chart_uuid, value: { dateRange, channelUuids, options }
        const customRangeCharts = new Map<string, {
          dateRange: { startDate: Date; endDate: Date };
          channelUuids: string[];
          options: ChartOptions;
        }>();
        
        // チャートを分類
        Object.keys(trendCharts).forEach((key) => {
          const chart = trendCharts[key];
          if (!chart.channel_uuids || chart.channel_uuids.length === 0) return;
          
          const options = chart.chart_options as ChartOptions;
          
          if (hasCustomDateRange(chart)) {
            // 個別区間設定を持つチャート
            const dateRange = calculateDateRangeForChart(options);
            customRangeCharts.set(chart.chart_uuid, {
              dateRange,
              channelUuids: chart.channel_uuids,
              options
            });
          } else {
            // グローバル設定を使うチャート
            chart.channel_uuids.forEach((uuid) => {
              globalChannels.add(uuid);
              
              if (options?.isCumulative) {
                globalChannelOptions.set(uuid, options);
              } else if (!globalChannelOptions.has(uuid)) {
                globalChannelOptions.set(uuid, null);
              }
            });
          }
        });

        // 全チャンネルリストを作成（pruneのため）
        const allChannelUuids = new Set<string>(globalChannels);
        customRangeCharts.forEach(({ channelUuids }) => {
          channelUuids.forEach(uuid => allChannelUuids.add(uuid));
        });

        // 不要なデータを削除
        channelValuesStore.prune(allChannelUuids);

        // グローバル期間のデータ取得
        if (globalChannels.size > 0) {
          const isSameRange = channelValuesStore.loadedDateRange && 
            channelValuesStore.loadedDateRange.startDate.getTime() === this.selectedDateRange.startDate.getTime() &&
            channelValuesStore.loadedDateRange.endDate.getTime() === this.selectedDateRange.endDate.getTime();

          if (!isSameRange) {
            channelValuesStore.setLoadedDateRange(this.selectedDateRange);
          }

          const targetUuids: string[] = [];
          for (const uuid of globalChannels) {
            const hasData = !!channelValuesStore.channelValues[uuid]?.timeSeries;
            if (!(isSameRange && hasData)) {
              targetUuids.push(uuid);
            }
          }

          targetUuids.forEach(uuid => channelValuesStore.setChannelLoading(uuid, true));

          for (const uuid of targetUuids) {
            try {
              const options = globalChannelOptions.get(uuid);
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
        }

        // 個別期間設定を持つチャートのデータ取得
        for (const [, chartData] of customRangeCharts) {
          const { dateRange, channelUuids, options } = chartData;
          
          for (const uuid of channelUuids) {
            channelValuesStore.setChannelLoading(uuid, true);
            try {
              if (options?.isCumulative && options.cumulativeIntervalMinutes) {
                await getAggregatedTrendData(
                  uuid,
                  dateRange.startDate,
                  dateRange.endDate,
                  options.cumulativeIntervalMinutes
                );
              } else {
                await getTrendData(
                  uuid,
                  dateRange.startDate,
                  dateRange.endDate
                );
              }
            } finally {
              channelValuesStore.setChannelLoading(uuid, false);
            }
          }
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
});
