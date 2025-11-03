import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch,unref } from 'vue'

export function useEChart(
  optionBuilder: () => echarts.EChartsCoreOption,
  deps: any[],                       // 依存の配列
) {
  const el = ref<HTMLDivElement | null>(null)
  const chart = shallowRef<echarts.ECharts | null>(null)

  let raf = 0
  let ro: ResizeObserver | null = null

  function applyOptions() {
    if (!chart.value) return
    chart.value.setOption(optionBuilder(), false, true)
  }

  function scheduleUpdate() {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      raf = 0
      applyOptions()
    })
  }

  /** コンテナサイズが 0×0 でなければ init */
  async function initWhenReady() {
    await nextTick()
    if (!el.value || chart.value) return
    if (!el.value.clientWidth || !el.value.clientHeight) return
    chart.value = echarts.init(el.value)
    scheduleUpdate();
  }

  watch(
    deps,
    () => {
      if (chart.value) scheduleUpdate()
      else initWhenReady()
    },
    { deep: false, immediate: true },
  )

  /* ---------- mount / unmount ---------- */
  onMounted(() => {
    initWhenReady()

    if (!el.value) return;
    ro = new ResizeObserver(() => {
      if (chart.value) chart.value.resize()
      else initWhenReady()
    })
    ro.observe(el.value!)
  })


  // クリーンアップ
  onBeforeUnmount(() => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    ro?.disconnect();
    ro = null;
    chart.value?.dispose()
    chart.value = null;
  })

  return { el, chart }
}