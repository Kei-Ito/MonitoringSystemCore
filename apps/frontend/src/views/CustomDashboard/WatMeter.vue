<template>
  <div class="container" :class="{ active: isSampling, error: isError }">
    <div class="title" :class="{ active: isSampling }">
      <i class="material-icons icon-style">
        bolt
      </i>
      <span class="title-text">{{ channelSetting?.channel_name }}</span>
    </div>
    <div class="content">
      <a v-if="isError" class="btn error-icon px-3 pb-0 mb-0">
        <i class="material-icons-round fs-3">error_outline</i>
      </a>
      <span class="content-text font-weight-bold fs-3 p-0" :class="{ error:isError}">{{ roundValue(props.value, channelSetting?.decimals ?
        channelSetting.decimals : 0) }}</span>
      <span class="content-text  font-weight-bold fs-4 px-2 p-0" style="width:30px" :class="{ error:isError}">{{ channelSetting?.unit }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';

import { useMonitoringStore } from "@/pinia/monitoringStore";
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'W'
  },
  chartSetting: {
    type: Object,
    default: null
  }
});
const monitoringStore = useMonitoringStore();
const { isSampling,ioModules } = storeToRefs(monitoringStore);
const isError = ref(false);

const channelSetting = computed(() => {
  if (!props.chartSetting) return null; // chartSettingがnullの場合はnullを返す
  const module_uuid = props.chartSetting.module_uuid;
  const channel_id = props.chartSetting.channel_id;
  return (ioModules.value).find((module) => module.module_uuid === module_uuid)?.input_channels.find((channel) => channel.channel_uuid === channel_id);
});

watch(() => props.value, (newVal) => {
  if (channelSetting.value) {
    //TODO: チャートの修正の影響を一時的に抑制
    /**
    if (newVal < channelSetting.value.min_threshold || newVal > channelSetting.value.max_threshold) {
      isError.value = true;
    } else {
      isError.value = false;
    }
      */
  } else {
    isError.value = false; // channelSettingが無効ならエラー状態をリセット
  }
});

function roundValue(value: number, decimals: number): string {
  return value.toFixed(decimals);
}
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
  width: 160px;
  border: #5b626b solid 2px;
  background: #444c55;
  transition: box-shadow 0.3s;
}

.container.active {
  box-shadow: 0 0 5px 5px rgba(251, 240, 80, 0.5);
  border-width: 0px;
}

.container.error {
  box-shadow: 0 0 8px 2px rgba(255, 0, 0, 1) !important;
}

.title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px 5px 0px;
  font-size: 1.2rem;
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

.content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0px;
  margin: 0px;
  border-radius: 0px 0px 10px 10px;
  background: #262626;

  .content-text.error {
    color: #ff6e76;
  }
}

.title.active {
  background: linear-gradient(87deg,
      rgba(235, 218, 0, 0.7) 0%,
      rgba(254, 202, 6, 0.7) 100%) !important;
}


.error-icon {
  position: absolute;
  top: 0%;
  left: -10%;
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