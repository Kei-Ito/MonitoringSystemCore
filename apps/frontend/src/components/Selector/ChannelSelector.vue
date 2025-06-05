<template>
  <div>
    <select v-model="localSelectedChannelUUID" class="form-select fs-5" @change="onChannelChange">
      <option 
        v-for="input_channel in selectedIOModule?.input_channels" 
        class="fs-5"
        :key="input_channel.channel_uuid" 
        :value="input_channel.channel_uuid"
        style="text-align: center"
      >
        {{ input_channel.channel_name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

import { useMonitoringStore } from '@/pinia/monitoringStore';

const props = defineProps({
  selectedChannelUUID: {
    type: String,
    default: -1,
  },
  selectedModuleUUID: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update']);


const monitoringStore = useMonitoringStore();
const { ioModules } = storeToRefs(monitoringStore);

// 選択中のIOモジュールを常に最新状態で取得
const selectedIOModule = computed(() => {
  return ioModules.value.find((ioModule) => ioModule.module_uuid === props.selectedModuleUUID);
});

// localSelectedChannelIDをpropsから初期化
const localSelectedChannelUUID = ref(props.selectedChannelUUID);

// props.selectedChannelIDが変わったらlocalへ反映
watch(() => props.selectedChannelUUID, (newVal) => {
  localSelectedChannelUUID.value = newVal;
});

// モジュールが変わったとき、現在のチャンネルが存在しなければ初期化（任意）
watch(() => selectedIOModule.value, (newModule) => {
  if (newModule) {
    const hasChannel = newModule.input_channels.some(ch => ch.channel_uuid === localSelectedChannelUUID.value);
    if (!hasChannel && newModule.input_channels.length > 0) {
      // 該当チャンネルがない場合は-1や最初のチャンネルIDなどで初期化
      localSelectedChannelUUID.value = newModule.input_channels[0].channel_uuid;
    }
  } else {
    // モジュールがない場合も初期化
    localSelectedChannelUUID.value = "";
  }
  onChannelChange();
});

function onChannelChange() {
  emit('update', localSelectedChannelUUID.value);
}
</script>
