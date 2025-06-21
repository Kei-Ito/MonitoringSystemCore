<template>
  <component
    :is="resolvedComponent"
    :chart="chart"
    :series="series"
    :minThreshold="chart.specific_chart_setting?.min_threshold"
    :maxThreshold="chart.specific_chart_setting?.max_threshold"
    :selectedDate="selectedDate"
  />
</template>

<script setup lang="ts">
import type { ChartConfig } from '@monitoring/shared/model'
import { computed, toRefs } from 'vue'
import { ChartTypes } from '@monitoring/shared/enum'

import TrendLineChart from '@/components/Charts/newTrendChart.vue'
import ReportsBarChart from '@/components/Charts/ReportsBarChart.vue'

const props = defineProps<{
  chart: ChartConfig
  selectedDate?: { startDate: Date; endDate: Date }
}>()
const { chart, selectedDate } = toRefs(props)

// 時系列データ（series）を Pinia から取得
import { useSeries } from '@/pinia/useSeries'
const { series } = useSeries(chart.value.chart_uuid)

const componentMap: Record<string, any> = {
  [ChartTypes.LineChart]: TrendLineChart,
  [ChartTypes.BarChart]: ReportsBarChart,
  [ChartTypes.HorizontalBarChart]: ReportsBarChart,
}

const resolvedComponent = computed(
  () => componentMap[chart.value.chart_type] || TrendLineChart
)
</script>