<template>
    <div ref="el" class="w-100 h-100" />
</template>
<script setup lang="ts">
import type { ChannelSeries, ChartConfig } from '@monitoring/shared/model'
import { computed, toRef, watch } from 'vue'

import { useEChart } from '@/components/Charts/useEChart'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: ChannelSeries[]
    loading?: boolean
}>()

const seriesData = computed(() =>
  props.series.map((s) => {
    const data = s.timeSeries ?? [];
    if (!data.length) return [];
    return [...data]
      .map((point) => {
        const t = point.timestamp;
        const ms = typeof t === 'number' ? t : new Date(t as any).getTime();
        return [ms, point.value] as [number, number];
      })
      .sort((a, b) => a[0] - b[0]);
  }),
);

const defaultPalette = [
  '#5470c6','#91cc75','#fac858','#ee6666',
  '#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'
]

const seriesRef = toRef(props, 'series')
const chartRef = toRef(props, 'chart')


const optionBuilder = () => {
    const thresholds = chartRef.value.chart_options.thresholds;
    const minY = chartRef.value.chart_options.visibility?.minY;
    const maxY = chartRef.value.chart_options.visibility?.maxY;

    // データ範囲の計算
    let minTime = Infinity;
    let maxTime = -Infinity;
    let hasData = false;

    seriesData.value.forEach(series => {
        series.forEach(point => {
            const t = point[0];
            if (t < minTime) minTime = t;
            if (t > maxTime) maxTime = t;
            hasData = true;
        });
    });

    const isLongSpan = hasData && (maxTime - minTime) >= 24 * 60 * 60 * 1000;

    const dateFormatter = (value: number) => {
        const d = new Date(value);
        if (isLongSpan) {
             return `${d.getMonth() + 1}/${d.getDate()}`;
        }
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    // 棒グラフ
    const barSeries = props.series.map((s, idx) => ({
        name: s.channel_name,
        type: 'bar',
        emphasis: { disabled: true, focus: 'none' },
        data: seriesData.value[idx] ?? [],
        barMaxWidth: 50,
    }))

    // しきい値で色分け（シリーズごと）
    const visualMaps =
        thresholds.min != null && thresholds.max != null
        ? props.series.map((_, idx) => ({
            show: false,
            type: 'piecewise',
            seriesIndex: idx,  // ← このシリーズだけに適用
            dimension: 1,      // ← series内の y 次元を指す（x=0, y=1）
            pieces: [
                { lte: thresholds.min, color: thresholds.color },
                { gt: thresholds.min, lte: thresholds.max,
                color: defaultPalette[idx % defaultPalette.length] },
                { gt: thresholds.max, color: thresholds.color }
            ]
            }))
        : []

    // 上下限の markLine（ダミー series に付与）
    const thresholdLineSeries =
        thresholds.min != null && thresholds.max != null
        ? {
            type: 'line',
            data: [],
            symbol: 'none',
            silent: true,
            markLine: {
                symbol: ['none','arrow'],
                symbolSize: 10,
                label: { show: false },
                lineStyle: { type: 'dashed', width: 1, color: '#FD0100' },
                data: [{ yAxis: thresholds.min }, { yAxis: thresholds.max }]
            }
            }
        : null


     return {
        animation: false,
        grid: { top: 40, left: 10, right: 25, containLabel: true },
        legend: { top: 0, icon: 'rect', itemWidth: 32, itemHeight: 3 ,textStyle: { color: 'white' }},
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'time', boundaryGap: ['10%', '10%'], axisLabel: { formatter: dateFormatter }},
        yAxis: { type: 'value' ,min:minY??undefined,max:maxY??undefined},
        dataZoom: [{ type: 'inside', start: 0, end: 100 }, { start: 0, end: 100 }],
        visualMap: visualMaps,                                    // ← 配列で渡す
        series: [...barSeries, ...(thresholdLineSeries ? [thresholdLineSeries] : [])] // ← 上書きしない
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
