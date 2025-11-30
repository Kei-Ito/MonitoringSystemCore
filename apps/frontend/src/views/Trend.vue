<template>
  <div class="container-fluid  min-vh-70">
    <GridLayout
      v-model:layout="layoutModel"
      :col-num="12"
      :row-height="30"
      :is-draggable="isLayoutEditMode"
      :is-resizable="isLayoutEditMode"
      :vertical-compact="true"
      :use-css-transforms="true"
      :class="isLayoutEditMode ? 'vue-grid-layout-style' : ''"
    >
      <GridItem
        v-for="(item) in layoutModel"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :class="isLayoutEditMode ? 'p-2 vue-grid-item-style' : ''"
      >
        <ChartHolderCard
          :chart="trendCharts[item.i]"
          mode="trend"
        />
      </GridItem>
    </GridLayout>
    <div class="row mb-4">
      <div class="col-12" style="height: 400px;">
        <DummyAreaLineChartCard  />
      </div>
    </div>

    <date-range-picker-modal
      :show="isDateRangeModalVisible"
      :start-date="selectedDateRange.startDate"
      :end-date="selectedDateRange.endDate"
      :initial-is-realtime="trendStore.isRealtimeMode"
      @close="hideDateRangePicker"
      @date-range-selected="updateDateRange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onActivated, onDeactivated } from 'vue';
import { storeToRefs } from 'pinia';
import { GridItem, GridLayout } from 'vue-grid-layout-v3';
import type { GridLayout as GridLayoutType } from '@monitoring/shared/model';

import { useUiStore } from '@/pinia/uiStore';
import { useChartStore } from '@/pinia/chartStore';
import { useTrendStore } from '@/pinia/trendStore';

import ChartHolderCard from '@/components/Cards/ChartHolderCard.vue';
import DummyAreaLineChartCard from '@/components/Cards/DummyAreaLineChartCard.vue';
import DateRangePickerModal from '@/components/DateRangePickerModal.vue';

// KeepAliveのinclude="Trend"と一致させるために明示的に名前を定義
defineOptions({
  name: 'Trend'
});

const emit = defineEmits<{
  'update-navbar-date-range': [{ text: string; callback: () => void }];
  'update-navbar-loading': [boolean];
}>();

const chartStore = useChartStore();
const { trendCharts } = storeToRefs(chartStore);
const trendStore = useTrendStore();

const uiStore = useUiStore();
const { isLayoutEditMode, trendViewCategory1Selected, trendViewCategory2Selected } = storeToRefs(uiStore);
const { selectedDateRange, isRealtimeMode, isLoading } = storeToRefs(trendStore);

const layoutModel = ref<GridLayoutType[]>([]);
const isUpdatingFromStore = ref(false);
const isPageActive = ref(true);

// 日付変更監視用
let dateCheckInterval: number | undefined;

function startDateChangeCheck() {
  if (dateCheckInterval) return;
  
  // 1分ごとに日付変更をチェック
  dateCheckInterval = window.setInterval(() => {
    trendStore.checkDateChange();
  }, 60000);
  
  // 開始時にも一度チェック
  trendStore.checkDateChange();
}

function stopDateChangeCheck() {
  if (dateCheckInterval) {
    clearInterval(dateCheckInterval);
    dateCheckInterval = undefined;
  }
}

// ストアのデータ変更を監視してローカルのlayoutModelに反映
watch(
  () => chartStore.gridLayoutsFilteredByPage("trend", trendViewCategory1Selected.value, trendViewCategory2Selected.value),
  (newVal) => {
    // ページが非表示の間はレイアウト更新処理をスキップしてメモリ/CPUを節約
    if (!isPageActive.value) return;

    isUpdatingFromStore.value = true;
    layoutModel.value = JSON.parse(JSON.stringify(newVal));
    nextTick(() => {
      isUpdatingFromStore.value = false;
    });
  },
  { immediate: true, deep: true }
);

