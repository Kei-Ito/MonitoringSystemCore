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
    series: ChannelSeries[]
}>()

const datasetSource = computed(() => {
  const names = props.series.map(s => s.channel_name)

  // 各シリーズの (ms) 時刻→値 マップと全時刻集合を作成
  const timeSet = new Set<number>()
  const maps = props.series.map(s => {
    const m = new Map<number, number>();
    const len = s.timeSeries.length;
    for (let i = 0; i < len; i++) {
      const t = s.timeSeries[i].timestamp
      const ms = typeof t === 'number' ? t : new Date(t as any).getTime()
      m.set(ms, s.timeSeries[i].value)
      timeSet.add(ms)
    }
    return m
  })

  const times = Array.from(timeSet).sort((a,b)=>a-b)
  const header = ['time', ...names]
  const rows = times.map(ms => [ms, ...maps.map(m => (m.get(ms) ?? null))]) // 欠損は null

  return [header, ...rows]
})

const defaultPalette = [
  '#5470c6','#91cc75','#fac858','#ee6666',
  '#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'
]

const seriesRef = toRef(props, 'series')
const chartRef = toRef(props, 'chart')

function formatTime(value: string | number): string {
  const d = new Date(value)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

const optionBuilder = () => {
    
    const thresholds = chartRef.value.chart_options.thresholds;

    // 折れ線（dataset から列名でマッピング）
    const lineSeries = props.series.map((s, idx) => ({
        name: s.channel_name,
        type: 'line',
        symbol: 'none',
        encode: { x: 'time', y: s.channel_name },
        sampling: 'lttb',
        progressive: 2000,
        progressiveThreshold: 3000,
        emphasis: { disabled: true, focus: 'none' }
    }))

    // しきい値で色分け（シリーズごと）
    const visualMaps =
        thresholds.min != null && thresholds.max != null
        ? props.series.map((_, idx) => ({
            show: false,
            type: 'piecewise',
            seriesIndex: idx,  // ← このシリーズだけに適用
            dimension: 'y',      // ← series内の y 次元を指す（x=0, y=1）
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
        dataset: { source: datasetSource.value },
        grid: { top: 40, left: 10, right: 25, containLabel: true },
        legend: { top: 0, icon: 'rect', itemWidth: 32, itemHeight: 3 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'line' } }, // ← 1箇所に統一
        xAxis: { type: 'time', boundaryGap: false, axisLabel: { formatter: formatTime } },
        yAxis: { type: 'value' },
        dataZoom: [{ type: 'inside', start: 0, end: 100 }, { start: 0, end: 100 }],
        visualMap: visualMaps,                                    // ← 配列で渡す
        series: [...lineSeries, ...(thresholdLineSeries ? [thresholdLineSeries] : [])] // ← 上書きしない
    }
}
// ----- EChartsをマウント -----
const { el } = useEChart(optionBuilder, [seriesRef, chartRef])
</script>
