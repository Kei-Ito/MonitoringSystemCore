<!-- DeviceHealthCard.vue -->
<template>
    <div>
      <!-- タイトル -->
      <h5 class="device-title">{{ title }}</h5>
  
      <!-- 本体カード -->
      <div class="card device-card mb-5" >
        <div class="card-body text-center p-3">
          <!-- ステータス・バッジ -->
          <div :class="['status-pill', statusClass]">
            {{ statusLabel }}
          </div>
  
          <!-- 説明文（改行を活かすため white-space: pre-line） -->
          <p class="status-message mt-3 mb-0">
            {{ statusMessage }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'

  import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum'
  
  const props = defineProps<{
    /** タイトル (例: 照射炉 1) */
    title: string
    /** 装置の状態 */
    deviceHealth: DeviceHealthEnum
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
        default:
        return 'Unknown'
    }
  })
  
  const statusMessage = computed(() => {
    switch (props.deviceHealth) {
      case DeviceHealthEnum.Good:
        return '装置は正常に稼働しています。'
      case DeviceHealthEnum.Caution:
        return '注意が必要な項目があります。\nダッシュボードから注意項目を\n確認してください。'
      case DeviceHealthEnum.Error:
        return 'エラーが発生しています。\nダッシュボードからエラー項目を\n確認してください。'
        default:
        return 'Unknown status'
    }
  })
  
  /* ---------- CSS クラス ---------- */
  const statusClass = computed(() => {
    return {
      "good bg-gradient-success": props.deviceHealth === DeviceHealthEnum.Good,
      "caution bg-gradient-warning": props.deviceHealth === DeviceHealthEnum.Caution,
      "error bg-gradient-danger": props.deviceHealth === DeviceHealthEnum.Error
    }
  })
  </script>
  
  <style scoped>
  /* タイトル */
  .device-title {
    text-align: center;
    font-weight: 700;
    margin-bottom: 6px;
    font-size:x-large;
  }
  
  /* 外枠カード */
  .device-card {
    border-radius: 8px;
    background: #ffffff;
    height: 250px;
  }
  
  /* ステータス・ピル */
  .status-pill {
    /* pill の幅・高さはお好みで調整 */
    width: 90%;
    height: 70px;
    margin: 0 auto;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.7rem;
    font-weight: 400;
    color: #ffffff;
    position: relative;   /* ← 追加（重要） */
    overflow: visible;    /* ← 光がはみ出ても見えるように */
  }
  
  /* 状態ごとの色 */
  
  /* 説明文 */
  .status-message {
    white-space: pre-line;  /* \n をそのまま改行表示 */
    font-size: 1.2rem;
    color: #333333;
    font-weight: 500;
  }

  /* --- ① アニメーション定義 ---------------------------------- */
@keyframes pulseErrorBadge {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.9; }
  70%  { transform: translate(-50%, -50%) scale(1.2); opacity: 0;   }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0;   }
}

/* --- ③ Error 用グロー -------------------------------------- */
.status-pill.error::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 9999px;                  /* pill と同じ丸角 */
  background: rgba(217, 54, 54, 0.55);    /* 元色 #d93636 の半透明 */
  transform: translate(-50%, -50%) scale(1);
  animation: pulseErrorBadge 1.6s ease-out infinite;
  pointer-events: none;                   /* UI 操作を邪魔しない */
}

  </style>
  