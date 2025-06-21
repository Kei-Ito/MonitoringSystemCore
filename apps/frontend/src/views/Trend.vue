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
        v-for="item in layoutModel"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :class="isAdmin ? 'p-2 vue-grid-item-style' : ''"
      >
        <TrendChartHolderCard
          :chart="trendCharts[item.i]"
          :selectedDate="selectedDate"
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { GridItem, GridLayout } from 'vue-grid-layout-v3';
import { ChartTypes } from '@monitoring/shared/enum';
import type { ChartConfig } from '@monitoring/shared/model';

import { useUiStore } from '@/pinia/uiStore';
import { useChartStore } from '@/pinia/chartStore';

import TrendNavBarCard from '@/components/Cards/TrendNavBarCard.vue';
import TrendChartHolderCard from '@/components/Cards/TrendChartHolderCard.vue';
import DatePickerModal from '../components/DatePickerModal.vue';

const uiStore = useUiStore();
const chartStore = useChartStore();
const { isAdmin, trendViewCategory1Selected, trendViewCategory2Selected } = storeToRefs(uiStore);

const trendChartsArr = computed<ChartConfig[]>(() => chartStore.uiLayoutsData['trend'] ?? []);
const trendCharts = computed<Record<string, ChartConfig>>(
  () => Object.fromEntries(trendChartsArr.value.map((c) => [c.chart_uuid, c]))
);

const layoutModel = computed({
  get: () =>
    chartStore.gridLayoutsFilteredByPage(
      'trend',
      trendViewCategory1Selected.value,
      trendViewCategory2Selected.value
    ),
  set: (newLayouts: typeof layoutModel.value) => {
    newLayouts.forEach((l) => chartStore.patchGrid(l));
  },
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
