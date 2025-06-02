<template>
    <div ref="el" class="w-full h-full" />
</template>
<script setup lang="ts">
import { toRef,computed } from 'vue'
import type { ChartConfig, ChannelSeries } from '@monitoring/shared/model'
import { useEChart } from '@/components/Charts/useEChart'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: ChannelSeries[]          // ← ここが追加ポイント
}>()

console.log('HorizontalBarChart', props.chart.chart_uuid, props.series)
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
    { lte: 0.2, color: '#FD665F' },
    { lte: 0.5, gt: 0.2, color: '#FFCE34' },
    { gt: 0.5, color: '#65B581' },
];

const datasetSource = computed(() => [
    ['label', 'amount', 'score'], // カラム名
    ...props.series.map((s) => [s.channel_name, s.value]), // データ
]);


const seriesRef = toRef(props, 'series') // props.seriesをrefに変換

const optionBuilder = () => {
    const s = props.series;
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
            dimension: 0,            // score カラムで判定
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
const { el,chart  } = useEChart(optionBuilder, [seriesRef])
</script>
