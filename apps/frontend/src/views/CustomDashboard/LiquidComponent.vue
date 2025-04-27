<template>
  <!-- コンテナを用意して、その中でSVGをスケーリングさせる -->
  <div class="svg-container" style="margin-left:-40px;margin-right:-50px; position: relative;margin-bottom:10px">
    <svg class="responsive-svg" viewBox="0 0 350 420" preserveAspectRatio="xMidYMid meet">

      <defs>
        <linearGradient id="gradientFill-Down" gradientTransform="translate(0,-300)" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <!-- グラデーションの色はお好みで。ここでは3色の例 -->
          <stop offset="0%" stop-color="#5aabe2" />
          <stop offset="25%" stop-color="#9fd2f4" />
          <stop offset="50%" stop-color="#aff3fe" />
          <stop offset="75%" stop-color="#9fd2f4" />
          <stop offset="100%" stop-color="#5aabe2" />

          <!-- グラデーションを y方向にアニメーションで移動させる -->
          <animateTransform attributeName="gradientTransform" type="translate" from="0,-300" to="0,400" dur="3s"
          begin="1.66s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="gradientFill-Right" x1="0" y1="0" x2="300" y2="0" gradientTransform="translate(-300,0)" gradientUnits="userSpaceOnUse">
          <!-- グラデーションの色はお好みで。ここでは3色の例 -->
          <stop offset="0%" stop-color="#5aabe2" />
          <stop offset="25%" stop-color="#9fd2f4" />
          <stop offset="50%" stop-color="#aff3fe" />
          <stop offset="75%" stop-color="#9fd2f4" />
          <stop offset="100%" stop-color="#5aabe2" />

          <!-- グラデーションを y方向にアニメーションで移動させる -->
          <animateTransform attributeName="gradientTransform" type="translate" from="-300,0" to="400,0"  dur="3s"
            begin="0.7s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="gradientFill-Up" x1="0" y1="300" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="translate(0,400)">
          <!-- グラデーションの色はお好みで。ここでは3色の例 -->
          <stop offset="0%" stop-color="#5aabe2" />
          <stop offset="25%" stop-color="#9fd2f4" />
          <stop offset="50%" stop-color="#aff3fe" />
          <stop offset="75%" stop-color="#9fd2f4" />
          <stop offset="100%" stop-color="#5aabe2" />

          <!-- グラデーションを y方向にアニメーションで移動させる -->
          <animateTransform attributeName="gradientTransform" type="translate" from="0,400" to="0,-300" dur="3s"
            begin="0s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="gradientFill-Left" x1="300" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="translate(400,0)">
          <!-- グラデーションの色はお好みで。ここでは3色の例 -->
          <stop offset="0%" stop-color="#5aabe2" />
          <stop offset="25%" stop-color="#9fd2f4" />
          <stop offset="50%" stop-color="#aff3fe" />
          <stop offset="75%" stop-color="#9fd2f4" />
          <stop offset="100%" stop-color="#5aabe2" />

          <!-- グラデーションを y方向にアニメーションで移動させる -->
          <animateTransform attributeName="gradientTransform" type="translate" from="400,0" to="-300,0" dur="3s"
            begin="2.72s" repeatCount="indefinite" />
        </linearGradient>

        <!-- シルバーっぽい金属表現のグラデーション(殺菌装置の一番大きい部分) -->
        <linearGradient id="metalGradient" x1="45" y1="100%" x2="135" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#e0e0e0" />
          <stop offset="15%" stop-color="#bfbfbf" />
          <stop offset="30%" stop-color="#e0e0e0" />
          <stop offset="45%" stop-color="#a0a0a0" />
          <stop offset="60%" stop-color="#e0e0e0" />
          <stop offset="75%" stop-color="#bfbfbf" />
          <stop offset="100%" stop-color="#e0e0e0" />
        </linearGradient>
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
        <!-- シルバーっぽい金属表現のグラデーション(小さいきい部分,縦向きの縞模様) -->
        <linearGradient id="metalGradient4" x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#828282" />
          <stop offset="15%" stop-color="#bfbfbf" />
          <stop offset="30%" stop-color="#e0e0e0" />
          <stop offset="45%" stop-color="#a0a0a0" />
          <stop offset="60%" stop-color="#e0e0e0" />
          <stop offset="75%" stop-color="#bfbfbf" />
          <stop offset="100%" stop-color="#828282" />
        </linearGradient>

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
      </defs>


      <!--背景の鉄板-->
      <rect x="30" y="0" width="275" height="420" fill="#262626" rx="10px" ry="10px" />

      <!--上部に設置された鉄板との接合金具(長方形)-->
      <rect x="70" y="20" width="105" height="40" fill="url(#metalGradient2)" stroke="#979382" stroke-width="1" />
      <!--上部に設置された鉄板との接合金具(円形)-->
      <circle cx="90" cy="40" r="17" fill="url(#metalGradient2)" stroke="#979382" stroke-width="1" />
      <!--左下部に設置された鉄板との接合金具-->
      <circle cx="90" cy="380" r="17" fill="url(#metalGradient2)" stroke="#979382" stroke-width="1" />
      <!--右下部に設置された鉄板との接合金具-->
      <circle cx="155" cy="380" r="17" fill="url(#metalGradient2)" stroke="#979382" stroke-width="1" />

      <!-- ▼パイプ本体（枠線なし） -->
      <!-- 下の横パイプ -->
      <rect x="152" y="368" width="140" height="24" fill="#969696" rx="7px" ry="7px" />
      <!-- 右の縦パイプ -->
      <rect x="268" y="28" width="24" height="364" fill="#969696" rx="7px" ry="7px" />
      <!-- 上の横パイプ -->
      <rect x="138" y="28" width="154" height="24" fill="#969696" rx="7px" ry="7px" />
      <!-- 左の縦パイプ -->
      <rect x="78" y="38" width="24" height="350" fill="#969696" rx="7px" ry="7px" />

      <!-- 下の横パイプ -->
      <rect x="154" y="370" width="136" height="20" :fill="LeftColor" rx="7px" ry="7px" />
      <!-- 右の縦パイプ -->
      <rect x="270" y="30" width="20" height="360" :fill="DownColor" rx="7px" ry="7px" />
      <!-- 上の横パイプ -->
      <rect x="140" y="30" width="150" height="20" :fill="RightColor" rx="7px" ry="7px" />
      <!-- 左の縦パイプ -->
      <rect x="80" y="30" width="20" height="356" :fill="UpColor" rx="7px" ry="7px" />
      <!-- 流水殺菌装置（ガラス部下） -->
      <rect x="72" y="120" width="36" height="200" :fill="UpColor" stroke="#969696" stroke-width="1" />
      <circle cx="93" cy="115" r="60" :style="{fill:UVColor,transition:'1s'}" class="rect-dynamic"/>
      <!-- 流水殺菌装置（ガラス部上） -->
      <rect x="45" y="90" width="90" height="20" fill="#dcf5fa" opacity="0.6" rx="2px" />


      <!-- 殺菌装置とパイプの接続部のゴム -->
      <polygon points="77,321 79,344 101,344 103,321" fill="#f5f5f5" stroke="#979382" stroke-width="1" opacity="0.9" />

      <rect x="57" y="129" width="7" height="190" fill="url(#metalGradient)" />

      <rect x="85" y="129" width="7" height="190" fill="url(#metalGradient)" />

      <rect x="116" y="129" width="7" height="190" fill="url(#metalGradient)" />

      <rect x="57" y="180" width="66" height="10" fill="url(#metalGradient)" />

      <rect x="57" y="275" width="66" height="10" fill="url(#metalGradient)" />

      <rect x="57" y="310" width="66" height="10" fill="url(#metalGradient)" />

      <rect x="130" y="28" width="20" height="24" fill="url(#metalGradient3)" stroke="#878787" stroke-width="1" rx="2px"
        ry="7px" />
      <rect x="149" y="28" width="20" height="24" fill="url(#metalGradient3)" stroke="#878787" stroke-width="1" rx="2px"
        ry="7px" />
      <rect x="78" y="30" width="24" height="20" fill="url(#metalGradient)" stroke="#878787" stroke-width="1" rx="2px"
        ry="7px" />
      <rect x="78" y="368" width="24" height="20" fill="url(#metalGradient)" stroke="#878787" stroke-width="1" rx="2px"
        ry="7px" />
      <rect x="148" y="368" width="20" height="24" fill="url(#metalGradient3)" stroke="#878787" stroke-width="1"
        rx="2px" ry="7px" />
      <rect x="166" y="368" width="20" height="24" fill="url(#metalGradient3)" stroke="#878787" stroke-width="1"
        rx="2px" ry="7px" />
      <!-- ▼円筒状の流水殺菌装置（ -->
      <rect x="45" y="110" width="90" height="20" fill="url(#metalGradient4)" stroke="#878787" stroke-width="1" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, watch ,onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useMonitoringStore } from "@/pinia/monitoringStore";

