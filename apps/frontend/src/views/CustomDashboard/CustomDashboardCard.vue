<template>
  <div class="container" :class="{ active: isSampling }">

    <div class="content">
      <e-charts-gauge-chart :value="props.value" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useMonitoringStore } from "@/pinia/monitoringStore";

import EChartsGaugeChart from "./CustomEChartsGaugeChart.vue";
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
});

const monitoringStore = useMonitoringStore();
const { isSampling } = storeToRefs(monitoringStore);

</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  background: #444c55;
  transition: box-shadow 0.5s ease;
  /* 追加 */
}


.container.active {
  box-shadow: 0 0 10px 3px rgba(73, 27, 218, 0.5) ;
}

.title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  /* 追加 */
  position: relative;
  padding: 10px 10px 5px 0px;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 10px 10px 0px 0px;
  background: linear-gradient(87deg,
      rgba(77, 77, 77, 0.7) 0%,
      rgba(71, 71, 71, 0.7) 100%);

  .title-text {
    color: #fff;
  }

  .icon-style {
    font-size: 30px;
    color: #fff;
  }
}

.title.active {
  background: linear-gradient(87deg,
      rgba(92, 74, 217, 0.7) 0%,
      rgba(73, 27, 218, 0.7) 100%);
}

.content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position:relative;
  padding: 15px 0px 0px 0px;
  border-radius: 10px 10px 10px 10px;
  background: #262626;
}

.error-icon {
  position: absolute;
  top: 0%;
  left: 0%;
  color: #ff0000;
  /* アイコンを点滅させる */
  animation: blink 1s linear infinite;
}

/* 点滅用の @keyframes */
@keyframes blink {

  0%,
  100% {
    opacity: 1;
    /* 最初と最後は表示される */
  }

  50% {
    opacity: 0;
    /* 中間で非表示にする */
  }
}
</style>