<!-- TimeSeriesChart.vue -->
<template>
  <div ref="chartEl" class="w-full h-full" style="height: 300px;" />
</template>

<script setup lang="ts">
/* ---------- imports ---------- */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import {
  LineChart
} from 'echarts/charts'
import {
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkLineComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

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

const defaultPalette = [
  '#5470c6', '#91cc75', '#fac858',
  '#ee6666', '#73c0de', '#3ba272',
  '#fc8452', '#9a60b4', '#ea7ccc'
]

/* ---------- state ---------- */
const chartEl = ref<HTMLElement>()
let chart: echarts.ECharts | undefined

/* ---------- helpers ---------- */
function buildOptions(): EChartsCoreOption {
  const { series, minThreshold, maxThreshold } = props

  /* transform input to ECharts series */
  const echartsSeries = series.map(s => ({
    name: s.name,
    type: 'line',
    symbol: 'none',
    /* ECharts expects [x,y] tuples when using type:'time' */
    data: s.data.map(p => [p.time, p.value]),
    sampling: 'lttb',
    progressive: 2_000,
    progressiveThreshold: 3_000,
    emphasis: { disabled: true, focus: 'none' }
  }))

  /* visualMap splits the y-axis into three colour zones */
  const visualMaps = series.map((s, idx) => ({
  show: false,
  type: 'piecewise',
  seriesIndex: idx,    // ← ★ このシリーズだけに適用
  dimension: 1,        // y 値で判定
  pieces: [
    // 下限未満：警告色
    { lte: minThreshold, color: '#FD0100' },

    // 許容レンジ：そのシリーズ本来の色
    { gt:  minThreshold, lte: maxThreshold,
      color: defaultPalette[idx % defaultPalette.length]
    },

    // 上限超過：警告色
    { gt:  maxThreshold, color: '#FD0100' }
  ]
}))

const thresholdLineSeries =
  minThreshold != null && maxThreshold != null
    ? {
        type: 'line',
        data: [],                // 実データは不要
        symbol: 'none',          // 余計なプロットを出さない
        silent: true,            // ホバーしてもツールチップを出さない
        markLine: {
          symbol: ['none', 'arrow'],  // ← **線末だけ小さな矢印**
          symbolSize: 10,
          label: { show: false },
          lineStyle: {
            type: 'dashed',           // 点線
            width: 1,
            color: '#FD0100'          // 好みで変更可
          },
          data: [
            { yAxis: minThreshold },  // 下限
            { yAxis: maxThreshold }   // 上限
          ]
        }
      }
    : null

  return {
    animation: false,
    title: props.title ? { text: props.title } : undefined,
    grid: { top: 40, left: 10, right: 25, containLabel: true },
    legend: {
      top: 0,
      icon: 'rect',          // ← 円無しの四角アイコン
      itemWidth: 32,         // 横幅を少し広げて「線らしさ」を残す
      itemHeight: 3,         // 高さを細くすると “線” の雰囲気に
      textStyle: {
        color: 'white'        // ← 背景が白なら濃いグレーが無難
      },
    },
    toolbox: {
      feature: {
        dataZoom: { yAxisIndex: 'none' },
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
  trigger: 'axis',              // X 位置でまとめて表示
  axisPointer: { type: 'line' },// 補助線
},

    visualMap:visualMaps,
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: { formatter: formatTime }
    },
    yAxis: { type: 'value' },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { start: 0, end: 100 }
    ],
    series:[ ...echartsSeries,...(thresholdLineSeries ? [thresholdLineSeries] : [])],
    /* allow last-minute tweaks from parent */
    ...props.optionOverrides
  } as EChartsCoreOption
}

/* nicely formats the x-axis tick */
function formatTime(value: string | number): string {
  const d = new Date(value)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

/* ---------- lifecycle ---------- */
onMounted(() => {
  if (!chartEl.value) return
  chart = echarts.init(chartEl.value)
  chart.setOption(buildOptions())
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  chart?.dispose()
  window.removeEventListener('resize', resize)
})

function resize() {
  chart?.resize()
}

/* reactively update when props change */
watch(
  () => [props.series, props.minThreshold, props.maxThreshold, props.optionOverrides],
  () => { chart?.setOption(buildOptions(), true) },
  { deep: true }
)
</script>

<style scoped>
/* Fill the parent container */
:host,
div {
  width: 100%;
  height: 100%;
}
</style>