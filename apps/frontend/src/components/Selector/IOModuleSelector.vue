<template>
  <div>
    <select v-model="localSelectedUUID" class="form-select fs-5" @change="onModuleChange">
      <option class="fs-6" v-for="(ioModule) in ioModules" :key="ioModule.module_uuid" :value="ioModule.module_uuid"
        style="text-align: center">
        {{ ioModule.module_name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref,defineEmits,watch} from 'vue';
import { storeToRefs }  from 'pinia';
import { useMonitoringStore } from '@/pinia/monitoringStore';

const monitoringStore = useMonitoringStore();
const { ioModules } = storeToRefs(monitoringStore);

const props = defineProps({
  selectedUUID: {
    type: String,
    default: '',
  }
});

watch(() => props.selectedUUID, (newVal) => {
  localSelectedUUID.value = newVal;
});

const emit=defineEmits(['update']);

const localSelectedUUID = ref(props.selectedUUID);

function onModuleChange(){
  emit('update',localSelectedUUID.value ? localSelectedUUID.value : '');
}


</script>