<template>
    <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch ,computed,type PropType} from 'vue';
import { useStore } from 'vuex';
import * as echarts from 'echarts';
import { getDefaultGaugeChartOptions } from '@/components/Charts/GaugeChartOption';
import type { IOModule,ChartSetting } from '@monitoring/shared/model';

const store = useStore();
const props = defineProps({
    chartSetting:{
        type: Object as PropType<ChartSetting>,
        required: true
    },
    value: {
        type: Number,
        default: 40
    }
});

let isActivated = false;
const channelSetting = computed(() => {
  if (!props.chartSetting) return null; // chartSettingがnullの場合はnullを返す
  const module_uuid = props.chartSetting.module_uuid;
  const channel_id = props.chartSetting.channel_id;
  return (store.state.systemSetting.ioModules as IOModule[]).find((module) => module.module_uuid === module_uuid)?.input_channels.find((channel) => channel.channel_id === channel_id);
});


const chartRef = ref(null);
let chart:any = null;
let resizeTimeout;


function initChart() {
    if (!chartRef.value) return;

    chart = echarts.init(chartRef.value, null, { renderer: 'svg',useDirtyRect:false });
    chart.setOption(getDefaultGaugeChartOptions(props.chartSetting));
    if(props.chartSetting.specific_chart_setting.lastValue!==null && props.chartSetting.specific_chart_setting.lastValue!==undefined && 
    !Number.isNaN(props.chartSetting.specific_chart_setting.lastValue)){
        updateChart(props.chartSetting.specific_chart_setting.lastValue);
        isActivated = true;
    }
    
    const observer = new ResizeObserver(()=>{
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(()=>{
			if (chart){
				chart.resize();
			}
		},50);
	});
	observer.observe(chartRef.value);	
}

function handleResize() {
    if (chart) {
        chart.resize();
        setTimeout(() => {
            chart.resize();
        }, 150);
    }
}

function updateChart(newValue: number) {
    if (!chart) return;
    if(!isActivated){
        activateChart();
        isActivated = true;
    }

    chart.setOption({
        series: [{
            data: [{ value: newValue }],
        }]
    });
}

function activateChart() {
    if (!chart) return;
    if (!channelSetting.value) return;

    chart.setOption({
        series: [{
            animation: false,
            axisLine: {
                lineStyle: {
                    width: 6,
                    color: [
                        [props.chartSetting.specific_chart_setting.thresholds[0], props.chartSetting.specific_chart_setting.colors[0]],
                        [props.chartSetting.specific_chart_setting.thresholds[1], props.chartSetting.specific_chart_setting.colors[1]],
                        [props.chartSetting.specific_chart_setting.thresholds[2], props.chartSetting.specific_chart_setting.colors[2]],
                        [props.chartSetting.specific_chart_setting.thresholds[3], props.chartSetting.specific_chart_setting.colors[3]],
                        [props.chartSetting.specific_chart_setting.maxValue, props.chartSetting.specific_chart_setting.colors[4]]
                    ]
                }
            },
        }]
    });
}
onMounted(() => {
    initChart();
    
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => handleResize());
    chart?.dispose();
});

watch(() => props.value, updateChart);
watch(() => props.chartSetting, () => {
    chart?.dispose();
    initChart();
    isActivated = false;
});

</script>
<style scoped>
.chart-container
{
    width:100%;
    min-width: 300px;
    height: 100%;
    min-height: 160px;
}
</style>
