<template>
    <div>
      <select 
        v-model="localValue" 
        class="form-select fs-6 border"
        aria-label=".form-select-lg example"
      >
        <option 
          v-for="(ModuleType, index) in IOModuleTypes" 
          :key="index"
          :value="ModuleType"
          style="text-align: center"
        >
          {{ ModuleType }}
        </option>
      </select>
    </div>
</template>

<script setup lang="ts">
import { IOModuleTypes } from '@monitoring/shared/enum';
import { computed } from 'vue';

import { IOModuleTypeImages } from '@/enum/IOModuleTypeImages';

const props = defineProps({
  modelValue: {
    type: String,
    default: IOModuleTypeImages[0].module_type
  }
});

// 親に変更を通知するための 'update:modelValue' イベントを定義
const emit = defineEmits(['update:modelValue']);

const localValue = computed({
  get() {
    return props.modelValue
  },
  set(newVal: string) {
    emit('update:modelValue', newVal)
  }
})
</script>