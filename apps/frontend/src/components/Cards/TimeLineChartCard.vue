<template>
    <div class="card z-index-2 mb-4" 
        style="transition: margin-top 0.3s ease-in-out;">
        <div class="card-header p-0 position-relative mx-3 z-index-2 bg-transparent mt-2"
            style="transition: margin-top 0.3s ease-in-out;">
            <div class="border-radius-lg bg-gradient-dark shadow-dark">
                <newTrendLineChart :series="props.series" :minThreshold="props.minThreshold" :maxThreshold="props.maxThreshold" :optionOverrides="props.optionOverrides"/>
            </div>
        </div>
        <div class="card-body pt-2 pb-2">
            <div class="row-flex-div">

                <div class="px-2">
                    <h5 class="mb-0 fs-4">{{ props.title }}</h5>
                </div>
                <div class="px-2">
                    <h5 class="mb-0 fs-4">{{ props.unit }}</h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import newTrendLineChart from '@/components/Charts/newTrendChart.vue';
  import * as echarts from 'echarts/core'

export interface Point {
  /** millisecond UNIX time, Date, or an ISO string */
  time: number | string | Date
  /** y-value */
  value: number
}

export interface SeriesInput {
  name: string
  /** ordered array of data points */
  data: Point[]
  /** line colour (falls back to ECharts palette) */
  color?: string,
}


const props = defineProps<{
    unit: string,
    /** data for each line */
  series: SeriesInput[]
  /** lower & upper thresholds (for visualMap + markLine) */
  minThreshold?: number
  maxThreshold?: number
  /** chart title (optional) */
  title: string
  /** allow parent to tweak/extend raw ECharts options */
  optionOverrides?: echarts.EChartsCoreOption
}>();




</script>

<style scoped>
.row-flex-div {
    display: flex;
    justify-content: space-between;
}

.dark-version {
    border: 1px solid #ffffff31;
    box-shadow: 0 0 10px 3px rgba(58, 178, 255, 0.3) !important;
    background-color: #121212 !important;
}
</style>