// ローカルのlayoutModelの変更を監視して、編集モード時のみストアに保存
watch(
  layoutModel,
  (newVal) => {
    if (isUpdatingFromStore.value) return;

    if (isLayoutEditMode.value) {
      newVal.forEach((l) => chartStore.patchGrid(l));
    }
  },
  { deep: true }
);

// 日付範囲の状態管理
// selectedDateRangeはtrendStoreで管理

const isDateRangeModalVisible = ref(false);

// 日付範囲のテキスト表示
const dateRangeText = computed(() => {
  if (isRealtimeMode.value) {
    return "リアルタイム (当日)";
  }

  const start = selectedDateRange.value.startDate;
  const end = selectedDateRange.value.endDate;
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  };
  
  const startStr = formatDate(start);
  const endStr = formatDate(end);
  
  // 同じ日の場合は1つだけ表示
  if (startStr === endStr) {
    return startStr;
  }
  
  return `${startStr} - ${endStr}`;
});

function showDateRangePicker() {
  if (isLoading.value) return;
  isDateRangeModalVisible.value = true;
}

function hideDateRangePicker() {
  isDateRangeModalVisible.value = false;
}

function updateDateRange(payload: { isRealtime: boolean; startDate: Date; endDate: Date }) {
  trendStore.setTrendCondition(payload.isRealtime, {
    startDate: payload.startDate,
    endDate: payload.endDate
  });
}

// Navbarに日付範囲テキストとコールバックを通知
function updateNavbarDateRange() {
  emit('update-navbar-date-range', {
    text: dateRangeText.value,
    callback: showDateRangePicker
  });
}

// ローディング状態を監視してNavbarに通知
watch(isLoading, (newVal) => {
  emit('update-navbar-loading', newVal);
});

onMounted(async () => {
  // Navbarに初期状態を通知
  updateNavbarDateRange();
  emit('update-navbar-loading', isLoading.value);
  startDateChangeCheck();
});

onActivated(() => {
  isPageActive.value = true;
  // KeepAliveでキャッシュから復帰した際にもNavbarを更新
  updateNavbarDateRange();
  startDateChangeCheck();

  // 復帰時に最新のレイアウト情報をストアから強制的に同期
  // (非表示中にスキップしていた更新をここで反映)
  const currentLayout = chartStore.gridLayoutsFilteredByPage("trend", trendViewCategory1Selected.value, trendViewCategory2Selected.value);
  if (currentLayout) {
    isUpdatingFromStore.value = true;
    layoutModel.value = JSON.parse(JSON.stringify(currentLayout));
    nextTick(() => {
      isUpdatingFromStore.value = false;
    });
  }
});

onDeactivated(() => {
  isPageActive.value = false;
  stopDateChangeCheck();
});

// 日付範囲が変更されたらNavbarに通知
watch([dateRangeText, isRealtimeMode], () => {
  updateNavbarDateRange();
});

</script>
<style scoped>
@media (min-width: 2000px) {
  .col-ultra-wide-2 {
    flex: 0 0 20.0%;
    max-width: 20.0%;
    margin: 0;
  }
}

@media (min-width: 1600px) and (max-width: 2000px) {
  .col-wide-3 {
    flex: 0 0 25%;
    max-width: 25%;
    margin: 0;
  }
}

@media (min-width: 1290px) and (max-width: 1600px) {
  .col-midium-wide-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    margin: 0;
  }
}

@media (min-width: 700px) and (max-width: 1290px) {
  .col-midium-6 {
    flex: 0 0 50%;
    max-width: 50%;
    margin: 0;
  }
}

.vue-grid-layout-style {
  background: #eee;
}

.vue-grid-item-style:not(.vue-grid-placeholder) {
  background: #ccc;
  /* 線種を点線に */
  border-style: dotted;
  /* 不透明度を下げて目立たなくする */
  border-color: rgba(140, 140, 140, 0.35);
}

.vue-grid-item-style.static {
  background: #cce;
}

.vue-grid-item-style .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
</style>
