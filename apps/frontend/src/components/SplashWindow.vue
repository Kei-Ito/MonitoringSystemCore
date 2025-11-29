<template>
  <div 
    class="splashwindow_container" 
    :class="{ finishing: isFinishing, 'error-mode': isError }"
    @transitionend="handleTransitionEnd"
  >
    <div class="content-wrapper" :class="{ 'fade-out': isFinishing }">
      <div class="lamp-assembly">
        <!-- 蛍光管の器具 -->
        <div class="fixture"></div>
        <!-- 蛍光管本体 -->
        <div class="tube"></div>
      </div>
      
      <!-- 文字 -->
      <h1 class="title">
        UV Monitoring System
      </h1>
      
      <!-- ローディングスピナー -->
      <div class="spinner-container" v-if="!isError">
        <loading-spinner />
      </div>
      <!-- エラーメッセージ -->
      <div class="error-message" v-if="isError">
        <p class="error-title">Connection Failed</p>
        <ul class="error-solutions">
          <li>ネットワーク接続を確認してください</li>
          <li>システム本体が起動しているか確認してください</li>
          <li>ページを再読み込みしてください</li>
          <li>上記の手順で解決しない場合、システム管理者にお問い合わせください</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

defineProps<{
  isFinishing?: boolean
  isError?: boolean
}>()

const emit = defineEmits<{
  (e: 'animation-end'): void
}>()

function handleTransitionEnd(event: TransitionEvent) {
  // コンテナの変形が終わったときのみ発火
  if (event.propertyName === 'width' || event.propertyName === 'transform') {
    emit('animation-end')
  }
}
</script>

<style scoped>
.splashwindow_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  /* 固定配置で全画面を覆う */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  
  background-color: #050505; /* ほぼ真っ暗な背景 */
  color: #ffffff;
  overflow: hidden;
  perspective: 1000px;

  /* サイドバーへの変形アニメーション */
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 0 0 rgba(0,0,0,0);
}

/* グラデーションオーバーレイ */
.splashwindow_container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* サイドバーの標準ダークグラデーション (青みなし) */
  background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 0; /* コンテンツの下、背景の上 */
  pointer-events: none;
}

.splashwindow_container.finishing::after {
  opacity: 1;
}

/* 終了時のスタイル（サイドバーの位置・サイズに変形） */
.splashwindow_container.finishing {
  width: 250px; /* サイドバーの幅 */
  height: calc(100vh - 32px); /* 上下マージン分を引く (my-3 = 1rem = 16px * 2) */
  top: 16px;
  left: 16px; /* ms-3 = 1rem = 16px */
  border-radius: 0.75rem; /* border-radius-xl */
  
  /* サイドバーと同じボーダーと影 */
  border: 1px solid rgba(255, 255, 255, 0.192); /* #ffffff31 */
  /* 青みのない影に変更 */
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.5);
  
  /* background-color は ::after で表現 */
  background-color: #191919; 
}

