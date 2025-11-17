import { storeToRefs } from 'pinia';
import { computed, type ComputedRef } from 'vue';
import type { ChartConfig } from '@monitoring/shared/model';

import { useChannelValuesStore } from '@/pinia/channelValuesStore';
import { useChartStore } from '@/pinia/chartStore';
import { useMonitoringStore } from '@/pinia/monitoringStore';

/**
 * chart_uuid を渡すと、ChartConfigにvalueとtimestampを追加して
 * 表示用の設定オブジェクトを返す
 */
export function useSeries(chartUuid: string) {
  const chartStore = useChartStore()
  const { channelMap } = storeToRefs(useMonitoringStore())
  const { channelValues } = storeToRefs(useChannelValuesStore())

  // 全チャートから高速検索（O(1)）
  const chart: ComputedRef<ChartConfig | null> = computed(() => {
    return chartStore.allChartsRecord[chartUuid] ?? null as ChartConfig | null
  })
  // chart が得られなければ空 series
  const series = computed(() => {
    if (!chart.value) return []
    return chart.value.channel_uuids.map((cu: string) => ({
      ...channelMap.value[cu],
      ...(channelValues.value[cu] ?? {}),
    }))
  })

  return series
}