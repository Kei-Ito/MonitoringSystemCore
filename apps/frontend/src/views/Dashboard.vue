<template>
  <div class="container-fluid min-vh-70">
    <div class="row">
      <div class="col-lg-12 position-relative z-index-2">
        <GridLayout v-model:layout="layoutModel" :col-num="12" :row-height="12" :is-draggable="isLayoutEditMode"
          :is-resizable="isLayoutEditMode" :vertical-compact="true" :use-css-transforms="true"
          :class = "isLayoutEditMode ? 'vue-grid-layout-style':''">
          <GridItem v-for="(item) in layoutModel" :key="item.i" :static="item.static" :x="item.x" :y="item.y"
            :w="item.w" :h="item.h" :i="item.i" :class = "isLayoutEditMode ? 'p-2 vue-grid-item-style':''">
            <ChartHolderCard :chart="dashboardCharts[item.i]" mode="realtime"/>
          </GridItem>
        </GridLayout>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch, nextTick, onActivated, onDeactivated } from 'vue';
import { GridItem,GridLayout } from 'vue-grid-layout-v3';
import type { GridLayout as GridLayoutType } from '@monitoring/shared/model';

import ChartHolderCard from '@/components/Cards/ChartHolderCard.vue';
import { useChartStore } from '@/pinia/chartStore';
import { useUiStore } from '@/pinia/uiStore';

defineOptions({
  name: 'Dashboard'
});

const chartStore = useChartStore();
const { dashboardCharts } = storeToRefs(chartStore);

const uiStore = useUiStore();
const { isLayoutEditMode, dashboardViewCategory1Selected, dashboardViewCategory2Selected } = storeToRefs(uiStore);

const layoutModel = ref<GridLayoutType[]>([]);
const isUpdatingFromStore = ref(false);
const isPageActive = ref(true);

// ストアのデータ変更を監視してローカルのlayoutModelに反映
watch(
  () => chartStore.gridLayoutsFilteredByPage("dashboard", dashboardViewCategory1Selected.value, dashboardViewCategory2Selected.value),
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

onActivated(() => {
  isPageActive.value = true;
  // 復帰時に最新のレイアウト情報をストアから強制的に同期
  const currentLayout = chartStore.gridLayoutsFilteredByPage("dashboard", dashboardViewCategory1Selected.value, dashboardViewCategory2Selected.value);
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
  min-height: 70vh;
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