/* 画面幅が狭い場合（1200px未満）の終了時スタイル */
@media (max-width: 1199.98px) {
  .splashwindow_container.finishing {
    /* サイドバーの形状に変形せず、画面左外へスライドアウト */
    width: 100vw;
    height: 100vh;
    top: 0;
    left: -100vw;
    border-radius: 0;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease-out;
  position: relative;
  z-index: 1; /* オーバーレイより上 */
}

.content-wrapper.fade-out {
  opacity: 0;
  pointer-events: none;
}

/* --- ランプ周りの設定 --- */
.lamp-assembly {
  position: absolute;
  top: 15%;
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.fixture {
  width: 100%;
  height: 10px;
  background: #333;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.8);
}

.tube {
  width: 95%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-top: -4px;
  position: relative;
  
  /* 点灯アニメーション */
  animation: turnOn 4s forwards;
}

/* --- タイトル文字の設定 --- */
.title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 900;
  font-size: 5em;
  margin: 0;
  padding: 20px;
  z-index: 5;
  text-align: center;
  
  /* 初期状態（消灯） */
  color: #222; 
  text-shadow: none;
  opacity: 1;

  /* 点灯アニメーション（ライトと同期） */
  animation: textIllumination 4s forwards;
}

.spinner-container {
  margin-top: 40px;
  opacity: 0;
  animation: fadeIn 1s 3.5s forwards; /* ライトが点いた後に表示 */
}

/* --- アニメーション定義 --- */

/* 蛍光管の点灯（フリッカー効果） */
@keyframes turnOn {
  0% {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  6% {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  7% {
    background: #dcbfff; /* 薄い紫 */
    box-shadow: 0 0 10px #a020f0, 0 0 20px #a020f0;
  }
  8% {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  9% {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  10% {
    background: #dcbfff;
    box-shadow: 0 0 15px #a020f0, 0 0 30px #a020f0;
  }
  12% {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  14% {
    background: #dcbfff;
    box-shadow: 0 0 10px #a020f0;
  }
  16% {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  19% {
    background: #e0d0ff; /* 明るい紫白 */
    box-shadow: 
      0 0 20px #a020f0, 
      0 0 40px #a020f0, 
      0 0 80px #7a00cc,
      0 0 100px rgba(122, 0, 204, 0.5); /* 部屋全体への広がり */
  }
  22% {
    background: #dcbfff;
    box-shadow: 0 0 15px #a020f0;
  }
  25% {
    /* 点滅終了、ここからじんわり */
    background: #d0c0ff; 
    box-shadow: 
      0 0 15px #a020f0, 
      0 0 30px #a020f0, 
      0 0 60px #7a00cc,
      0 0 100px rgba(122, 0, 204, 0.2);
  }
  60% {
    /* 中間地点 */
    background: #e0d0ff;
    box-shadow: 
      0 0 18px #a020f0, 
      0 0 35px #a020f0, 
      0 0 70px #7a00cc,
      0 0 120px rgba(122, 0, 204, 0.3);
  }
  100% {
    background: #f0e6ff; /* 完全に点灯 */
    box-shadow: 
      0 0 20px #fff, 
      0 0 40px #a020f0, 
      0 0 80px #a020f0, 
      0 0 120px #7a00cc,
      0 100px 200px rgba(160, 32, 240, 0.4); /* 下方向への照射 */
  }
}

/* 文字が照らされるアニメーション */
@keyframes textIllumination {
  0% {
    color: #222;
    text-shadow: none;
    opacity: 1;
  }
  6% {
    color: #222;
    text-shadow: none;
    opacity: 1;
  }
  7% {
    color: #534060;
    text-shadow: 0 0 5px rgba(160, 32, 240, 0.3);
    opacity: 1;
  }
  8% {
    color: #222;
    text-shadow: none;
    opacity: 1;
  }
  9% {
    color: #222;
    text-shadow: none;
    opacity: 1;
  }
  10% {
    color: #534060;
    text-shadow: 0 0 10px rgba(160, 32, 240, 0.4);
    opacity: 1;
  }
  12% {
    color: #222;
    text-shadow: none;
    opacity: 1;
  }
  14% {
    color: #534060;
    text-shadow: 0 0 5px rgba(160, 32, 240, 0.3);
    opacity: 1;
  }
  16% {
    color: #222;
    text-shadow: none;
    opacity: 1;
  }
  19% {
    color: #fff;
    text-shadow: 0 0 10px #a020f0, 0 0 20px #a020f0;
    opacity: 1;
  }
  22% {
    color: #ccc;
    text-shadow: 0 0 5px #a020f0;
    opacity: 1;
  }
  25% {
    /* 点滅終了 */
    color: #ddd;
    text-shadow: 0 0 8px #a020f0, 0 0 15px #a020f0;
    opacity: 1;
  }
  100% {
    color: #ffffff;
    text-shadow: 
      0 0 10px rgba(160, 32, 240, 0.8),
      0 0 20px rgba(160, 32, 240, 0.4),
      0 10px 30px rgba(0, 0, 0, 0.8); /* 影を落として浮き上がり感を強調 */
    opacity: 1;
  }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* エラーモード時のスタイル */
.error-mode .tube {
  animation: none;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.error-mode .title {
  animation: none;
  color: #222;
  text-shadow: none;
  opacity: 1;
}

.error-message {
  margin-top: 40px;
  color: #ff4444;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  opacity: 0;
  animation: fadeIn 2s ease-in forwards; /* ぼんやりと浮き上がる */
}

.error-title {
  font-size: 1.8em;
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
}

.error-solutions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  color: #ccc;
  text-align: left;
  display: inline-block;
}

.error-solutions li {
  margin-bottom: 0.5rem;
  padding-left: 1.5em;
  position: relative;
}

.error-solutions li::before {
  content: "•";
  color: #ff4444;
  position: absolute;
  left: 0;
  font-weight: bold;
}
</style>
