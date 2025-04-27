import { defineStore } from 'pinia'
import type { ChartSetting } from '@monitoring/shared/model'
import { ChartTypes } from '@monitoring/shared/enum'

// 検証用にデフォルトのチャート設定を追加
const defaultTrendChartSetting: ChartSetting = {
  chart_id: 0,
  module_uuid: "2adb03fa-6ee4-49bb-97c1-c83d82dde04a",
  channel_id: 1,
  chart_type: ChartTypes.GaugeChart,
  chart_position: {
    chart_id: 0,
    x: 0,
    y: 0,
    width: 4,
    height: 4,
  },
  specific_chart_setting: {
    selected_date: new Date(),
    data: null,
  },
}

export const useChartStore = defineStore('chartStore', {
  state: () => ({
    dashboardCharts: [] as ChartSetting[],
    trendChartSettings:[defaultTrendChartSetting],
  }),
  actions: {
    updateDashboardChart( chart: ChartSetting) {
        const index = this.dashboardCharts.findIndex(c => c.chart_id === chart.chart_id);
        if (index !== -1) {
          this.dashboardCharts.splice(index, 1, chart);
        }
      },
  },
})
