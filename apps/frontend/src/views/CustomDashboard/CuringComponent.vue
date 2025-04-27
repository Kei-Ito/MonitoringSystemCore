<template>
    <!-- コンテナを用意して、その中でSVGをスケーリングさせる -->
    <div class="svg-container" style="position: relative;margin-bottom:10px">
      <svg class="responsive-svg" viewBox="0 0 400 130" preserveAspectRatio="xMidYMid meet">
        <!--背景の黒い領域-->
        <rect x="0" y="0" width="400" height="130" fill="#262626" rx="10px" ry="10px" />
        <circle cx="170" cy="65" r="40" :style="{fill:UVColor,transition:'1s'}" class="rect-dynamic"/>
        <rect x="30" y="100" width="340" height="11" fill="#8c8c8c" rx="5px" ry="5px"/>
        <rect x="150" y="10" width="45" height="65" fill="url(#metalGradient3)" rx="1px" ry="1px"/>
        <polygon width="185" points="170,111 170,100 195,50  205,50 205,100 205,111" fill="#f5f5f5"/>
        
      </svg>
      <defs>
        <!-- 放射状グラデーションの定義 -->
        <!-- 放射状グラデーション -->
        <radialGradient id="smoothFog" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <!-- 中心は完全に白 -->
          <stop offset="0%" stop-color="white" stop-opacity="0.7" />
          <!-- 中心から少し外れた部分も薄い白 -->
          <stop offset="20%" stop-color="white" stop-opacity="0.6" />
          <!-- 中間は淡い青 -->
          <stop offset="60%" stop-color="#6400ff" stop-opacity="0.3" />
          <!-- 外側に近づくほど透明に -->
          <stop offset="85%" stop-color="#6400ff" stop-opacity="0.1" />
          <!-- 完全に透明 -->
          <stop offset="100%" stop-color="#6400ff" stop-opacity="0" />
        </radialGradient>
        <!-- シルバーっぽい金属表現のグラデーション(小さいきい部分,横向きの縞模様) -->
        <linearGradient id="metalGradient2" x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0e0e0" />
          <stop offset="15%" stop-color="#bfbfbf" />
          <stop offset="30%" stop-color="#e0e0e0" />
          <stop offset="45%" stop-color="#a0a0a0" />
          <stop offset="60%" stop-color="#e0e0e0" />
          <stop offset="75%" stop-color="#bfbfbf" />
          <stop offset="100%" stop-color="#e0e0e0" />
        </linearGradient>
        <!-- シルバーっぽい金属表現のグラデーション(小さいきい部分,縦向きの縞模様) -->
        <linearGradient id="metalGradient3" x1="100%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0e0e0" />
          <stop offset="15%" stop-color="#bfbfbf" />
          <stop offset="30%" stop-color="#e0e0e0" />
          <stop offset="45%" stop-color="#a0a0a0" />
          <stop offset="60%" stop-color="#e0e0e0" />
          <stop offset="75%" stop-color="#bfbfbf" />
          <stop offset="100%" stop-color="#e0e0e0" />
        </linearGradient>
      </defs>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref,watch,onMounted } from "vue";
  import { storeToRefs } from "pinia";
  import { useMonitoringStore } from "@/pinia/monitoringStore";

  const monitoringStore = useMonitoringStore();

  const { isSampling } = storeToRefs(monitoringStore);
  const UVColor = ref("rgba(0,0,0,0)");
  onMounted(()=>{
  if (isSampling.value){
    UVColor.value = "url(#smoothFog)";
  }
});

watch(() => isSampling.value, () => {
  if (isSampling.value) {
    UVColor.value = "url(#smoothFog)";
  }
  else {
    UVColor.value = "rgba(0,0,0,0)";
  }
});
  </script>
  <style scoped>
/* SVGは幅100%でレスポンシブに */
.responsive-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* カードを絶対配置して、SVGの中央付近に重ねる */
.card-overlay {
  position: absolute;
  top: 28%;
  left: 80%;

  /* 真ん中基準に戻す => 実質中央配置 */
  transform: translate(-50%, -50%);

  width: 80%;
  max-width: 300px;
  /* 背景や枠線など、必要に応じて追加 */
}

</style>
  