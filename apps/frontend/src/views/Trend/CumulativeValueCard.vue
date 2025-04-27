<template>
  <div class="card z-index-2 mb-2 mt-0" :class="activeValue">
    <div class="card-header p-0 position-relative mx-2 z-index-2 bg-transparent" :class="activeValue==='daily'?'mt-2 mb-2':'mt-n4'" style="transition:0.3s">
      <div class="border-radius-lg" :class="activeValue">
        <div class="selector">
          <button class="fs-6 m-0 toggle-btn toggle-left" :class="{ active: activeValue === 'daily' }"
            @click="handleClick('daily')">
            Daily
          </button>
          <button class="fs-6 m-0 toggle-btn toggle-right" :class="{ active: activeValue === 'weekly' }"
            @click="handleClick('weekly')">
            Weekly
          </button>
        </div>
        <!-- 選択に応じて棒グラフと単純な数値表示を切り替え-->
        <CumulativeValueBarChart v-if="activeValue === 'weekly'" :chart="{
          labels: labelList,
          datasets: {
            label: '消費電力',
            data: cumulativeValueList,
          },
        }" />
        <CumulativeValueViewer v-else :value="cumulativeValue"/>
      </div>
    </div>
    <div v-if="activeValue === 'weekly'" class="card-body pt-2 pb-2 d-flex flex-row justify-content-between">
      <i class="material-icons icon-style fs-3">bolt</i>
      <h6  class="mb-0 mx-3 fs-5" style="font-size: large;">総消費電力</h6>
      <h6 class="mb-0 mx-3 fs-5" style="font-size: large;">kWh</h6>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,computed,watch,onMounted,type Ref } from 'vue';
import { storeToRefs } from "pinia";
import { useMonitoringStore } from "@/pinia/monitoringStore";
import { useChartStore } from '@/pinia/chartStore';
import CumulativeValueBarChart from "./CumulativeValueBarChart.vue";
import CumulativeValueViewer from './CumulativeValueViewer.vue';
import * as api from '@/api/';

const monitoringStore = useMonitoringStore();
const chartStore = useChartStore();

const { trendChartSettings } = storeToRefs(chartStore);

const activeValue = ref('daily');
const cumulativeValue= ref(0);
const cumulativeValueList:Ref<number[]>= ref([]);
const labelList:Ref<string[]>= ref([]);

// クリックされたときに親へ通知
function handleClick(newValue: string) {
  activeValue.value = newValue;
}

function formatDateToMMDD(date:Date) :string{
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月を2桁に
    const day = String(date.getDate()).padStart(2, '0'); // 日を2桁に
    return `${month}/${day}`;
}

async function getCumulativeValue(startDate: Date, endDate: Date) {
  try {    
    const response = await api.getCumulativeValue(1,startDate, endDate);

    //当日の消費電力を反映
    cumulativeValue.value = response.data/3600/1000;

    //過去7日間の消費電力を反映
    cumulativeValueList.value=[];
    labelList.value=[];

    //ローカル変数を用意
    let localCumulativeValueList: number[] = [];
    let localLabelList: string[] = [];
    
    localCumulativeValueList.push(response.data/3600/1000);
    localLabelList.push(formatDateToMMDD(startDate));
    
    for (let i = 1; i < 7; i++) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setDate(start.getDate() - i);
      end.setDate(end.getDate() - i);
      const response = await api.getCumulativeValue(1,start, end);
      localCumulativeValueList.push(response.data/3600/1000);
      localLabelList.push(formatDateToMMDD(start));

    }
    localCumulativeValueList=localCumulativeValueList.reverse();
    localLabelList=localLabelList.reverse();

    cumulativeValueList.value=localCumulativeValueList;
    labelList.value=localLabelList;

  } catch (err) {
    console.error("Error fetching data:", err);
  } 
}

function getSelectedDate(date: Date) {
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  return {
    startDate:startDate,
    endDate:endDate
  };
}

// 選択された日付が変更されたらデータを再取得
watch(() => trendChartSettings.value[0].specific_chart_setting.selected_date, async() => {
  const {startDate, endDate} = getSelectedDate(trendChartSettings.value[0].specific_chart_setting.selected_date);
  getCumulativeValue(startDate, endDate);
});

onMounted(async () => {
  const {startDate, endDate} = getSelectedDate(trendChartSettings.value[0].specific_chart_setting.selected_date);
  getCumulativeValue(startDate, endDate);
});
</script>

<style scoped>

.card.daily {
  background-color: #9d8210;
}

.card.weekly {
  background-color: white;
}

.daily {
  background-color: #4a4726;
  border:2px!important;
  border-color: #9d1010!important;
}
.weekly {
  background-color: #9d8210;
  border:2px!important;
  border-color: #9d1010!important;
}

.selector {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-right: 10px;
  /* 左側に寄せる */
  justify-self: flex-end;
}

.toggle-btn {
  background-color: #9d8210;
  border: 1px solid rgba(255, 255, 255, 0.408);
  color: white;
  width: 100px;
  transition: 0.3s;
}

/* ホバー時のエフェクト */
.toggle-btn:hover {
  background-color: #9d8210;
  border: 1px solid white;
  transform: translateY(-2px);
}

/* クリック(押し込み)時のエフェクト */
.toggle-btn:active {
  background-color: #ffffff;
  border: 1px solid white;
  color: #9d8210;
  font-weight: bold;
  transform: translateY(0px);
}

/* アクティブ時（選択されている状態）のスタイル */
.toggle-btn.active {
  background-color: #ffffff;
  color: #9d8210;
  font-weight: bold;
  border: 1px solid white;
}

/* アクティブ時にホバーしても何も起きないようにする */
.toggle-btn.active:hover {
  /* ここでホバー時の変化を打ち消す */
  background-color: #ffffff;
  border: 1px solid white;
  color: #9d8210;
  transform: none;
}

/* 左右の角を丸める */
.toggle-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.toggle-right {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