const monitoringStore = useMonitoringStore();
const { isSampling } = storeToRefs(monitoringStore);

const DownColor = ref("#5aabe2");
const UpColor = ref("#5aabe2");
const LeftColor = ref("#5aabe2");
const RightColor = ref("#5aabe2");

const UVColor = ref("rgba(0,0,0,0)");

onMounted(()=>{
  if (isSampling.value){
    DownColor.value = "url(#gradientFill-Down)";
    UpColor.value = "url(#gradientFill-Up)";
    LeftColor.value = "url(#gradientFill-Left)";
    RightColor.value = "url(#gradientFill-Right)";
    UVColor.value = "url(#smoothFog)";
  }
});

watch(() => isSampling.value, () => {
  if (isSampling.value) {
    DownColor.value = "url(#gradientFill-Down)";
    UpColor.value = "url(#gradientFill-Up)";
    LeftColor.value = "url(#gradientFill-Left)";
    RightColor.value = "url(#gradientFill-Right)";
    UVColor.value = "url(#smoothFog)";
  }
  else {
    DownColor.value = "#5aabe2";
    UpColor.value = "#5aabe2";
    LeftColor.value = "#5aabe2";
    RightColor.value = "#5aabe2";
    UVColor.value = "rgba(0,0,0,0)";
  }
});

</script>

<style scoped>
.svg-container {
  transition: 0.3s;
}

/* SVGは幅100%でレスポンシブに */
.responsive-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* カードを絶対配置して、SVGの中央付近に重ねる */
.card-overlay {
  position: absolute;
  top: 53%;
  left: 56%;

  /* 真ん中基準に戻す => 実質中央配置 */
  transform: translate(-50%, -50%);

  width: 80%;
  max-width: 300px;
  /* 背景や枠線など、必要に応じて追加 */
}


/* 泡が下から上に移動＆フェードアウトするアニメーション */
@keyframes bubbleMove {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}

.rect-dynamic {
  transition:1s;
}
</style>