<template>
    <div ref="el" class="w-full h-full" style="height: 100%;width: 100%" />
</template>
<script setup lang="ts">
import { toRef } from 'vue'
import type { ChartConfig } from '@monitoring/shared/model'
import { useEChart } from '@/components/Charts/useEChart'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: any[]          // ← ここが追加ポイント
}>()

const seriesRef = toRef(props, 'series') // props.seriesをrefに変換

const optionBuilder = () => {

    const s = props.series[0] ?? { value: 0, channel_name: '' }

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
            max: props.chart.chart_options?.max ?? 100,
            data: [{ value: s.value ?? 0 }],
            splitNumber: 8,
            axisLine: {
                lineStyle: {
                    color: [
                        [0.25, '#FF6E76'],
                        [0.5, '#FDDD60'],
                        [0.75, '#58D9F9'],
                        [1, '#7CFFB2']
                    ]
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
const { el } = useEChart(optionBuilder, [seriesRef])
</script>
