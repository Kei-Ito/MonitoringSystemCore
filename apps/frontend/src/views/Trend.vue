<template>
  <div class="py-4 container-fluid">
    <div class="row mb-4">
      <trend-nav-bar-card />
    </div>

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

    <date-picker-modal
      :show="isModalVisible"
      @close="hideModal"
      @date-selected="updateDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed,onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { GridItem, GridLayout } from 'vue-grid-layout-v3';
import { ChartTypes } from '@monitoring/shared/enum';
import type { ChartConfig } from '@monitoring/shared/model';

import { useUiStore } from '@/pinia/uiStore';
import { useChartStore } from '@/pinia/chartStore';

import TrendNavBarCard from '@/components/Cards/TrendNavBarCard.vue';
import TrendChartHolderCard from '@/components/Cards/TrendChartHolderCard.vue';
import ChartHolderCard from '@/components/Cards/ChartHolderCard.vue';
import DatePickerModal from '../components/DatePickerModal.vue';
import { getTrendData } from '@/service/trendDataService';

const chartStore = useChartStore();
const { trendCharts } = storeToRefs(chartStore);

const uiStore = useUiStore();
const { isAdmin, trendViewCategory1Selected, trendViewCategory2Selected } = storeToRefs(uiStore);

const layoutModel = computed({
  get: () => chartStore.gridLayoutsFilteredByPage("trend", trendViewCategory1Selected.value, trendViewCategory2Selected.value),
  set: (newLayouts) => {
    //TODO : 非表示中のグラフのレイアウトを更新しないようにするか検討
    newLayouts.forEach((l) => chartStore.patchGrid(l));
  },
});

onMounted(async () => {

  // トレンドデータを未取得の状態ならトレンドデータを取得
  await getTrendData('channel_mock_uuid0', new Date(), new Date());
});

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const nextDay = new Date(today);
nextDay.setDate(nextDay.getDate() + 1);

const isModalVisible = ref(false);
const selectedDate = ref({ startDate: today, endDate: nextDay });

function hideModal() {
  isModalVisible.value = false;
}

function updateDate(date: any) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  selectedDate.value = { startDate: start, endDate: end };
}
</script>
