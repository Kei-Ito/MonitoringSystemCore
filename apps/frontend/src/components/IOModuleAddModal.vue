<template>
  <div v-if="visible" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document" style="max-width: 80%; width: 500px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">IOモジュールの追加</h5>
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addModule">
            <div class="form-group">
              <label for="module_type">モジュールタイプ</label>
              <IOmodule_typeSelector v-model="module_type" />
            </div>
            <div class="form-group mt-2">
              <label for="module_name">モジュール名</label>
              <input type="text" id="module_name" class="input-style form-control fs-6 px-3" v-model="module_name"
                required placeholder="モジュールの名前を入力してください" />
            </div>
            <label v-if="isVisibleSpecificSettingTable" for="module_type" class="mt-3">モジュール詳細設定</label>
            <div v-if="isVisibleSpecificSettingTable" class="m-0 container px-0">

              <table class="table mx-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">項目</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in io_module.specific_device_setting" :key="key">
                    <td>
                      <label class="form-label fs-6" :for="key">{{ key }}</label>
                    </td>
                    <td>
                      <input class="w-100" :type="determineInputType(value)" :id="key"
                        v-model="io_module.specific_device_setting[key]" />
                    </td>
                  </tr>
                  <tr />
                </tbody>
              </table>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" style="width: 110px;" @click="addModule">追加</button>
          <button type="button" class="btn btn-secondary" style="width: 110px;" @click="close">中止</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, watch, type Ref, } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { IOModule } from '@monitoring/shared/model';
import { IOModuleTypes } from '@monitoring/shared/enum';
import { createModuleForInitialization } from '@monitoring/shared/model';
import IOmodule_typeSelector from '@/components/Selector/IOModuleTypeSelector.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});

const { visible } = toRefs(props)
const emit = defineEmits(['add', 'close']);

const module_name: Ref<string> = ref('');
const module_type: Ref<IOModuleTypes> = ref(IOModuleTypes.Dummy);
const isVisibleSpecificSettingTable: Ref<boolean> = ref(false);
const io_module: Ref<IOModule> = ref(createModuleForInitialization(uuidv4(), module_name.value, module_type.value));

watch(module_type, (newVal) => {
  if (newVal) {
    io_module.value = createModuleForInitialization(uuidv4(), module_name.value, newVal);
    if (Object.keys(io_module.value.specific_device_setting).length > 0) {
      isVisibleSpecificSettingTable.value = true;
    } else {
      isVisibleSpecificSettingTable.value = false;
    }
  }
});

watch(visible, (newVal) => {
  if (newVal === true) {
    module_name.value = '';
    module_type.value = IOModuleTypes.Dummy;
    io_module.value = createModuleForInitialization(uuidv4(), module_name.value, module_type.value);
  }
});


function addModule() {
  io_module.value.module_name = module_name.value;
  emit('add', io_module.value);
  console.log(io_module.value);
  close();
}

function close() {
  // Reset the form
  emit('close');
}

// 値の型に応じてinput typeを決定
function determineInputType(value: any): string {
  if (typeof value === 'number') {
    return 'number'
  }
  return 'text'
}

</script>
<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.input-style {
  box-radius: 4px;
  box-shadow: 0 0 1px 1px rgba(58, 58, 58, 0.2) !important;
}

.container {
  border-radius: 10px;
  border: 1px solid #ffffff31;
  box-radius: 10px;
  box-shadow: 0 0 1px 1px rgba(58, 58, 58, 0.2) !important;
}
</style>