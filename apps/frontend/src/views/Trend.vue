<template>
  <div class="py-4 container-fluid  min-vh-70">
    <!--
    <div class="row mb-4">
      <trend-nav-bar-card />
    </div>
    -->

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

import { useUiStore } from '@/pinia/uiStore';
import { useChartStore } from '@/pinia/chartStore';

import ChartHolderCard from '@/components/Cards/ChartHolderCard.vue';
import { getTrendData } from '@/service/trendDataService';
import DatePickerModal from '../components/DatePickerModal.vue';

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

  
  await getTrendData("10030", new Date(), new Date());
  await getTrendData("10031", new Date(), new Date());
  await getTrendData("10032", new Date(), new Date());
  await getTrendData("10033", new Date(), new Date());
  await getTrendData("10034", new Date(), new Date());
  await getTrendData("10035", new Date(), new Date());
  await getTrendData("10036", new Date(), new Date());
  await getTrendData("10037", new Date(), new Date());
  await getTrendData("10038", new Date(), new Date());

  await getTrendData("10012", new Date(), new Date());
  await getTrendData("10013", new Date(), new Date());
  await getTrendData("10014", new Date(), new Date());
  await getTrendData("10015", new Date(), new Date());

  await getTrendData("10020", new Date(), new Date());
  
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
