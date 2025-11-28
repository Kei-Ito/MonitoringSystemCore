<template>
    <div ref="el" class="w-full h-full" />
</template>
<script setup lang="ts">
import type { ChannelSeries,ChartConfig } from '@monitoring/shared/model'
import { computed,toRef, watch } from 'vue'

import { useEChart } from '@/components/Charts/useEChart'

// ----- props -----
const props = defineProps<{
    chart: ChartConfig
    series: ChannelSeries[]
    loading?: boolean
}>()

const seriesData = computed(() =>
  props.series.map((s) => {
    // dataVersion にアクセスしてリアクティブな依存関係を作成する
    // timeSeriesはmarkRawで非リアクティブ化されているため、
    // このアクセスがないと配列の中身が変わっても再計算が走らない
    const _version = (s as any).dataVersion;
    void _version;

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

const chartRef = toRef(props, 'chart')
let isDataZoomInitialized = false


function formatTime(value: string | number): string {
  const d = new Date(value)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

const optionBuilder = () => {
    const thresholds = chartRef.value.chart_options.thresholds;
    const minY = chartRef.value.chart_options.visibility?.minY;
    const maxY = chartRef.value.chart_options.visibility?.maxY;
    const seriesColors = chartRef.value.chart_options.seriesColors ?? {};
    const seriesLineWidths = chartRef.value.chart_options.seriesLineWidths ?? {};

    // 折れ線（dataset から列名でマッピング）
    const lineSeries = props.series.map((s, idx) => {
        const color = seriesColors[s.channel_uuid] ?? defaultPalette[idx % defaultPalette.length];
        const width = seriesLineWidths[s.channel_uuid] ?? 2;

        return {
            name: s.channel_name,
            type: 'line',
            showSymbol: false,
            sampling: 'lttb',
            emphasis: { disabled: true, focus: 'none' },
            data: seriesData.value[idx] ?? [],
            lineStyle: {
                width: width,
                // 閾値設定がない場合はここで色を指定
                ...(thresholds.min == null || thresholds.max == null ? { color } : {})
            },
            itemStyle: {
                // 閾値設定がない場合はここで色を指定
                ...(thresholds.min == null || thresholds.max == null ? { color } : {})
            }
        }
    })

    // しきい値で色分け（シリーズごと）
    const visualMaps =
        thresholds.min != null && thresholds.max != null
        ? props.series.map((s, idx) => {
            const color = seriesColors[s.channel_uuid] ?? defaultPalette[idx % defaultPalette.length];
            return {
                show: false,
                type: 'piecewise',
                seriesIndex: idx,  // ← このシリーズだけに適用
                dimension: 1,      // ← series内の y 次元を指す（x=0, y=1）
                pieces: [
                    { lte: thresholds.min, color: thresholds.color },
                    { gt: thresholds.min, lte: thresholds.max, color: color },
                    { gt: thresholds.max, color: thresholds.color }
                ]
            }
        })
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


     const option: any = {
        animation: false,
        grid: { top: 40, left: 10, right: 25, containLabel: true },
        legend: { top: 0, icon: 'rect', itemWidth: 32, itemHeight: 3 ,textStyle: { color: 'white' }},
        tooltip: { trigger: 'axis', axisPointer: { type: 'line' } }, // ← 1箇所に統一
        xAxis: { type: 'time', boundaryGap: ['0%', '0%'], axisLabel: { formatter: formatTime }},
        yAxis: { type: 'value' ,min:minY??undefined,max:maxY??undefined},
        visualMap: visualMaps,                                    // ← 配列で渡す
        series: [...lineSeries, ...(thresholdLineSeries ? [thresholdLineSeries] : [])] // ← 上書きしない
    }

    if (!isDataZoomInitialized) {
        option.dataZoom = [{ type: 'inside', start: 0, end: 100 }, { start: 0, end: 100 }]
        isDataZoomInitialized = true
    }

    return option
}
// ----- EChartsをマウント -----
// seriesRef (props.series) の代わりに seriesData (computed) を監視対象にする
// seriesData は timeSeries の変更(push)を検知して新しい配列を返すため、watch が発火する
const { el, chart } = useEChart(optionBuilder, [seriesData, chartRef])

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
