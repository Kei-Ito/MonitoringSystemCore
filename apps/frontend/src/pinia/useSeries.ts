import { computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useMonitoringStore} from '@/pinia/monitoringStore'
import { useChartStore } from '@/pinia/chartStore'
import { useChannelRuntimeValuesStore } from '@/pinia/channelRuntimeValuesStore'

/**
 * chart_uuid を渡すと、ChartConfig.series 用の
 *   [{ ...ChannelSetting, ...ChannelRuntimeValue }][]
 * を返すユーティリティ
 */
export function useSeries(chart_uuid: string) {
  const { dashboardCharts } = storeToRefs(useChartStore())
  const { channelMap } = storeToRefs(useMonitoringStore())
  const { runtimeValues } = storeToRefs(useChannelRuntimeValuesStore())

  const chart = computed(() => dashboardCharts.value[chart_uuid])

  const series = computed(() =>
    chart.value.channel_uuids.map((cu:string) => ({
      ...channelMap.value[cu],   // name, unit, thresholds…
      ...(runtimeValues.value[cu]?? {}),       // value, timestamp
    })),
  )

  return { chart, series }
}