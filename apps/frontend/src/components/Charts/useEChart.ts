import * as echarts from 'echarts'  
import { nextTick,onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

export function useEChart(
  optionBuilder: () => echarts.EChartsCoreOption,
  deps: any[],                       // 依存の配列
) {
  const el = ref<HTMLDivElement | null>(null)
  const chart = shallowRef<echarts.ECharts | null>(null)

  /** コンテナサイズが 0×0 でなければ init */
  async function initWhenReady() {
    await nextTick()
    if (!el.value || chart.value) return
    if (!el.value.clientWidth || !el.value.clientHeight) return
    chart.value = echarts.init(el.value)
    update()
  }

  /** option の適用 */
  function update() {
    chart.value?.setOption(optionBuilder(), true)
  }

  /* ---------- mount / unmount ---------- */
  onMounted(() => {
    initWhenReady()

    // サイズ変化を監視 → chart.resize()
    const ro = new ResizeObserver(() => {
      if (chart.value) chart.value.resize()
      else initWhenReady()
    })
    ro.observe(el.value!)

    // マウント外で watch を張る
    watch(
      deps,
      () => { if (chart.value) update() },
      { deep: true, immediate: true },
    )

    // クリーンアップ
    onBeforeUnmount(() => {
      ro.disconnect()
      chart.value?.dispose()
    })
  })

  return { el, chart }
}