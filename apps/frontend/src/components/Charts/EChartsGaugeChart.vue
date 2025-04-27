<template>
    <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import * as echarts from 'echarts';
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { getDefaultGaugeChartOptions } from '@/components/Charts/GaugeChartOption';
import type { IOModule, ChartSetting } from '@monitoring/shared/model';

const monitoringStore = useMonitoringStore();
const { ioModules } = storeToRefs(monitoringStore);

const props = defineProps({
    chartSetting: {
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
    return ioModules.value.find((module) => module.module_uuid === module_uuid)?.input_channels.find((channel) => channel.channel_id === channel_id);
});


const chartRef = ref(null);
let chart: echarts.ECharts | null = null;
let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
let observer: ResizeObserver | null = null;


function initChart() {
    if (!chartRef.value) return;

    chart?.dispose();
    chart = echarts.init(chartRef.value, null, { renderer: 'svg', useDirtyRect: false });
    chart.setOption(getDefaultGaugeChartOptions(props.chartSetting));
    if (props.chartSetting.specific_chart_setting.lastValue !== null && props.chartSetting.specific_chart_setting.lastValue !== undefined &&
        !Number.isNaN(props.chartSetting.specific_chart_setting.lastValue)) {
        updateChart(props.chartSetting.specific_chart_setting.lastValue);
        isActivated = true;
    }

    observer?.disconnect();
    observer = new ResizeObserver(() => {
        if (resizeTimeout !== undefined) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => chart?.resize(), 50);
    });
    observer.observe(chartRef.value);
}

function updateChart(newValue: number) {
    if (!chart) return;
    if (!isActivated) {
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
    observer?.disconnect();
    chart?.dispose();
    if (resizeTimeout !== undefined) clearTimeout(resizeTimeout);
});


watch(() => props.value, updateChart);
watch(() => props.chartSetting, () => {
    chart?.dispose();
    initChart();
    isActivated = false;
});

</script>
<style scoped>
.chart-container {
    width: 100%;
    min-width: 300px;
    height: 100%;
    min-height: 160px;
}
</style>
