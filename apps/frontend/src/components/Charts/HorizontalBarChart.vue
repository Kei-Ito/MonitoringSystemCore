<template>
    <div ref="el" class="w-full h-full" />
</template>
<script setup lang="ts">
import type { ChannelSeries,ChartConfig } from '@monitoring/shared/model'
import { computed,toRef } from 'vue'

import { useEChart } from '@/components/Charts/useEChart'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: ChannelSeries[]          // ← ここが追加ポイント
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

const rules: ColorRule[] = [
    { lte: 20, color: '#FD665F' },
    { lte: 50, gt: 20, color: '#FFCE34' },
    { gt: 50, color: '#65B581' },
];

const datasetSource = computed(() => [
    ['label', 'amount'], // カラム名
    ...props.series.map((s) => [s.channel_name, s.runtimeValue.value]), // データ
]);


const seriesRef = toRef(props, 'series') // props.seriesをrefに変換
const chartRef = toRef(props, 'chart')

const optionBuilder = () => {
    return {
        dataset: { source: datasetSource.value },
        xAxis: {},
        yAxis: { type: 'category' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
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
const { el } = useEChart(optionBuilder, [seriesRef, chartRef])
</script>
