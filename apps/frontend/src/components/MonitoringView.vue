<template>
  <div class="mx-3 mt-2 mb-3 Monitoring" :class="[
    `bg-gradient-${color}`,
    isSampling ? 'Monitoring-Running' : 'Monitoring-Ready'
  ]">
    <!-- タイトル部分 -->
    <div class="monitoring-title-container" :class="isSampling ? 'monitoring-title-container-Running' : ''">
      <!-- アイコンの表示：ONなら play_circle / OFFなら pause_presentation -->
      <i class="material-icons icon-timer me-2">
        {{ isSampling ? 'play_circle' : 'pause_presentation' }}
      </i>
      <h5 class="title-text">Monitoring</h5>
    </div>

    <!-- コンテンツ部分：トグル＆ステータス -->
    <div class="monitoring-content">
      <toggleBtn v-model="isSampling" @toggle-changed="onToggleChanged" class="mr-3" />

      <!-- Running 状態のときは1文字ずつ弾むアニメーション、Ready のときは通常表示 -->
      <template v-if="status === 'Running'">
        <div class="monitoring-status">
          <p v-for="(char, i) in runningLetters" :key="i" class="bounce-char font-weight-bold" :style="{
            // i文字目の開始ディレイ
            animationDelay: `${i * letterInterval}s`,
            // アニメーション全体の時間を設定
            animationDuration: `${waveDuration}s`,
            color: `#e7df32`
          }" style="font-size:24px">
            {{ char }}
          </p>
        </div>

      </template>
      <template v-else>
        <div class="monitoring-status">
          <p class=" font-weight-bold" style="font-size:24px">{{ status }}</p>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/pinia/uiStore';
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { startSampling,stopSampling } from '@/service/monitoringService';
import toggleBtn from "./ToggleBtn.vue";

const uiStore = useUiStore();
const monitoringStore = useMonitoringStore();

const { isSampling } = storeToRefs(monitoringStore); 
const { color } = storeToRefs(uiStore);

// ステータス文言
const status: Ref<string> = ref("Ready");

// "Running" の文字を配列化して1文字ずつ扱う
const runningLetters = [..."Running"];

// ◆ ここでアニメーション間隔を自由にカスタム ◆
// 1) 各文字の開始タイミングの間隔 (秒)
const letterInterval = 0.2;
// 2) 全体アニメーション(1文字あたりのアニメーション時間) 
//    → waveDuration を長くすると1文字がゆっくりバウンド、短いと速い
const waveDuration = 20;

// トグル変化時のハンドラ
function onToggleChanged(payload: { value: boolean; origin: 'user' | 'external' }) {
  // ユーザー操作で切り替えた場合のみ API 呼び出し
  if (payload.origin === 'user') {
    isSampling.value = payload.value;
    if (payload.value) {
      startSampling();
    } else {
      stopSampling();
    }
  }
  // ステータス文言更新
  status.value = payload.value ? "Running" : "Ready";
}

// 初期化
onMounted(() => {
  status.value = isSampling.value ? "Running" : "Ready";
});
</script>

<style scoped lang="scss">
.Monitoring {
  border-radius: 10px;
  padding: 0;
  transition: all 0.3s; // 切り替え時のアニメーション

  .monitoring-title-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-bottom: 0.5rem;
    padding: 10px 10px 5px;
    font-size: 1.2rem;
    font-weight: bold;
    background: #444c55;
    border-radius: 10px 10px 5px 5px; // 角丸上だけ

    &-Running {
      background: linear-gradient(87deg,
          rgba(45, 62, 206, 0.8) 0%,
          rgba(45, 129, 206, 0.8) 100%) !important;
    }
  }

  .icon-timer {
    font-size: 30px;
  }

  .title-text {
    color: #fff;
    margin: 4px 0 3px 0;
  }

  .monitoring-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;

    .mr-3 {
      margin-right: 22px;
    }
  }

  .monitoring-status {
    width: 100px;
    color: #fff;
    font-size: 1.2rem;
  }
}

/* モニタリング中 */
.Monitoring-Running {
  background: linear-gradient(87deg,
      rgba(45, 62, 206, 0.5) 0%,
      rgba(45, 129, 206, 0.5) 100%) !important;
  border: 2px solid rgba(195, 189, 70, 0.5);
  box-shadow: 0 0 8px 3px rgba(255, 255, 0, 0.4) !important; // グロー感
  transition: all 0.3s;
}

/* 待機中 */
.Monitoring-Ready {
  background: rgba(68, 76, 85, 0.6) !important;
  border: 2px solid rgba(93, 102, 111, 0.5);
  box-shadow: 0 0 3px 2px rgba(58, 58, 58, 0.6) !important;
  transition: all 0.3s;
}

/* 1文字ずつ弾むためのクラス */
.bounce-char {
  display: inline-block;
  /* 
      アニメーション:
        - bounce (下記定義) を waveDuration 秒で再生
        - ease-in-out またはお好みで
        - infinite で繰り返し
    */
  animation: bounce var(--waveDuration, 5s) ease-in-out infinite;
}

/* キーフレームアニメーション: 弾むような動き */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }

  2% {
    transform: translateY(-8px);
  }

  4% {
    transform: translateY(0);
  }

  20% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
