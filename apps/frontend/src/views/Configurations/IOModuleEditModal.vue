<template>
  <BaseModal :show="visible" title="入出力モジュール設定" size="modal-xl" maxWidth="80%" @close="close">
    <template #header>
      <div class="d-flex align-items-center w-100">
        <h5 class="modal-title fw-bold text-white mb-0">入出力モジュール設定</h5>
        <button v-if="isAdmin" type="button" class="btn btn-secondary btn-sm ms-auto me-3 mb-0"
          @click="deleteModuleBtnClicked">モジュールを削除</button>
      </div>
    </template>

    <!-- Body -->
    <div>
      <!-- モジュール名 -->
      <div class="mb-4">
        <div class="editable-name-wrapper">
          <i class="material-icons align-middle me-2 edit-icon">edit</i>
          <input
            type="text"
            class="form-control form-control-lg form-control-prominent editable-name-input fs-4"
            v-model="localModule.module_name"
            id="name"
            placeholder="モジュール名を入力"
          />
        </div>
      </div>

      <!-- デバイス固有設定 -->
      <div v-if="isVisibleSpecificSettingTable" class="settings-section mb-4">
        <div class="section-header mb-3">
          <i class="material-icons align-middle me-2">settings</i>
          <span class="fw-bold">デバイス固有設定</span>
        </div>
        <div class="table-responsive">
          <table class="table table-styled">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">項目</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">内容</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in localModule.specific_device_setting" :key="localModule.module_uuid">
                <td>
                  <label class="form-label fs-6" :for="key">{{ key }}</label>
                </td>
                <td>
                  <input class="w-100" :type="determineInputType(value)" :id="key"
                    v-model="localModule.specific_device_setting[key]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 入力チャンネル -->
      <div class="settings-section mb-4">
        <div class="section-header mb-3">
          <i class="material-icons align-middle me-2">input</i>
          <span class="fw-bold">入力チャンネル</span>
        </div>
        <div class="table-responsive">
          <table class="table table-styled">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="min-width: 150px;">入力チャンネル名</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%; min-width: 80px;">単位
                </th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 30px; min-width: 80px;">
                  少数点以下表示</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%; min-width: 140px;">
                  サンプリング周期</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2 text-center"
                  style="width: 15px; min-width: 90px;">
                  入力値設定
                </th>
                <th v-if="isEditableSpecificInputChannelSetting && isAdmin"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2" style="width: 15px; min-width: 70px;">
                  詳細設定
                </th>
                <th v-if="isAddableInputChannel && isAdmin"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2 text-center"
                  style="width: 15px; min-width: 50px;">
                  削除
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(channel, index) in localModule.input_channels" :key="channel.channel_uuid">
                <td>
                  <input type="text" v-model="channel.channel_name" :id="'channel-name-' + index" class="w-100" />
                </td>
                <td>
                  <input type="text" v-model="channel.unit" :id="'channel-unit-' + index" class="w-100" />
                </td>
                <td>
                  <input type="number" v-model="channel.decimals" :id="'channel-decimals-' + index" min="0" max="5"
                    class="w-100" />
                </td>
                <td>
                  <select v-model="channel.sampling_interval_uuid" class="form-select form-select-sm">
                    <option v-for="interval in samplingIntervals" :key="interval.uuid" :value="interval.uuid">
                      {{ interval.name }}
                    </option>
                  </select>
                </td>
                <td class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0">
                    <i class="material-icons-round" aria-hidden="true"
                      @click="openNormalizeSettingModal(channel)">tune</i>
                  </a>
                </td>
                <td v-if="isEditableSpecificInputChannelSetting && isAdmin" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0"
                    @click="openChannelSpecificSettingModal(channel)">
                    <i class="material-icons-round" aria-hidden="true">edit</i>
                  </a>
                </td>
                <td v-if="isAddableInputChannel && isAdmin" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0" @click="deleteChannelButtonClick(channel)">
                    <i class="material-icons-round" aria-hidden="true">delete</i>
                  </a>
                </td>
              </tr>
              <tr v-if="isAddableInputChannel && isAdmin">
                <td colspan="5" class="text-start">
                  <a class="btn bg-transparent border-0 d-flex flex-column justify-content-center"
                    @click="addInputChannel">
                    <div class="d-flex items-center justify-center  items-center">
                      <i class="material-icons me-2" style="font-size:25px;">add</i>
                      <p class="text-muted mb-0 flex" style="font-size: 1.0em;">入力チャンネルを追加</p>
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 出力チャンネル -->
      <div v-if="isAddableOutputChannel || localModule.output_channels.length !== 0" class="settings-section mb-4">
        <div class="section-header mb-3">
          <i class="material-icons align-middle me-2">output</i>
          <span class="fw-bold">出力チャンネル</span>
        </div>
        <div class="table-responsive">
          <table class="table table-styled">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="min-width: 150px;">出力チャンネル名</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%; min-width: 80px;">単位
                </th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 30px; min-width: 80px;">
                  少数点以下表示</th>
                <th v-if="isEditableSpecificOutputChannelSetting && isAdmin"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2" style="width: 15px; min-width: 70px;">
                  詳細設定
                </th>
                <th v-if="isAddableOutputChannel && isAdmin"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2 text-center"
                  style="width: 15px; min-width: 50px;">
                  削除
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(channel, index) in localModule.output_channels" :key="channel.channel_uuid">
                <td>
                  <input type="text" v-model="channel.channel_name" :id="'channel-name-' + index" class="w-100" />
                </td>
                <td>
                  <input type="text" v-model="channel.unit" :id="'channel-unit-' + index" class="w-100" />
                </td>
                <td>
                  <input type="number" v-model="channel.decimals" :id="'channel-decimals-' + index" min="0" max="5"
                    class="w-100" />
                </td>
                <td v-if="isEditableSpecificOutputChannelSetting" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0"
                    @click="openChannelSpecificSettingModal(channel)">
                    <i class="material-icons-round" aria-hidden="true">edit</i>
                  </a>
                </td>
                <td v-if="isAddableOutputChannel" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0" @click="deleteChannel(channel)">
                    <i class="material-icons-round" aria-hidden="true">delete</i>
                  </a>
                </td>
              </tr>
              <tr v-if="isAddableOutputChannel && isAdmin">
                <td colspan="4" class="text-start">
                  <a class="btn bg-transparent border-0 d-flex flex-column justify-content-center"
                    @click="addOutputChannel">
                    <div class="d-flex items-center justify-center  items-center">
                      <i class="material-icons me-2" style="font-size:25px;">add</i>
                      <p class="text-muted mb-0 flex" style="font-size: 1.0em;">出力チャンネルを追加</p>
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="isError" class="alert alert-danger" role="alert">
        <i class="material-icons align-middle me-2" style="font-size: 18px;">error</i>
        更新に失敗しました。
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <button type="button" class="btn btn-primary" style="width: 110px;" @click="updateBtnClicked">{{
        $t('modal_window.update') }}</button>
      <button type="button" class="btn btn-secondary" style="width: 110px;" @click="cancelBtnClicked">{{
        $t('modal_window.cancel') }}</button>
    </template>
  </BaseModal>

  <ChannelSpecificSettingModal v-if="selectedChannel" :visible="isChannelSpecificSettingVisible"
    :channel="selectedChannel!" @close="isChannelSpecificSettingVisible = false" @update="updateChannelSetting" />

  <InputDataSettingModal v-if="selectedChannel" :visible="isNormalizeSettingModalVisible"
    :channelSetting="selectedChannel!" @close="isNormalizeSettingModalVisible = false" maxWidth="450px"
    @update="updateChannelSetting" />
  <CheckModal ref="checkModal" />
