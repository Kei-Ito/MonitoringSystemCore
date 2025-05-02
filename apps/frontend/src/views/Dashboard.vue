<template>
  <div class=" container-fluid">
    <div class="row">
      <div class="col-lg-12 position-relative z-index-2">

        <!-- ゲージチャート 表示部-->
        <div class="row mt-4">
          <div class="col-ultra-wide-2 col-wide-3 col-midium-wide-4 col-midium-6 col-sm-12 mb-4"
            v-for="(chartSetting, index) in dashboardCharts" :key="index">
            <DashboardChartHolderCard :setting="chartSetting">
              <e-charts-gauge-chart :value="chartSetting.specific_chart_setting.lastValue"
                :chartSetting="chartSetting" />
            </DashboardChartHolderCard>
          </div>
        </div>
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
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChartStore } from '@/pinia/chartStore';
import { addDashboardChart } from '@/service/chartService';
import DashboardChartHolderCard from "@/components/Cards/DashboardChartHolderCard.vue";
import EChartsGaugeChart from "@/components/Charts/EChartsGaugeChart.vue";
import { createChartForInitialization } from '@monitoring/shared/model';
import { ChartTypes } from '@monitoring/shared/enum';

const chartStore = useChartStore();
const { dashboardCharts } = storeToRefs(chartStore);

function onAddChartButtonClick() {
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
</style>
