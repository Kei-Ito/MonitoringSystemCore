import { storeToRefs } from 'pinia';
import { computed} from 'vue';

import { useChannelRuntimeValuesStore } from '@/pinia/channelRuntimeValuesStore';
import { useChartStore } from '@/pinia/chartStore';
import { useMonitoringStore} from '@/pinia/monitoringStore';

/**
 * chart_uuid を渡すと、ChartConfig.series 用の
 *   [{ ...ChannelSetting, ...ChannelRuntimeValue }][]
 * を返すユーティリティ
 */
export function useSeries(chartUuid: string) {
  const { dashboardCharts } = storeToRefs(useChartStore());
  const { channelMap} = storeToRefs(useMonitoringStore());
  const { runtimeValues } = storeToRefs(useChannelRuntimeValuesStore());

  const chart= computed(() => dashboardCharts.value[chartUuid]);

  const series = computed(() =>
    chart.value.channel_uuids.map((cu:string) => ({
      ...channelMap.value[cu],   // name, unit, thresholds…
      ...(runtimeValues.value[cu]?? {}),       // value, timestamp
    })),
  )

  return { chart, series }
}