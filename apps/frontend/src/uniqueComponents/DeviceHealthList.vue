<!-- DeviceHealthList.vue -->
<template>
  <div class="device-list">

    <div v-for="device in DeviceHealth" :key="device.name"
      class="text-center d-flex align-items-center justify-content-center">
      <span class="label mx-4 ">{{ device.name }}</span>
      <span class="lamp mx-4" :class="['lamp-' + device.status, getColor(device.status)]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum'
import { useChannelValuesStore } from '@/pinia/channelValuesStore'


const channelValuesStore = useChannelValuesStore()
const { DeviceHealth } = storeToRefs(channelValuesStore)

function getColor(status: DeviceHealthEnum): string {
  switch (status) {
    case DeviceHealthEnum.Good:
      return 'bg-gradient-success'
    case DeviceHealthEnum.Caution:
      return 'bg-gradient-warning'
    case DeviceHealthEnum.Error:
      return 'bg-gradient-danger'
    default:
      // gray
      return 'bg-gradient-secondary'
  }
}
</script>

<style scoped>
/* デバイスを縦並び（リスト状）にしたいなら親は column  */
.device-list {
  display: flex;
  flex-direction: column;
  /* ← 縦リスト */
  gap: 0.3rem;
  /* デバイス同士の間隔 */
}

/* ラベルとランプを “横一列” に並べる */
.row {
  display: inline-flex;
  /* ← 横並びを強制（余計な stretch 防止） */
  align-items: center;
  /* 垂直中央揃え */
  gap: 0.5rem;
  /* ラベルとランプの間 */
}

/* ラベルそのものは必要なら右寄せに */
.label {
  font-size: 1.2rem;
  font-weight: 350;
  color: white;
  text-align: right;
  /* ← 好みで left/right/center に */
  white-space: nowrap;
  /* 折り返さないように */
}

/* ランプはそのまま */
.lamp {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

/* 状態色 */

.lamp-Error {
  position: relative;
  /* 疑似要素の基準 */
}


@keyframes pulseError {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.85;
  }

  70% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

/* 疑似要素で “外周光” を描き、パルスさせる */
.lamp-Error::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(213, 0, 0, 0.65);
  /* 光の色 */
  transform: translate(-50%, -50%) scale(1);
  animation: pulseError 1.4s ease-out infinite;
  pointer-events: none;
  /* クリック透過 */
}
</style>