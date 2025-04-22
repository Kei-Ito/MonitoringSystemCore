<template>
  <div>
    <select v-model="localSelectedChannelID" class="form-select fs-5" @change="onChannelChange">
      <option 
        v-for="input_channel in selectedIOModule?.input_channels" 
        class="fs-5"
        :key="input_channel.channel_id" 
        :value="input_channel.channel_id"
        style="text-align: center"
      >
        {{ input_channel.channel_name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch ,type ComputedRef} from 'vue';
import { useStore } from 'vuex';
import type { IOModule } from '@monitoring/shared/model';

const store = useStore();
const ioModules: ComputedRef<IOModule[]> = computed(() => store.state.systemSetting.ioModules);

const emit = defineEmits(['update']);

const props = defineProps({
  selectedChannelID: {
    type: Number,
    default: -1,
  },
  selectedModuleUUID: {
    type: String,
    required: true,
  },
});

// 選択中のIOモジュールを常に最新状態で取得
const selectedIOModule = computed(() => {
  return ioModules.value.find((ioModule) => ioModule.module_uuid === props.selectedModuleUUID);
});

// localSelectedChannelIDをpropsから初期化
const localSelectedChannelID = ref(props.selectedChannelID);

// props.selectedChannelIDが変わったらlocalへ反映
watch(() => props.selectedChannelID, (newVal) => {
  localSelectedChannelID.value = newVal;
});

// モジュールが変わったとき、現在のチャンネルが存在しなければ初期化（任意）
watch(() => selectedIOModule.value, (newModule) => {
  if (newModule) {
    const hasChannel = newModule.input_channels.some(ch => ch.channel_id === localSelectedChannelID.value);
    if (!hasChannel && newModule.input_channels.length > 0) {
      // 該当チャンネルがない場合は-1や最初のチャンネルIDなどで初期化
      localSelectedChannelID.value = newModule.input_channels[0].channel_id;
    }
  } else {
    // モジュールがない場合も初期化
    localSelectedChannelID.value = -1;
  }
  onChannelChange();
});

function onChannelChange() {
  emit('update', localSelectedChannelID.value);
}
</script>
