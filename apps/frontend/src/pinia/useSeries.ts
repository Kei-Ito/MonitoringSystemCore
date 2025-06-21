import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import type { ChartConfig } from '@monitoring/shared/model';

import { useChannelRuntimeValuesStore } from '@/pinia/channelRuntimeValuesStore';
import { useChartStore } from '@/pinia/chartStore';
import { useMonitoringStore} from '@/pinia/monitoringStore';

/**
 * chart_uuid を渡すと、ChartConfig.series 用の
 *   [{ ...ChannelSetting, ...ChannelRuntimeValue }][]
 * を返すユーティリティ
 */
export function useSeries(chartUuid: string) {
  const chartStore = useChartStore()
  const { channelMap } = storeToRefs(useMonitoringStore())
  const { runtimeValues } = storeToRefs(useChannelRuntimeValuesStore())

  // ダッシュボード用 dashChart がなければ uiLayouts を横断検索
  const chart = computed(() => {
    const dash = chartStore.dashboardCharts[chartUuid]
    if (dash) return dash
    // uiLayoutsData[pageName] 配列内を検索
    const uiLayouts = chartStore.uiLayoutsData
    for (const page in uiLayouts) {
      const found = uiLayouts[page].find((c) => c.chart_uuid === chartUuid)
      if (found) return found
    }
    return null as ChartConfig | null
  })

  // chart が得られなければ空 series
  const series = computed(() => {
    if (!chart.value) return []
    return chart.value.channel_uuids.map((cu: string) => ({
      ...channelMap.value[cu],
      ...(runtimeValues.value[cu] ?? {}),
    }))
  })

  return { chart, series }
}