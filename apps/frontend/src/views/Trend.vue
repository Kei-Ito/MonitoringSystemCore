<template>
  <div class="py-4 container-fluid  min-vh-70">
    <GridLayout
      v-model:layout="layoutModel"
      :col-num="12"
      :row-height="30"
      :is-draggable="isAdmin"
      :is-resizable="isAdmin"
      :vertical-compact="true"
      :use-css-transforms="true"
      :class="isAdmin ? 'vue-grid-layout-style' : ''"
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
        :class="isAdmin ? 'p-2 vue-grid-item-style' : ''"
      >
        <ChartHolderCard
          :chart="trendCharts[item.i]"
        />
      </GridItem>
    </GridLayout>
    <div class="row mb-4">
      <div class="col-12" style="height: 400px;">
        <DummyBarChartCard />
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-12" style="height: 400px;">
        <DummyAreaLineChartCard  />
      </div>
    </div>

    <date-range-picker-modal
      :show="isDateRangeModalVisible"
      :start-date="selectedDateRange.startDate"
      :end-date="selectedDateRange.endDate"
      @close="hideDateRangePicker"
      @date-range-selected="updateDateRange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { GridItem, GridLayout } from 'vue-grid-layout-v3';

import { useUiStore } from '@/pinia/uiStore';
import { useChartStore } from '@/pinia/chartStore';
import { useChannelValuesStore } from '@/pinia/channelValuesStore';

import ChartHolderCard from '@/components/Cards/ChartHolderCard.vue';
import DummyBarChartCard from '@/components/Cards/DummyBarChartCard.vue';
import DummyAreaLineChartCard from '@/components/Cards/DummyAreaLineChartCard.vue';
import { getTrendData, cancelTrendDataRequests } from '@/service/trendDataService';
import DateRangePickerModal from '@/components/DateRangePickerModal.vue';

import { ChartTypes } from '@monitoring/shared/enum';
import type { ChartConfig, ChannelSeries } from '@monitoring/shared/model';

const emit = defineEmits<{
  'update-navbar-date-range': [{ text: string; callback: () => void }];
}>();

const chartStore = useChartStore();
const { trendCharts } = storeToRefs(chartStore);
const channelValuesStore = useChannelValuesStore();

const uiStore = useUiStore();
const { isAdmin, trendViewCategory1Selected, trendViewCategory2Selected } = storeToRefs(uiStore);

const layoutModel = computed({
  get: () => chartStore.gridLayoutsFilteredByPage("trend", trendViewCategory1Selected.value, trendViewCategory2Selected.value),
  set: (newLayouts) => {
    //TODO : 非表示中のグラフのレイアウトを更新しないようにするか検討
    newLayouts.forEach((l) => chartStore.patchGrid(l));
  },
});

// 日付範囲の状態管理
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

const selectedDateRange = ref({
  startDate: today,
  endDate: endOfToday
});

const isDateRangeModalVisible = ref(false);

// 日付範囲のテキスト表示
const dateRangeText = computed(() => {
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
  isDateRangeModalVisible.value = true;
}

function hideDateRangePicker() {
  isDateRangeModalVisible.value = false;
}

function updateDateRange(range: { startDate: Date; endDate: Date }) {
  selectedDateRange.value = range;
  refreshTrendData();
}

async function refreshTrendData() {
  const channel_uuid_list = new Set<string>();
  
  // チャートで使用しているチャンネルの一覧を取得
  Object.keys(trendCharts.value).forEach((key) => {
    const chart = trendCharts.value[key];
    if (chart.channel_uuids && chart.channel_uuids.length > 0) {
      chart.channel_uuids.forEach((uuid) => channel_uuid_list.add(uuid));
    }
  });

  channelValuesStore.prune(channel_uuid_list);

  for (const uuid of channel_uuid_list) {
    // チャンネルのUUIDを使ってトレンドデータを取得
    await getTrendData(
      uuid, 
      selectedDateRange.value.startDate, 
      selectedDateRange.value.endDate
    );
  }
}

// Navbarに日付範囲テキストとコールバックを通知
function updateNavbarDateRange() {
  emit('update-navbar-date-range', {
    text: dateRangeText.value,
    callback: showDateRangePicker
  });
}

onMounted(async () => {
  // Navbarに初期状態を通知
  updateNavbarDateRange();
  await refreshTrendData();
});

// 日付範囲が変更されたらNavbarに通知
watch(dateRangeText, () => {
  updateNavbarDateRange();
});

onBeforeUnmount(() => {
  cancelTrendDataRequests();
  channelValuesStore.prune(new Set());
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
