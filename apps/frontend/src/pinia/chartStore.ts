import { ChartTypes } from '@monitoring/shared/enum'
import { type ChartConfig, createChartForInitialization, type GridLayout } from '@monitoring/shared/model'
import { err,ok } from '@monitoring/shared/utils';
import { defineStore } from 'pinia'

// 検証用にデフォルトのチャート設定を追加
const defaultTrendChartSetting: ChartConfig = createChartForInitialization(ChartTypes.GaugeChart);

/**
 * 配列かどうかを判定し、配列でない場合は配列に変換する関数
 * @param v オブジェクト（配列または単一の値）
 * @returns 配列
 */
export function toArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}

/**
 * ChartConfig配列をカテゴリーでフィルタリングする関数
 * @returns  フィルタリングされたチャート設定の配列
 */
function filerCategory(chartConfigs:ChartConfig[],category1:string[],category2:string[]):ChartConfig[] {
  let category1Filtered:ChartConfig[];
  let category2Filtered:ChartConfig[] = [];
  
  const cat1Arr = toArray(category1)
  const cat2Arr = toArray(category2)

  const cat1Set = new Set(cat1Arr)
  const cat2Set = new Set(cat2Arr)

  // category1のフィルタリング
  // category1の設定がAllの場合は全てのチャートを表示
  if ( category1.length === 1 && category1[0] === 'All') {
    category1Filtered=Object.values(chartConfigs);
  }
  else{
    category1Filtered=Object.values(chartConfigs)
    .filter((c) => cat1Set.has(c.category1 ? c.category1 : ''));
  }
  
  // category2のフィルタリング
  // category2の設定がAllの場合は全てのチャートを表示
  if ( category2.length === 1 && category2[0] === 'All') {
    category2Filtered=Object.values(category1Filtered);
  }
  else{
    category2Filtered = Object.values(category1Filtered)
    .filter((c) => cat2Set.has(c.category2 ? c.category2 : ''));
  }
  
  return category2Filtered;
}

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
    gridLayoutsFilteredByCategory:
      (state) =>
        (category1: string[], category2: string[]): GridLayout[] => {
          return filerCategory(
            Object.values(state.dashboardCharts),
            category1,
            category2
          ).map((c) => ({ ...c.grid_layout }));
        },

  },
  actions: {
    patchGrid(layout: { i: string; x: number; y: number; w: number; h: number }) {
      const c = this.dashboardCharts[layout.i];
      if (!c) return;
      c.grid_layout = { ...c.grid_layout, x: layout.x, y: layout.y, w: layout.w, h: layout.h };
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
