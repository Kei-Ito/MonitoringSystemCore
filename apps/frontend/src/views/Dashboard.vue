<template>
  <div class=" container-fluid">
    <div class="row">
      <div class="col-lg-12 position-relative z-index-2">
        <GridLayout v-model:layout="layoutModel" :col-num="12" :row-height="30" :is-draggable="isAdmin"
          :is-resizable="isAdmin" :vertical-compact="true" :use-css-transforms="true"
          :class = "isAdmin ? 'vue-grid-layout-style':''">
          <GridItem v-for="(item, index) in layoutModel" :key="index" :static="item.static" :x="item.x" :y="item.y"
            :w="item.w" :h="item.h" :i="item.i" :class = "isAdmin ? 'p-2 vue-grid-item-style':''">
            <ChartHolderCard :chart="dashboardCharts[item.i]"/>
          </GridItem>
        </GridLayout>
        <!-- ゲージチャート 表示部-->
        <div class="row mt-4">
          <div class="col-ultra-wide-2 col-wide-3 col-midium-wide-4 col-midium-6 col-sm-12 mb-4">
            <button class="btn btn-primary" @click="onAddChartButtonClick">グラフ追加</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import { createChartForInitialization } from '@monitoring/shared/model';
import { ChartTypes } from '@monitoring/shared/enum';
import { useChartStore } from '@/pinia/chartStore';
import { useChannelRuntimeValuesStore } from '@/pinia/channelRuntimeValuesStore';
import { useUiStore } from '@/pinia/uiStore';
import { addDashboardChart } from '@/service/chartService';
import ChartHolderCard from '@/components/Cards/ChartHolderCard.vue';


const chartStore = useChartStore();
const { dashboardCharts, gridLayouts } = storeToRefs(chartStore);

const uiStore = useUiStore();
const { isAdmin } = storeToRefs(uiStore);

const layoutModel = computed({
  get: () => gridLayouts.value,
  set: (newLayouts) => {
    newLayouts.forEach((l) => chartStore.patchGrid(l));
  }
});

function onAddChartButtonClick() {
  const channelRuntimeValuesStore = useChannelRuntimeValuesStore();
  for (let i = 0;i<8;i++){
    channelRuntimeValuesStore.setValue(`channel_mock_uuid${i}`,Math.floor(Math.random() * 101));
  }
  
  /**
  if (dashboardCharts.value.length >= 10) {
    alert("最大10個までしか追加できません");
    return;
  }
  else if (dashboardCharts.value.length === 0) {
    addDashboardChart(createChartForInitialization(0, ChartTypes.GaugeChart))
    return;
  }
  else {
    const chart_id = Math.max(...dashboardCharts.value.map((chart) => chart.chart_id)) + 1;
    addDashboardChart(createChartForInitialization(chart_id, ChartTypes.GaugeChart))
  }
*/
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
  border: 1px solid rgb(140, 140, 140);
  border-style:double
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
