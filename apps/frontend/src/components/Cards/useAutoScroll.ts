// src/composables/useAutoScroll.ts
import {
    computed,
    nextTick,
    onMounted,
    onBeforeUnmount,
    onActivated,
    onDeactivated,
    type Ref,
    ref,
    watch,
  } from 'vue'
  
  export interface AutoScrollOptions {
    /** px / 秒（既定 30） */
    speed?: number
    /** 端に着いたあと待機する秒数（既定 1） */
    pause?: number
    /** 右端に残す余白 px（既定 6） */
    gap?: number
  }
  
  /**
   * 文字列がはみ出すと自動スクロール → 端で停止 → ループ
   */
  export function useAutoScroll(
    box: Ref<HTMLElement | null>,
    text: Ref<HTMLElement | null>,
    animClass: string,
    opts: AutoScrollOptions = {},
  ) {
    const SPEED = opts.speed ?? 30
    const PAUSE = opts.pause ?? 1
    const GAP = opts.gap ?? 6
  
    const isOverflow = ref(false)
    const dist = ref(0)                               // px
    const duration = computed(() => dist.value / SPEED) // 秒
  
    let resizeObs: ResizeObserver | null = null
    let timerId: ReturnType<typeof setTimeout> | null = null
    let animationEndHandler: (() => void) | null = null

    /* はみ出し量測定（2px 以下は誤差） */
    function measure() {
      if (!box.value || !text.value) return
      const diff = text.value.scrollWidth - box.value.offsetWidth
      const d = diff > GAP + 2 ? diff + GAP : 0
      isOverflow.value = d > 0
      dist.value = d
    }
    
    /**
     * アニメーションをループさせるイベントを設定
     * アニメ完了 ⇒ 1s 停止 ⇒ 初期化 ⇒ ループ
     */
    function attachLoop() {
      if (!text.value) return
      
      // 既存のリスナーがあれば削除
      if (animationEndHandler) {
        text.value.removeEventListener('animationend', animationEndHandler)
      }

      animationEndHandler = () => {
        if (!isOverflow.value) return
        timerId = setTimeout(() => {
          if (text.value===null) return
          text.value!.classList.remove(animClass)
          void text.value!.offsetWidth         // Reflow
          
          // 開始前にも停止時間を設ける
          timerId = setTimeout(() => {
            requestAnimationFrame(() => isOverflow.value && text.value!.classList.add(animClass))
          }, PAUSE * 1000)
          
        }, PAUSE * 1000)
      }

      text.value.addEventListener('animationend', animationEndHandler)
    }

    function cleanup() {
      if (resizeObs) {
        resizeObs.disconnect()
        resizeObs = null
      }
      if (timerId) {
        clearTimeout(timerId)
        timerId = null
      }
      if (text.value && animationEndHandler) {
        text.value.removeEventListener('animationend', animationEndHandler)
        animationEndHandler = null
      }
    }

    function init() {
      cleanup() // 安全のため一度クリーンアップ
      nextTick().then(measure)
  
      /* リサイズ・文字列変更で再測定 */
      resizeObs = new ResizeObserver(measure)
      if (box.value) resizeObs.observe(box.value)
      
      attachLoop()
    }
  
    /* 初期化 */
    onMounted(() => {
      init()
      watch([() => text.value?.textContent], measure)
    })

    onBeforeUnmount(cleanup)
    onDeactivated(cleanup)
    onActivated(init)
  
    return { isOverflow, dist, duration }
  }