<template>
  <div class="card z-index-2 mb-1 h-100 d-flex flex-column">
    <!-- グラフ本体 -->
    <div class="card-body flex-grow-1 p-2 border-radius-lg bg-gradient-dark shadow-dark m-2 position-relative">
      <!-- 設定ボタン -->
      <button 
        class="btn btn-icon-only btn-rounded chart-settings-btn position-absolute"
        :class="`border-${color}`"
        @click="openSettings"
        :title="$t('chart.settings') || 'グラフ設定'"
      >
        <i class="material-icons">settings</i>
      </button>
      
      <component :is="resolved" :chart="chart" :series="series" :loading="isLoading" class="h-100 w-100 m-0"/>
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

    <!-- 設定モーダル -->
    <ChartSettingsModal
      :visible="isSettingsModalVisible"
      :chart="chart"
      @close="closeSettings"
      @update="handleUpdate"
    />
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
import ChartSettingsModal from '@/components/Modals/ChartSettingsModal.vue'
import { useSeries } from '@/pinia/useSeries'
import { useChannelValuesStore } from '@/pinia/channelValuesStore'
import { useUiStore } from '@/pinia/uiStore'
import { useChartStore } from '@/pinia/chartStore'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

/* ---------- props & series ---------- */
const props = defineProps<{ 
  chart: ChartConfig
}>()
const series  = useSeries(props.chart.chart_uuid)
const channelValuesStore = useChannelValuesStore()
const uiStore = useUiStore()
const chartStore = useChartStore()
const toast = useToast()
const { color } = storeToRefs(uiStore)

const isLoading = computed(() => {
  if (!props.chart.channel_uuids) return false;
  return props.chart.channel_uuids.some(uuid => channelValuesStore.isChannelLoading(uuid));
})

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

/* ---------- 設定モーダル ---------- */
const isSettingsModalVisible = ref<boolean>(false)

const openSettings = () => {
  isSettingsModalVisible.value = true
}

const closeSettings = () => {
  isSettingsModalVisible.value = false
}

const handleUpdate = async (updatedConfig: ChartConfig) => {
  const result = await chartStore.updateChartConfig(updatedConfig)
  if (result.ok) {
    toast.success('グラフ設定を更新しました')
  } else {
    toast.error('グラフ設定の更新に失敗しました')
  }
  closeSettings()
}
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

/* ---- 設定ボタン ---- */
.chart-settings-btn {
  top: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  min-width: 40px;
  padding: 0;
  transition: all 0.3s ease;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  border-width: 2px;
  border-style: solid;
}

.chart-settings-btn:hover {
  transform: rotate(90deg) scale(1.1);
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.chart-settings-btn .material-icons {
  font-size: 22px;
  line-height: 1;
  color: white;
}
</style>