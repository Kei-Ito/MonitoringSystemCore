<template>
    <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, ref, watch} from 'vue';

import { getDefaultGaugeChartOptions } from './GaugeChartOption';

const props = defineProps({
    value: {
        type: Number,
        default: 40
    }
});

let isActivated = false;

const chartRef = ref(null);
let chart:any = null;

function initChart() {
    if (!chartRef.value) return;

    chart = echarts.init(chartRef.value, null, { renderer: 'svg',useDirtyRect:false });
    chart.setOption(getDefaultGaugeChartOptions());
    window.addEventListener('resize', () => handleResize());
    
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
    chart.setOption({
        series: [{
            animation: true,
            axisLine: {
                lineStyle: {
                    width: 6,
                    color: [
                        [0.2, '#FF6E76'],
                        [0.5, '#ffa500'],
                        [0.8, '#7CFFB2'],
                        [1.0, '#00bfff']
                    ]
                }
            },
        }]
    });
}
onMounted(() => {
    initChart();
    
});
function handleResize() {
    if (chart) {
        chart.resize();
        setTimeout(() => {
            chart.resize();
        }, 150);
    }
}
onBeforeUnmount(() => {
    window.removeEventListener('resize', () => handleResize());
    chart?.dispose();
});

watch(() => props.value, updateChart);

</script>
<style scoped>
.chart-container
{
    width:100%;
    min-width: 300px;
    height: 100%;
    min-height: 200px;
}
</style>
