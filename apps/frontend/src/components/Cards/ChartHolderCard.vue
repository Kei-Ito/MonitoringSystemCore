<template>
  <div class="card z-index-2 mb-1 h-100 d-flex flex-column">
    <!-- グラフ本体 -->
    <div class="card-body flex-grow-1 p-2 border-radius-lg bg-gradient-dark shadow-dark m-2">
      <component :is="resolved" :chart="chart" :series="series" class="h-100 w-100 m-0"/>
    </div>

    <!-- タイトル & 単位 -->
    <div class="title-unit-bar d-flex px-4">
      <!-- title -->
      <div class="scroll-box" ref="titleBox">
        <h5 ref="titleTxt"
            class="scroll-text fs-4"
            :class="{ 'run-title': isOverflowTitle }"
            :style="isOverflowTitle
              ? { '--dist': `-${titleDist}px`, '--dur': `${titleDur}s` }
              : {}">
          {{ chart.chart_title }}
        </h5>
      </div>

      <!-- unit -->
      <div class="scroll-box unit ms-auto" ref="unitBox">
        <h5 ref="unitTxt"
            class="scroll-text fs-4 text-end"
            :class="{ 'run-unit': isOverflowUnit }"
            :style="isOverflowUnit
              ? { '--dist': `-${unitDist}px`, '--dur': `${unitDur}s` }
              : {}">
          {{ chart.chart_unit }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartConfig } from '@monitoring/shared/model'
import { computed,ref } from 'vue'

import { useAutoScroll } from '@/components/Cards/useAutoScroll'
import BarChart from '@/components/Charts/BarChart.vue'
import GaugeChart from '@/components/Charts/GaugeChart.vue'
import HorizontalBarChart from '@/components/Charts/HorizontalBarChart.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import { useSeries } from '@/pinia/useSeries'

/* ---------- props & series ---------- */
const props = defineProps<{ chart: ChartConfig }>()
const series  = useSeries(props.chart.chart_uuid)

/* ---------- DOM refs ---------- */
const titleBox = ref<HTMLElement | null>(null)
const titleTxt = ref<HTMLElement | null>(null)
const unitBox  = ref<HTMLElement | null>(null)
const unitTxt  = ref<HTMLElement | null>(null)

/* ---------- オートスクロール ---------- */
const {
  isOverflow: isOverflowTitle,
  dist:       titleDist,
  duration:   titleDur,
} = useAutoScroll(titleBox, titleTxt, 'run-title')

const {
  isOverflow: isOverflowUnit,
  dist:       unitDist,
  duration:   unitDur,
} = useAutoScroll(unitBox, unitTxt, 'run-unit')

/* ---------- 動的チャート ---------- */
const componentMap = { HorizontalBarChart,GaugeChart,LineChart,BarChart }
const resolved = computed(() => componentMap[props.chart.chart_type])
</script>


<style scoped>
/* ---- レイアウト ---- */
.scroll-box{
  position:relative;overflow:hidden;flex:1 1 auto;max-width:100%;height:40px;
}
.scroll-text{
  position:absolute;white-space:nowrap;inset-inline-start:0;transform:translateX(0);
}
/* unit: 収まるときは右寄せ */
.unit .scroll-text{inset-inline-start:auto;inset-inline-end:0;text-align:end;}

/* ---- アニメーション ---- */
.run-title{
  animation:slide-left var(--dur) linear forwards;
}
.run-unit{
  animation:slide-left-unit var(--dur) linear forwards;
  text-align:start;inset-inline-start:0 !important;inset-inline-end:auto !important;
}

/* title 用 */
@keyframes slide-left{
  0%,10%{transform:translateX(0);}
  100% {transform:translateX(var(--dist));}
}
/* unit 用 */
@keyframes slide-left-unit{
  0%,2% {opacity:0;transform:translateX(0);}
  12%   {opacity:1;transform:translateX(0);}
  100%  {transform:translateX(var(--dist));}
}
</style>