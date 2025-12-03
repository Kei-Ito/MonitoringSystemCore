<template>
    <div ref="el" class="w-full h-full" />
</template>
<script setup lang="ts">
import type { ChannelSeries, ChartConfig } from '@monitoring/shared/model'
import { computed, toRef, watch } from 'vue'

import { useEChart } from '@/components/Charts/useEChart'
import { useMonitoringStore } from '@/pinia/monitoringStore'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: ChannelSeries[]
    loading?: boolean
}>()

/** スコアの条件と色を 1 つの配列要素にまとめる */
interface ColorRule {
    /** 閾値上限（以下）──`undefined` なら「上限なし」 */
    lte?: number
    /** 閾値下限（より大きい）──`undefined` なら「下限なし」 */
    gt?: number
    /** 当てはまったときに塗る色 */
    color: string
}


const datasetSource = computed(() => [
    ['label', 'amount'], // カラム名
    ...props.series.map((s) => [s.channel_name, s.runtimeValue?.value ?? 0]), // データ
]);


const seriesRef = toRef(props, 'series'); // props.seriesをrefに変換
const chartRef = toRef(props, 'chart');

const monitoringStore = useMonitoringStore()

const optionBuilder = () => {
    const colors = chartRef.value.chart_options.colors;
    const thresholds = chartRef.value.chart_options.thresholds;
    const rules: ColorRule[] = [{
        lte: thresholds[0], // 最初の色は最小値以下
        color: colors[0]
    }];
    for (let i = 1; i < colors.length - 1; i++) {
        rules.push({
            lte: thresholds[i],
            gt: thresholds[i-1],
            color: colors[i]
        });
    }
    rules.push({
        gt: thresholds[thresholds.length-1], // 最後の色は最大値より大きい
        color: colors[colors.length-1]
    });
    return {
        dataset: { source: datasetSource.value },
        xAxis: {
            type: 'value',
            min: chartRef.value.chart_options.minValue ?? 0,
            max: chartRef.value.chart_options.maxValue ?? 100,
        },
        yAxis: { type: 'category', inverse: true },
        tooltip: { 
            trigger: 'axis', 
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                if (!Array.isArray(params) || params.length === 0) return ''
                const param = params[0]
                const seriesIndex = param.dataIndex
                const series = props.series[seriesIndex]
                let valueStr = param.value[1]
                if (series) {
                    const channel = monitoringStore.channelMap[series.channel_uuid]
                    if (channel) {
                        valueStr = param.value[1].toFixed(channel.decimals)
                    }
                }
                return `${param.marker} ${param.name}: ${valueStr}`
            }
        },
        grid: {
            top: 30,
            left: 10,
            right: 30,
            bottom: 10,
            containLabel: true
        },
        visualMap: {
            show: false,//表示しない
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            bottom: 0,
            dimension: 1,            // valueの値をもとに色を判定
            pieces: rules,
        },
        series: [{
            type: 'bar',
            encode: {
                x: 'amount',
                y: 'label',
            },
        }],
        animationDurationUpdate: 500,

    }
}
// ----- EChartsをマウント -----
const { el, chart } = useEChart(optionBuilder, [seriesRef, chartRef])

watch([() => props.loading, chart], ([loading, chartInstance]) => {
    if (chartInstance) {
        if (loading) {
            chartInstance.showLoading({
                text: 'Loading...',
                color: '#ffffff',
                textColor: '#ffffff',
                maskColor: 'rgba(0, 0, 0, 0.4)',
                zlevel: 0
            })
        } else {
            chartInstance.hideLoading()
        }
    }
}, { immediate: true })
</script>
