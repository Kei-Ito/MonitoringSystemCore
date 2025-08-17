<!-- TimeSeriesChart.vue -->
<template>
  <div ref="el" class="w-full h-full" style="height: 100%; width: 100%;" />
</template>

<script setup lang="ts">
/* ---------- imports ---------- */
import {
  LineChart
} from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent} from 'echarts/components'
import type { EChartsCoreOption } from 'echarts/core'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { toRef } from 'vue'
import { useEChart } from '@/components/Charts/useEChart'

/* ---------- props ---------- */
const props = defineProps<{
  /** data for each line */
  series: SeriesInput[]
  /** lower & upper thresholds (for visualMap + markLine) */
  minThreshold?: number
  maxThreshold?: number
  /** chart title (optional) */
  title?: string
  /** allow parent to tweak/extend raw ECharts options */
  optionOverrides?: EChartsCoreOption
}>()

/* Only register what we need (keeps bundle small) */
echarts.use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkLineComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

/* ---------- types ---------- */
export interface Point {
  /** millisecond UNIX time, Date, or an ISO string */
  time: number | string | Date
  /** y-value */
  value: number
}

export interface SeriesInput {
  name: string
  /** ordered array of data points */
  data: Point[]
  /** line colour (falls back to ECharts palette) */
  color?: string
}

const defaultPalette = [
  '#5470c6', '#91cc75', '#fac858',
  '#ee6666', '#73c0de', '#3ba272',
  '#fc8452', '#9a60b4', '#ea7ccc'
]

/* ---------- state ---------- */

function toMillis(t: number | string | Date): number {
  if (t instanceof Date) return t.getTime()
  if (typeof t === 'string') return new Date(t).getTime()
  return t
}

function formatTime(value: string | number): string {
  const d = new Date(value)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

const optionBuilder = (): EChartsCoreOption => {
  const series = props.series ?? []
  const minT = props.minThreshold
  const maxT = props.maxThreshold

  const echartsSeries = series.map((s) => ({
    name: s.name,
    type: 'line',
    symbol: 'none',
    data: (s.data ?? []).map(p => [toMillis(p.time), p.value]),
    sampling: 'lttb',
    progressive: 2_000,
    progressiveThreshold: 3_000,
    lineStyle: s.color ? { color: s.color } : undefined,
    emphasis: { disabled: true, focus: 'none' }
  }))

  const visualMaps = (minT != null || maxT != null)
    ? series.map((s, idx) => {
        const normal = s.color ?? defaultPalette[idx % defaultPalette.length]
        const pieces: any[] = []
        if (minT != null && maxT != null) {
          pieces.push({ lte: minT, color: '#FD0100' })
          pieces.push({ gt: minT, lte: maxT, color: normal })
          pieces.push({ gt: maxT, color: '#FD0100' })
        } else if (minT != null) {
          pieces.push({ lte: minT, color: '#FD0100' })
          pieces.push({ gt: minT, color: normal })
        } else if (maxT != null) {
          pieces.push({ lte: maxT, color: normal })
          pieces.push({ gt: maxT, color: '#FD0100' })
        }
        return { show: false, type: 'piecewise', seriesIndex: idx, dimension: 1, pieces }
      })
    : []

  const markLineData: any[] = []
  if (minT != null) markLineData.push({ yAxis: minT })
  if (maxT != null) markLineData.push({ yAxis: maxT })

  const thresholdLineSeries =
    markLineData.length > 0
      ? {
          type: 'line',
          data: [],
          symbol: 'none',
          silent: true,
          markLine: {
            symbol: ['none', 'arrow'],
            symbolSize: 10,
            label: { show: false },
            lineStyle: { type: 'dashed', width: 1, color: '#FD0100' },
            data: markLineData
          }
        }
      : null

  return {
    animation: false,
    title: props.title ? { text: props.title } : undefined,
    grid: { top: 40, left: 10, right: 25, containLabel: true },
    legend: { top: 0, icon: 'rect', itemWidth: 32, itemHeight: 3 },
    toolbox: { feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
    visualMap: visualMaps,
    xAxis: { type: 'time', boundaryGap: false, axisLabel: { formatter: formatTime } },
    yAxis: { type: 'value' },
    dataZoom: [{ type: 'inside', start: 0, end: 100 }, { start: 0, end: 100 }],
    series: [...echartsSeries, ...(thresholdLineSeries ? [thresholdLineSeries] : [])],
    ...props.optionOverrides
  } as EChartsCoreOption
}

const seriesRef = toRef(props, 'series')
const minThresholdRef = toRef(props, 'minThreshold')
const maxThresholdRef = toRef(props, 'maxThreshold')
const optionOverridesRef = toRef(props, 'optionOverrides')

const { el } = useEChart(optionBuilder, [seriesRef, minThresholdRef, maxThresholdRef, optionOverridesRef])
</script>