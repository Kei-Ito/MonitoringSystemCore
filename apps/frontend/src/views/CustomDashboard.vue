<template>
  <div class=" container-fluid">
    <!-- ゲージチャート 表示部-->
    <div class="row">
      <div class="col-ultra-wide-6 col-wide-6 col-midium-wide-6 col-midium-6 col-sm-12">
        <div class="card large-card mt-4 mx-1 z-index-2">
          <div class="custom-card-header mt-n4 z-index-2 mx-2 p-0 d-flex align-items-center justify-content-center"
            :class="`bg-gradient-${color} shadow-${color}`">
            <h6 class="text-white text-capitalize fs-2 m-0">流水殺菌装置</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-12 col-sm-6 col-xs-12">
                <LiquidComoponent />
              </div>
              <div class="col-lg-6 col-md-12 col-sm-6 col-xs-12">
                <div
                  class="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-flex flex-row align-items-center mb-3 ms-2 blurry-underline">
                  <!-- アイコン -->
                  <i class="material-icons-round fs-2 text-dark">speed</i>
                  <!-- テキスト -->
                  <p class="font-weight-bold fs-4 text-dark mb-0 ms-2">
                    内蔵センサ
                  </p>
                </div>
                <UVComponent :value="chartSettings[0].specific_chart_setting.lastValue"
                  :chartSetting="chartSettings[0]" />
                <FlowVolumeCard :value="chartSettings[1].specific_chart_setting.lastValue"
                  :chartSetting="chartSettings[1]" />
              </div>
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-2">
                <div
                  class="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-flex flex-row align-items-center mb-3 ms-2 blurry-underline">
                  <!-- アイコン -->
                  <i class="material-icons-round fs-2 text-dark">insights</i>
                  <!-- テキスト -->
                  <p class="font-weight-bold fs-4 text-dark mb-0 ms-2">
                    殺菌効果
                  </p>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <CustomDashboardCard :value="LiquidValue" />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 align-items-center">
                    <span class="content-text font-weight-bold fs-2 px-2 d-flex align-items-center justify-content-center border
                       border-5 rounded-pill shadow-lg" :class="status1 === 'Very Good' ? 'border-info text-info' :
                          status1 === 'Good' ? 'border-success text-success' :
                            status1 === 'Warning' ? 'border-warning text-warning' :
                              status1 === 'Stopped' ? 'border-secondary text-danger' : ''
                        " style="font-style: oblique;">{{ status1 }}</span>
                    <p class="font-weight-bold mt-4 fs-5 d-flex align-items-center justify-content-center">
                      {{ status1 === 'Very Good' ? '装置は理想的な状態で稼働しています' :
                        status1 === 'Good' ? '装置は正常に稼働しています' :
                          status1 === 'Warning' ? '装置の稼働効率が低下しています' :
                            status1 === 'Stopped' ? '装置は停止しています' : '' }}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-ultra-wide-6 col-wide-6 col-midium-wide-6 col-midium-6 col-sm-12">
        <div class="card large-card mt-4 mx-1 z-index-2">
          <div class="custom-card-header mt-n4 z-index-2 mx-2 p-0 d-flex align-items-center justify-content-center bg-gradient-purple"
            :class="`shadow-${color}`">
            <h6 class="text-white text-capitalize fs-2 m-0">UV硬化装置</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <CuringComponent />
              </div>
              <div
                class="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-flex flex-row align-items-center mb-3 ms-2 blurry-underline">
                <!-- アイコン -->
                <i class="material-icons-round fs-2">speed</i>
                <!-- テキスト -->
                <p class="font-weight-bold fs-4 text-dark mb-0 ms-2">
                  内蔵センサ
                </p>
              </div>

              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="row">
                  <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <UVComponent2 :value="chartSettings[2].specific_chart_setting.lastValue"
                      :chartSetting="chartSettings[2]" />
                  </div>
                  <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <WaterTemperatureCard :value="chartSettings[3].specific_chart_setting.lastValue"
                      :chartSetting="chartSettings[3]" />
                  </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-7 pt-2">
                  <div
                    class="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-flex flex-row align-items-center mb-3 ms-2 blurry-underline">
                    <!-- アイコン -->
                    <i class="material-icons-round fs-2 text-dark">insights</i>
                    <!-- テキスト -->
                    <p class="font-weight-bold fs-4 text-dark mb-0 ms-2">
                      硬化具合
                    </p>
                  </div>
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <CustomDashboardCard :value="CuringValue" />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 align-items-center">
                      <span class="content-text font-weight-bold fs-2 px-2 d-flex align-items-center justify-content-center border
                       border-5 rounded-pill shadow-lg" :class="status2 === 'Very Good' ? 'border-info text-info' :
                          status2 === 'Good' ? 'border-success text-success' :
                            status2 === 'Warning' ? 'border-warning text-warning' :
                              status2 === 'Stopped' ? 'border-secondary text-danger' : ''"
                        style="font-style: oblique;">{{ status2 }}</span>
                      <p class="font-weight-bold mt-4 fs-5 d-flex align-items-center justify-content-center">
                        {{ status2 === 'Very Good' ? '装置は理想的な状態で稼働しています' :
                          status2 === 'Good' ? '装置は正常に稼働しています' :
                            status2 === 'Warning' ? '装置の稼働効率が低下しています' :
                              status2 === 'Stopped' ? '装置は停止しています' : '' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch ,type ComputedRef } from 'vue';
import { useStore } from 'vuex';
import type { ChartSetting } from '@monitoring/shared/model';
import WaterTemperatureCard from './CustomDashboard/WaterTemperatureCard.vue';
import FlowVolumeCard from './CustomDashboard/FlowVolumeCard.vue';
import LiquidComoponent from './CustomDashboard/LiquidComponent.vue';
import CuringComponent from './CustomDashboard/CuringComponent.vue';
import UVComponent from "./CustomDashboard/UVComponent.vue";
import UVComponent2 from "./CustomDashboard/UVComponent2.vue";
import CustomDashboardCard from './CustomDashboard/CustomDashboardCard.vue';

const store = useStore();
const chartSettings: ComputedRef<ChartSetting[]> = computed(() => store.state.systemSetting.dashboardCharts);
const color = computed(() => store.state.systemSetting.color);

const status1 = ref('Good');
const status2 = ref('Good');

const UV1Min = 0;
const UV1Max = 100;
const UV1Best = 50;

const LiquidMin = 0;
const LiquidMax = 3;
const LiquidBest = 1.15;
let LiquidValue = 0;

const UV2Min = 0;
const UV2Max = 100;
const UV2Best = 50;
const TemplatureMin = 0;
const TemplatureMax = 40;
const TemplatureBest = 20;
let CuringValue = 0;

watch(chartSettings.value, (newVal) => {
  updateChart(newVal);
});

function updateChart(chartSettings: ChartSetting[]) {
  LiquidValue = (1 - Math.abs(chartSettings[0].specific_chart_setting.lastValue - UV1Best) / Math.max((UV1Best - UV1Min), (UV1Max - UV1Min))) * 100 * 0.7 +
    (1 - Math.abs(chartSettings[1].specific_chart_setting.lastValue - LiquidBest) / Math.max((LiquidBest - LiquidMin), (LiquidMax - LiquidBest))) * 100 * 0.3;
  CuringValue = (1 - Math.abs(chartSettings[2].specific_chart_setting.lastValue - UV2Best) / Math.max((UV2Best - UV2Min), (UV2Max - UV2Min))) * 100 * 0.7 +
    (1 - Math.abs(chartSettings[3].specific_chart_setting.lastValue - TemplatureBest) / Math.max((TemplatureBest - TemplatureMin), (TemplatureMax - TemplatureBest))) * 100 * 0.3;
  if (LiquidValue >= 80) {
    status1.value = 'Very Good';
  } else if (LiquidValue >= 50 && LiquidValue < 80) {
    status1.value = 'Good';
  } else if (LiquidValue >= 20 && LiquidValue < 50) {
    status1.value = 'Warning';
  } else if (LiquidValue < 20) {
    status1.value = 'Stopped';
  }

  if (CuringValue >= 80) {
    status2.value = 'Very Good';
  } else if (CuringValue >= 50 && CuringValue < 80) {
    status2.value = 'Good';
  } else if (CuringValue >= 20 && CuringValue < 50) {
    status2.value = 'Warning';
  } else if (CuringValue < 20) {
    status2.value = 'Stopped';
  }
};

</script>
<style scoped>
@media (min-width: 2000px) {
  .col-ultra-wide-6 {
    flex: 0 0 50%;
    max-width: 50%;
    margin: 0;
  }
}

@media (min-width: 1600px) and (max-width: 2000px) {
  .col-wide-6 {
    flex: 0 0 50%;
    max-width: 50%;
    margin: 0;
  }
}

@media (min-width: 1200px) and (max-width: 1600px) {
  .col-midium-wide-6 {
    flex: 0 0 50%;
    max-width: 50%;
    margin: 0;
  }
}

@media (min-width: 600px) and (max-width: 1200px) {
  .col-midium-6 {
    flex: 0 0 50%;
    max-width: 50%;
    margin: 0;
  }
}

.custom-card-header {
  border-radius: 10px;
}

.large-card {
  background: white;
}

.shadow-dark {
  box-shadow: 0 0 10px 3px rgba(58, 178, 255, 0.3) !important;
}

.bg-gradient-purple{
  background: linear-gradient(87deg,
        rgba(147,112,219, 1) 0%,
        rgba(153,102,204, 1) 100%) !important;
}

/* アンダーラインのスタイル */
.blurry-underline {
  position: relative;
  /* ::afterの位置決めの基準にする */
  display: inline-flex;
  /* アイコンとテキストを一体化 */
}

.blurry-underline::after {
  content: "";
  position: absolute;
  bottom: 0;
  /* 要素の下に配置 */
  left: 0;
  width: 100%;
  height: 2px;
  /* アンダーラインの太さ */
  background: rgb(23, 22, 23, 0.8);
  /* アンダーラインの色 */
  filter: blur(2px);
  /* ぼんやりとした効果 */
  z-index: -1;
  /* 背面に配置 */
}

.status-Good {
  color: #009c00;
  border-color: #009c00;
  border-width: 5px;

}

.status-Warning {
  color: #ff6e76;
  border-color: #ff6e76;
}
</style>
