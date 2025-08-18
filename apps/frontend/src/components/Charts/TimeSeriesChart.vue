<template>
  <!-- 親のサイズにフィット（Gauge と同じスタイル） -->
  <div ref="el" class="w-full h-full" style="height: 100%; width: 100%;" />
</template>

<script setup lang="ts">
/* ---------- imports ---------- */
import type { ChartConfig } from '@monitoring/shared/model'   // ← Gauge と揃える
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
  VisualMapComponent
} from 'echarts/components'
import type { EChartsCoreOption } from 'echarts/core'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { toRef } from 'vue'
import { useEChart } from '@/components/Charts/useEChart'

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

/* ---------- props ---------- */
/**
 * Gauge コンポーネントと合わせて `chart: ChartConfig` を受け取れるように拡張。
 * 互換のため従来の min/maxThreshold, title, optionOverrides も維持。
 */
const props = defineProps<{
  chart?: ChartConfig
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

/* ---------- state (reactive deps for useEChart) ---------- */
const seriesRef = toRef(props, 'series')
const minThresholdRef = toRef(props, 'minThreshold')
const maxThresholdRef = toRef(props, 'maxThreshold')
const optionOverridesRef = toRef(props, 'optionOverrides')
const chartRef = toRef(props, 'chart')

/* ---------- constants & helpers ---------- */
const defaultPalette = [
  '#5470c6', '#91cc75', '#fac858',
  '#ee6666', '#73c0de', '#3ba272',
  '#fc8452', '#9a60b4', '#ea7ccc'
]

function toMillis(t: number | string | Date): number {
  if (t instanceof Date) return t.getTime()
  if (typeof t === 'string') return new Date(t).getTime()
  return t
}

/* nicely formats the x-axis tick */
function formatTime(value: string | number): string {
  const d = new Date(value)
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const ss = d.getSeconds().toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

/* ---------- option builder ---------- */
const optionBuilder = (): EChartsCoreOption => {
  const series = props.series ?? []
  const minT = props.minThreshold
  const maxT = props.maxThreshold

  const hasAnyData = series.some(s => (s.data?.length ?? 0) > 0)

  const echartsSeries = series.map((s, _) => ({
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

  // VisualMap（min/max の片方だけ指定でも動作）
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
        return {
          show: false,
          type: 'piecewise',
          seriesIndex: idx,
          dimension: 1,
          pieces
        }
      })
    : []

  // MarkLine（しきい値があるものだけ出す）
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

  // ChartConfig から y 軸レンジを受けられるように（存在すれば使う）
  // Gauge では chart.chart_options?.max を参照していたため合わせる
  const yMin = (props.chart as any)?.chart_options?.min
  const yMax = (props.chart as any)?.chart_options?.max

  const base: EChartsCoreOption = {
    animation: false,
    title: (props.title ?? (props.chart as any)?.title)
      ? { text: props.title ?? (props.chart as any)?.title }
      : undefined,
    grid: {
      top: 40,
      left: 10,
      right: 25,
      bottom: 30,
      containLabel: true
    },
    legend: {
      top: 0,
      icon: 'rect',
      itemWidth: 32,
      itemHeight: 3
    },
    toolbox: { feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      valueFormatter: (v: any) => (typeof v === 'number' ? v.toFixed(2) : v)
    },
    visualMap: visualMaps,
    xAxis: { type: 'time', boundaryGap: false, axisLabel: { formatter: formatTime } },
    yAxis: {
      type: 'value',
      min: typeof yMin === 'number' ? yMin : undefined,
      max: typeof yMax === 'number' ? yMax : undefined
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { start: 0, end: 100 }
    ],
    // データがない場合のプレースホルダ表示
    graphic: !hasAnyData
      ? {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: 'No data',
            fontSize: 14,
            fill: '#999'
          }
        }
      : undefined,
    series: [...echartsSeries, ...(thresholdLineSeries ? [thresholdLineSeries] : [])]
  }

  // 親からの上書きを最後に反映（浅い merge）
  return { ...base, ...(props.optionOverrides ?? {}) } as EChartsCoreOption
}

/* mount with useEChart (handles resize and reactive updates)
   → Gauge と同様に、必要な変更だけを依存に渡して最小再描画 */
const { el } = useEChart(optionBuilder, [
  seriesRef,
  minThresholdRef,
  maxThresholdRef,
  optionOverridesRef,
  chartRef
])
</script>

<style scoped>
/* 親のサイズに追従（Gauge と同じ思想） */
:host,
div {
  width: 100%;
  height: 100%;
}
</style>