</template>

<script lang="ts" setup>

import type { IChannelSetting, IOModule } from '@monitoring/shared/model';
import { createInputChannelForInitialization, createOutputChannelForInitialization } from '@monitoring/shared/model';
import { type Ref, ref, toRefs, watch, computed, onMounted } from 'vue'

import BaseModal from "@/components/BaseModal.vue";
import ChannelSpecificSettingModal from '@/components/ChannelSpecificSettingModal.vue';
import CheckModal from '@/components/Modals/CheckModal.vue';
import { addChannel, deleteChannel, deleteIOModule, updateIOModule } from '@/service/monitoringService';
import InputDataSettingModal from '@/views/Configurations/InputDataSettingModal.vue';
import { useSystemSettingStore } from '@/pinia/systemSettingStore';
import { useUiStore } from '@/pinia/uiStore';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  module: {
    type: Object as () => IOModule,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const { visible, module } = toRefs(props);

// propsで受け取ったmoduleをlocalModuleにディープコピー
const localModule: Ref<IOModule> = ref(JSON.parse(JSON.stringify(module.value)))

// isAddableの状態をrefで管理
const isAddableInputChannel = ref(false);
const isAddableOutputChannel = ref(false);

const isEditableSpecificInputChannelSetting = ref(false);
const isEditableSpecificOutputChannelSetting = ref(false);

const isVisibleSpecificSettingTable: Ref<boolean> = ref(false);
const isChannelSpecificSettingVisible = ref(false);
const isNormalizeSettingModalVisible = ref(false);
const selectedChannel = ref<IChannelSetting<any> | null>(null);

const isError = ref(false);
// ConfirmModal の参照を保持する
const checkModal = ref<InstanceType<typeof CheckModal> | null>(null)

// システム設定ストアからサンプリングインターバルを取得
const systemSettingStore = useSystemSettingStore();
const samplingIntervals = computed(() => systemSettingStore.samplingIntervals);

const uiStore = useUiStore();
const { isAdmin } = toRefs(uiStore);

// コンポーネントマウント時にサンプリングインターバルを読み込む
onMounted(async () => {
  if (!systemSettingStore.isLoaded) {
    await systemSettingStore.loadSamplingIntervals();
  }
});

// moduleが変更されたらlocalModuleを更新し、表示制御フラグを同期
watch(module, (newModule) => {
  syncModuleState(newModule);
  // 即時実行されるので、初期表示時にもlocalModuleがpropsのmoduleと同期される
}, { deep: true, immediate: true });

function syncModuleState(newModule: IOModule) {
  if (!newModule) {
    return;
  }
  const clonedModule = JSON.parse(JSON.stringify(newModule)) as IOModule;
  localModule.value = clonedModule;
  isAddableInputChannel.value = clonedModule.is_editable_input_channel;
  isAddableOutputChannel.value = clonedModule.is_editable_output_channel;
  isEditableSpecificInputChannelSetting.value = clonedModule.input_channels.some(channel => Object.keys(channel.specific_channel_setting ?? {}).length !== 0);
  isEditableSpecificOutputChannelSetting.value = clonedModule.output_channels.some(channel => Object.keys(channel.specific_channel_setting ?? {}).length !== 0);
  isVisibleSpecificSettingTable.value = hasSpecificDeviceSetting(clonedModule);
  isError.value = false;
}

// デバイス固有設定が描画対象かどうかを判定
function hasSpecificDeviceSetting(ioModule: IOModule): boolean {
  const setting = ioModule.specific_device_setting as unknown;
  if (setting === null || setting === undefined) {
    return false;
  }
  if (Array.isArray(setting)) {
    return setting.length > 0;
  }
  if (typeof setting === 'object') {
    return Object.keys(setting as Record<string, unknown>).length > 0;
  }
  return true;
}

/**
 * このModalで使用するmoduleのデータを編集前の状態に戻す
 */
function refresh() {
  localModule.value = JSON.parse(JSON.stringify(module.value));
}

// 閉じる処理
function close() {
  isError.value = false;
  emit('close')
}

// モジュール更新処理
async function updateBtnClicked() {
  const result = await updateIOModule(localModule.value);
  if (result.ok) {
    close();
  }
  else {
    // エラー処理(エラーメッセージ表示等)
    isError.value = true;
  }
}

/**
 * キャンセルボタンを押してモーダルを閉じるメソッド
 */
function cancelBtnClicked() {
  refresh();
  close();
}

async function deleteModuleBtnClicked() {
  if (!checkModal.value) {
    return;
  }
  //削除するかどうかを確認
  const result = await checkModal.value.showModal('確認', 'この操作は実行後に復元することができません。\nモジュールを削除しますか？', '削除', 'キャンセル');
  if (result) {
    const apiResult = await deleteIOModule(localModule.value.module_uuid);
    if (apiResult.ok) {
      close();
    } else {
      // エラー処理(エラーメッセージ表示等)
      isError.value = true;
    }
  }
}

function addInputChannel() {
  const newChannel: IChannelSetting<any> = createInputChannelForInitialization(localModule.value.module_uuid, localModule.value.module_type);
  addChannel(newChannel);
}

async function addOutputChannel() {
  const newChannel: IChannelSetting<any> = createOutputChannelForInitialization(localModule.value.module_uuid, localModule.value.module_type);
  addChannel(newChannel);
}

async function deleteChannelButtonClick(channel: IChannelSetting<any>) {
  if (!checkModal.value) {
    return;
  }
  //削除するかどうかを確認
  const result = await checkModal.value.showModal('確認', 'この操作は実行後に復元することができません。\nチャンネルを削除しますか？', '削除', 'キャンセル');
  if (result) {
    deleteChannel(channel);
  }
}

function openChannelSpecificSettingModal(channel: IChannelSetting<any>) {
  selectedChannel.value = { ...channel };
  isChannelSpecificSettingVisible.value = true;
}

function openNormalizeSettingModal(channel: IChannelSetting<any>) {
  selectedChannel.value = { ...channel };
  isNormalizeSettingModalVisible.value = true;
}

function updateChannelSetting(updatedChannel: IChannelSetting<any>) {
  const index = localModule.value.input_channels.findIndex(channel => channel.channel_uuid === updatedChannel.channel_uuid)
  if (index !== -1) {
    localModule.value.input_channels[index] = updatedChannel;
  }
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
/* モジュール名編集エリア */
.editable-name-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 2px dashed #007bff;
  border-radius: 8px;
  background-color: #f0f8ff;
  transition: all 0.3s ease;
}

.editable-name-wrapper:hover {
  background-color: #e6f2ff;
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.edit-icon {
  color: #007bff;
  font-size: 20px;
  flex-shrink: 0;
}

.editable-name-input {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding-left: 0.5rem !important;
}

.editable-name-input:focus {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* セクションヘッダー */
.settings-section {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.settings-section:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #495057;
}

.section-header i {
  color: #007bff;
  font-size: 24px;
}

/* テーブルスタイル */
.table-styled {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0;
}

.table-styled thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-styled thead th {
  color: #ffffff !important;
  font-weight: 600;
  border: none;
  padding: 0.75rem;
}

.table-styled tbody tr {
  transition: background-color 0.2s ease;
}

.table-styled tbody tr:hover {
  background-color: #f8f9fa;
}

.table-styled tbody td {
  padding: 0.75rem;
  vertical-align: middle;
}

.table-styled input[type="text"],
.table-styled input[type="number"],
.table-styled select {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  transition: border-color 0.2s;
}

.table-styled input[type="text"]:focus,
.table-styled input[type="number"]:focus,
.table-styled select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

/* アイコンボタン */
.material-icons,
.material-icons-round {
  vertical-align: middle;
}

.align-middle {
  vertical-align: middle;
}

/* アラート */
.alert {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  border-radius: 8px;
}

.channel-settings {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: red;
  font-size: 1.0rem;
}

.container {
  border-radius: 10px;
  border: 1px solid #ffffff31;
  box-shadow: 0 0 1px 1px rgba(58, 58, 58, 0.2) !important;
}
</style>