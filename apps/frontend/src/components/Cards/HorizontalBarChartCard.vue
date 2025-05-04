<template>
    <div class="card z-index-2 mb-4" 
        style="transition: margin-top 0.3s ease-in-out;">
        <div class="card-header p-0 position-relative mx-3 z-index-2 bg-transparent mt-2"
            style="transition: margin-top 0.3s ease-in-out;">
            <div class="border-radius-lg bg-gradient-dark shadow-dark">
                <EChartHorizontalBarChart  :data="props.data" :rules="props.rules"/>
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

import type { ChartConfig } from '@monitoring/shared/model'
import EChartHorizontalBarChart from '@/components/Charts/EChartsHorizontalBarChart.vue';

interface BarDatum {
    /** 棒の長さに使う値 */
    amount: number
    /** スコア（色判定用） */
    score: number
    /** y 軸に表示するラベル */
    label: string
  }

  /** スコアの条件と色を 1 つの配列要素にまとめる */
interface ColorRule {
  /** 閾値上限（以下）──`undefined` なら「上限なし」 */
  lte?: number
  /** 閾値下限（より大きい）──`undefined` なら「下限なし」 */
  gt?: number
  /** 当てはまったときに塗る色 */
  color: string
}

const props = defineProps<{
    unit: String,
    setting: ChartConfig,
    /** データ配列 */
    data: BarDatum[]
    /** グラフタイトル（任意） */
    title?: string

    rules: ColorRule[]
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
