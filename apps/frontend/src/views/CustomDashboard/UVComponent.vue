<template>
  <div class="container" :class="{ active: isSampling, error: isError }">
    <div class="title" :class="{ active: isSampling }">
      <i class="material-icons icon-style">
        wb_incandescent
      </i>
      <span class="title-text  px-2">{{ channelSetting?.channel_name }}</span>
    </div>
    <div class="content">
      <a v-if="isError" class="btn error-icon px-3 pb-0 mb-0">
        <i class="material-icons-round fs-1">error_outline</i>
      </a>
      <span class="content-text  font-weight-bold fs-2 p-0" :class="{error:isError}">{{ roundValue(props.value, channelSetting?.decimals ?
        channelSetting.decimals :0) }}</span>
      <span class="content-text  font-weight-bold fs-3 px-3 p-0" :class="{error:isError}">{{ channelSetting?.unit }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useMonitoringStore } from "@/pinia/monitoringStore";
import type { IOModule } from '@monitoring/shared/model';
const props = defineProps({
  value: {
    type: Number,
    default: 23
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
  return (ioModules.value as IOModule[]).find((module) => module.module_uuid === module_uuid)?.input_channels.find((channel) => channel.channel_uuid === channel_id);
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
  margin: 0px 0px 0px 0px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  background: #444c55;
  transition: 0.3s;
}

.container.active {
  box-shadow: 0 0 10px 3px rgba(34, 172, 236, 0.4);
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
  transition: 0.3s;
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
      rgba(34, 172, 236, 0.7) 0%,
      rgba(15, 144, 204, 0.7) 100%) !important;
}

.content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 15px;
  border-radius: 0px 0px 10px 10px;
  background: #262626;

  .content-text {
    color: white;
  }
  .content-text.error {
    color: #ff6e76;
  }
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