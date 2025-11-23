<template>
    <div ref="el" class="w-full h-full" style="height: 100%;width: 100%" />
</template>
<script setup lang="ts">
import type { ChartConfig } from '@monitoring/shared/model'
import { toRef, watch } from 'vue'

import { useEChart } from '@/components/Charts/useEChart'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: any[]          // ← ここが追加ポイント
    loading?: boolean
}>()

const seriesRef = toRef(props, 'series') // props.seriesをrefに変換
const chartRef = toRef(props, 'chart')

// ------ 表示設定 -----
const optionBuilder = () => {

    const s = seriesRef.value[0].runtimeValue ?? { value: 0, channel_name: '' }
    /** ゲージの色設定 */
    const thresholds = chartRef.value.chart_options.thresholds;
    const colors = chartRef.value.chart_options.colors.map(
        (color: string, index: number) => {
            return [
                thresholds[index]??1.0,
                color
            ]
        }
    )

    return {
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: false
        },
        series: [{
            type: 'gauge',
            radius: '100%',
            center: ['50%', '56%'],
            max: props.chart.chart_options?.maxValue ?? 100,
            min: props.chart.chart_options?.minValue ?? 0,
            data: [{ value: s.value ?? 0 }],
            splitNumber: 8,
            axisLine: {
                lineStyle: {
                    color: colors
                }
            },
            pointer: {
                offsetCenter: [0, 0],
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto',
                    width: 5
                }
            },
            axisLabel: {
                show: false
            },
            detail: {
                show: true,
                valueAnimation: true,
                formatter: (value: number) => value.toFixed(2),
                color: 'inherit'
            },
        }],

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
