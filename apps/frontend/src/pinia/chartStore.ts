import { defineStore } from 'pinia'
import { createChartForInitialization, type ChartConfig } from '@monitoring/shared/model'
import { ChartTypes } from '@monitoring/shared/enum'
import { ok, err } from '@monitoring/shared/utils';

// 検証用にデフォルトのチャート設定を追加
const defaultTrendChartSetting: ChartConfig = createChartForInitialization(ChartTypes.GaugeChart);

export const useChartStore = defineStore('chartStore', {
  /** ------------state-------------- */
  state: () => ({
    dashboardCharts: {} as Record<string, ChartConfig>,
    trendChartSettings: [defaultTrendChartSetting],
  }),
  /** ------------getters-------------- */
  getters: {
    /** グリッドレイアウトを library 用フォーマットに変換 */
    gridLayouts: (state) =>
      Object.values(state.dashboardCharts).map((c) => c.grid_layout),
  },
  actions: {
    patchGrid(layout: { i:string; x:number; y:number; w:number; h:number }) {
      const c = this.dashboardCharts[layout.i];
      if (!c)return;
      c.grid_layout = {...c.grid_layout,x:layout.x,y:layout.y,w:layout.w,h:layout.h};
    },
    updateDashboardChart(chart: ChartConfig) {
      const chart_uuid = chart.chart_uuid;
      if (this.dashboardCharts[chart_uuid]) {
        this.dashboardCharts[chart_uuid] = chart;
        return ok(chart);
      } else {
        return err(`Chart with UUID ${chart_uuid} not found`);
      }
    },
  },
})
