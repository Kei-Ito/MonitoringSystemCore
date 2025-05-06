<!-- HorizontalBarChart.vue -->
<template>
  <div ref="chartEl" class="h-full" style="min-height: 28px;" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart
} from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  VisualMapComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

/* 必要なチャート／コンポーネントだけを登録してバンドルサイズを削減 */
echarts.use([
  CanvasRenderer,
  BarChart,
  DatasetComponent,
  GridComponent,
  VisualMapComponent,
  TooltipComponent,
  TitleComponent
])

/* ---------- Props ---------- */
interface BarDatum {
  /** 棒の長さに使う値 */
  amount: number
  /** スコア（色判定用） */
  score: number
  /** y 軸に表示するラベル */
  label: string
}

/** スコアの条件と色を 1 つの配列要素にまとめる */
interface ColorRule {
  /** 閾値上限（以下）──`undefined` なら「上限なし」 */
  lte?: number
  /** 閾値下限（より大きい）──`undefined` なら「下限なし」 */
  gt?: number
  /** 当てはまったときに塗る色 */
  color: string,
  max?: number,
  min?: number
}

const props = defineProps<{
  /** データ配列 */
  data: BarDatum[]
  rules: ColorRule[]
}>()

const MIN_HEIGHT = 60;// バーを含まない上下の隙間の高さ
const ROW_HEIGHT = 30;// バー一本当たりの高さ

/* ---------- ECharts インスタンス管理 ---------- */
const chartEl = ref<HTMLElement>()
let chart: echarts.ECharts | undefined

const dispose = () => {
  if (chart) {
    chart.dispose()
    chart = undefined
  }
}

const render = () => {
  if (!chartEl.value) return

  const idealHeight = Math.max(MIN_HEIGHT+ props.data.length * ROW_HEIGHT)
  chartEl.value.style.height = `${idealHeight}px`

  if (!chart) {
    chart = echarts.init(chartEl.value)
  }

  /* データ→ ECharts の dataset 形式に変換 */
  const datasetSource = [
    ['score', 'amount', 'label'],
    ...props.data.map(d => [d.score, d.amount, d.label])
  ]
//min とmaxを指定している場合は、グラフの横軸をその範囲にする
  chart.setOption({
    
    dataset: { source: datasetSource },
    grid: { containLabel: true, left: 50, top: 30, right: 30, bottom: 10 },
    xAxis: { name: '' },
    yAxis: { type: 'category' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    visualMap: {
      show: false,//表示しない
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      dimension: 0,            // score カラムで判定
      pieces: props.rules,
    },
    series: [
      {
        type: 'bar',
        encode: { x: 'amount', y: 'label' }
      }
    ],
    animationDurationUpdate: 500
  })

  chart.resize() // 初回サイズ調整
}

onMounted(() => {
  render()
  window.addEventListener('resize', () => chart?.resize())
})

onBeforeUnmount(() => {
  dispose()
})

/* props が変わったら再描画 */
watch(
  () => [props.data,props.rules],
  () => render(),
  { deep: true }
)
</script>

<style scoped>
/* 親コンテナのサイズに合わせたい場合はここで指定 */
:host {
  display: block;
  width: 100%;
  height: 100%;
}
</style>