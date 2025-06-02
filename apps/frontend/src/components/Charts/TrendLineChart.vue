<template>
  <div> 
    <!--
    <div ref="chartRef" :style="{  height,minHeight }"></div>
    <h1 v-if="error" :style="{  height  ,minHeight}">Error</h1>
    -->
  </div>
</template>

<script lang="ts" setup>
//TODO:変更中のためコメントアウト 
/** 
import { ref, onMounted, onBeforeUnmount,nextTick, computed ,type PropType, } from 'vue';
import { storeToRefs } from 'pinia';
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { useChartStore } from '@/pinia/chartStore';
import * as echarts from 'echarts';
import { getDefaultTrendLineChartOptions} from './TrendLineChartOption';

interface SelectedDate {
  startDate: Date;
  endDate: Date;
}

const props = defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "40vh" },
  minHeight: { type: String, default: "250px" },
  selectedDate: {
    type: Object as PropType<SelectedDate>,
    required: true
  }
});

//TODO: トレンドグラフは複数表示する仕様に変更になったので要修正
const monitoringStore = useMonitoringStore();
const chartStore = useChartStore();

const { ioModules} = storeToRefs(monitoringStore);
const { trendChartSettings } = storeToRefs(chartStore);
const channelSetting = computed(() => {
  if (!trendChartSettings.value) return null; // chartSettingがnullの場合はnullを返す
  // TODO: チャートの設定の更新影響を受ける箇所のため、要修正箇所
  //const module_uuid = trendChartSettings.value[0].module_uuid;
  //const channel_id = trendChartSettings.value[0].channel_id;
  //return ioModules.value.find((module) => module.module_uuid === module_uuid)?.input_channels.find((channel) => channel.channel_id === channel_id);
});

const chartRef = ref<HTMLDivElement | null>(null);
const error = ref(false);
const myChart = ref<echarts.ECharts | null>(null);
const loading = ref(false);

async function fetchData(startDate: Date, endDate: Date) {
  loading.value = true;
  await nextTick();
  try {
    if (myChart.value ) {
      myChart.value.showLoading('default', { text: '', spinnerRadius: 30, color: '#c23531' });
    }
    // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
    //const response = await api.fetchTrendData(trendChartSettings.value[0].channel_id,startDate, endDate);
    myChart.value?.hideLoading();
    // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
    //updateChart(response.data);
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

function getSelectedDate(date: Date) {
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return {
    startDate:startDate,
    endDate:endDate
  };
}

async function initChart() {
  const chartDom = chartRef.value;
  if (!chartDom) {
    console.error("Chart DOM element is not available.");
    error.value = true;
    return;
  }
  myChart.value = echarts.init(chartDom, null, { renderer: 'svg' });
  myChart.value.setOption(getDefaultTrendLineChartOptions());
  fetchData(props.selectedDate.startDate, props.selectedDate.endDate);
}

function updateChart(input_data: any) {
  if (!myChart.value) {
    console.error("Chart is not initialized.");
    return;
  }
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  //const min_threshold = channelSetting.value?.min_threshold??0;
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  //const max_threshold = channelSetting.value?.max_threshold??80;
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  //const TrendLineChartOptions = getTrendLineChartOptions(input_data,min_threshold,max_threshold);
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  //myChart.value.setOption(TrendLineChartOptions, { lazyUpdate: true });
}

function handleResize() {
  if (myChart.value && chartRef.value) {
    myChart.value?.resize();
    // 0.18秒後にリサイズ
    setTimeout(() => {
      myChart.value?.resize();
    }, 250);
  }
}

// チャンネルIDが変更されたらデータを再取得
// TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
/**
watch(() => trendChartSettings.value[0].channel_id, () => {
  const {startDate, endDate} = getSelectedDate(trendChartSettings.value[0].specific_chart_setting.selected_date);
  fetchData(startDate, endDate);
});
*/

// 選択された日付が変更されたらデータを再取得
// TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
/**
watch(() => trendChartSettings.value[0].specific_chart_setting.selected_date, async() => {
  const {startDate, endDate} = getSelectedDate(trendChartSettings.value[0].specific_chart_setting.selected_date);
  fetchData(startDate, endDate);
});


onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (myChart.value) myChart.value.dispose();
});
*/
</script>