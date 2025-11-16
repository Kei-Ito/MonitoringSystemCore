<!-- DeviceHealthCard.vue -->
<template>
  <div>
    <!-- 本体カード -->
    <div class="card device-card mb-2">
      <!-- タイトル -->
    <h5 class="device-title">{{ title }}</h5>
      <div class="card-body p-2 text-center">
        <!-- ステータス・バッジ -->
        <div :class="['status-pill', statusClass]">
          {{ statusLabel }}
        </div>

        <!-- 説明文（改行を活かすため white-space: pre-line） -->
        <p class="status-message mt-3 mb-0">
          {{ statusMessage }}
        </p>
        <div class="lighting-grid">
          <LightingTimeComponent v-for="n in 4" :key="n" :title="`${lightTimeTitlePrefix}-${n}`" :value="6000" :status="deviceHealth" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum'
import LightingTimeComponent from './LightingTimeComponent.vue';

const props = defineProps<{
  /** タイトル (例: 照射炉 1) */
  title: string
  /** 装置の状態 */
  deviceHealth: number
}>()

/* ---------- 表示テキスト ---------- */
const statusLabel = computed(() => {
  switch (props.deviceHealth) {
    case DeviceHealthEnum.Good:
      return 'Good'
    case DeviceHealthEnum.Caution:
      return 'Caution'
    case DeviceHealthEnum.Error:
      return 'Error'
    case DeviceHealthEnum.Stop:
      return 'Stop'
    case DeviceHealthEnum.WarmingUp:
      return 'WarmingUp'
    case DeviceHealthEnum.CoolingDown:
      return 'CoolingDown'
    default:
      return 'Unknown'
  }
})

const statusMessage = computed(() => {
  switch (props.deviceHealth) {
    case DeviceHealthEnum.Good:
      return '装置は正常に稼働しています。'
    case DeviceHealthEnum.Caution:
      return '確認が必要な項目があります。\nダッシュボードから\n状態を確認してください。'
    case DeviceHealthEnum.Error:
      return 'エラーが発生しています。\nダッシュボードから\nエラー項目を\n確認してください。'
    case DeviceHealthEnum.Stop:
      return '装置は消灯中です。'
    case DeviceHealthEnum.WarmingUp:
      return '装置は安定待ちです。'
    case DeviceHealthEnum.CoolingDown:
      return '装置は冷却中です。'
    default:
      return '装置のモニタリングを停止しています。'
  }
})

/* ---------- CSS クラス ---------- */
const statusClass = computed(() => {
  return {
    "good bg-gradient-success": props.deviceHealth === DeviceHealthEnum.Good,
    "caution bg-warning": props.deviceHealth === DeviceHealthEnum.Caution,
    "error bg-gradient-danger": props.deviceHealth === DeviceHealthEnum.Error,
    "stop bg-gradient-secondary": props.deviceHealth === DeviceHealthEnum.Stop,
    "warming-up bg-success-strong": props.deviceHealth === DeviceHealthEnum.WarmingUp,
    "cooling-down bg-gradient-info": props.deviceHealth === DeviceHealthEnum.CoolingDown,
    "unknown bg-gradient-secondary": props.deviceHealth === DeviceHealthEnum.Unknown
  }
})

const lightTimeTitlePrefix = computed(() => {
  if (props.title === "照射炉1") {
    return "UV1"
  }
  if (props.title === "照射炉2") {
    return "UV2"
  }
  if (props.title === "照射炉3") {
    return "UV3"
  }
  return "UV"
});
</script>

<style scoped>
/* タイトル */
.device-title {
  text-align: center;
  font-weight: 700;
  margin-top: 6px;
  font-size: 2rem;
}

/* 外枠カード */
.device-card {
  border-radius: 8px;
  background: #ffffff;
}

/* ステータス・ピル */
.status-pill {
  /* pill の幅・高さはお好みで調整 */
  width: 100%;
  height: 70px;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 400;
  color: #ffffff;
  position: relative;
  /* ← 追加（重要） */
  overflow: visible;
  /* ← 光がはみ出ても見えるように */
}

/* 状態ごとの色 */

/* 説明文 */
.status-message {
  white-space: pre-line;
  /* \n をそのまま改行表示 */
  font-size: 1.2rem;
  color: #333333;
  font-weight: 500;
  height: 150px;
}

/* --- ① アニメーション定義 ---------------------------------- */
@keyframes pulseErrorBadge {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }

  70% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* --- ③ Error 用グロー -------------------------------------- */
.status-pill.error::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  /* pill と同じ丸角 */
  background: rgba(217, 54, 54, 0.55);
  /* 元色 #d93636 の半透明 */
  transform: translate(-50%, -50%) scale(1);
  animation: pulseErrorBadge 1.6s ease-out infinite;
  pointer-events: none;
  /* UI 操作を邪魔しない */
}

.bg-success-strong {
  background-color: #c08300 !important;
  /* Bootstrapの濃い系トーン */
  color: #fff !important;
}

.bg-warning {
  background-color: #db6027 !important;
  /* Bootstrapの濃い系トーン */
  color: #fff !important;
}

.lighting-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.3rem;
}
</style>