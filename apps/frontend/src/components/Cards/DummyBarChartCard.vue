<template>
  <div class="card z-index-2 mb-1 h-100 d-flex flex-column">
    <!-- グラフ本体 -->
    <div class="card-body flex-grow-1 p-2 border-radius-lg bg-gradient-dark shadow-dark m-2">
      <BarChart :chart="dummyChartConfig" :series="dummySeries" class="h-100 w-100 m-0"/>
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
          {{ dummyChartConfig.chart_title }}
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
          {{ dummyChartConfig.chart_unit }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAutoScroll } from '@/components/Cards/useAutoScroll'
import BarChart from '@/components/Charts/BarChart.vue'
import { ChartTypes } from '@monitoring/shared/enum'
import type { ChartConfig, ChannelSeries } from '@monitoring/shared/model'

/* ---------- ダミーデータ ---------- */
const dummyChartConfig: ChartConfig = {
  chart_uuid: 'dummy-bar-chart',
  chart_type: ChartTypes.BarChart,
  chart_title: '消費電力',
  chart_unit: 'kWh',
  channel_uuids: ['dummy-channel-1'],
  grid_layout: { i: 'dummy', x: 0, y: 0, w: 12, h: 10, static: false, minW: null, minH: null, maxW: null, maxH: null },
  chart_options: {
    thresholds: { min: -20, max: 80, color: '#ff0000' },
    visibility: { minY: 0, maxY: 20 },
    seriesColors: {}
  },
  category1: null,
  category2: null
};

const generateDummyData = () => {
  const data = [];
  const startDate = new Date('2025-11-21T00:00:00').getTime();
  const endDate = new Date('2025-11-21T23:59:59').getTime();
  const interval = 60 * 60 * 1000; // 1 hour

  let currentValue = 12; // 初期値

  for (let t = startDate; t <= endDate; t += interval) {
    // -3 ~ +3 の変動を加えて滑らかに変化させる
    const delta = Math.floor(Math.random() * 7) - 3;
    currentValue += delta;

    // 0 ~ 25 の範囲に収める
    if (currentValue < 0) currentValue = 0;
    if (currentValue > 25) currentValue = 25;

    data.push({ timestamp: new Date(t), value: currentValue });
  }
  return data;
};

const dummySeries: ChannelSeries[] = [
  {
    channel_uuid: 'dummy-channel-1',
    channel_name: '消費電力',
    timeSeries: generateDummyData()
  } as any
];

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
