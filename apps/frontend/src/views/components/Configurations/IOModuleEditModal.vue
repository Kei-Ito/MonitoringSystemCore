<template>
  <div class="modal" tabindex="-1" role="dialog" v-if="visible">
    <div class="modal-dialog" role="document" style="max-width: 80%;min-width: 40%">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">入出力モジュール設定</h5>
          <button type="button" class="btn btn-secondary" @click="deleteModuleBtnClicked">モジュールを削除</button>
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">

          <label for="name" class="mx-3">モジュール名</label>
          <input type="text" v-model="localModule.module_name" id="name" style="width: 60%;" />


          <table v-if="isVisibleSpecificSettingTable" class="table mx-0 container mt-2">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">項目</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">内容</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in localModule.specific_device_setting" :key="key">
                <td>
                  <label class="form-label fs-6" :for="key">{{ key }}</label>
                </td>
                <td>
                  <input class="w-100" :type="determineInputType(value)" :id="key"
                    v-model="localModule.specific_device_setting[key]" />
                </td>
              </tr>
              <tr />
            </tbody>
          </table>
          <table class="table container mt-3">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 10px;">
                  入力チャンネル</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">入力チャンネル名</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%;">単位
                </th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 30px;">
                  少数点以下表示</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2 text-center"
                  style="width: 15px;">
                  入力値設定
                </th>
                <th v-if="isEditableSpecificInputChannelSetting"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2" style="width: 15px;">
                  詳細設定
                </th>
                <th v-if="isAdditableInputChannel"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2 text-center"
                  style="width: 15px;">
                  削除
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(channel, index) in localModule.input_channels" :key="index">
                <td>チャンネル {{ index + 1 }}</td>
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
                <td class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0">
                    <i class="material-icons-round" aria-hidden="true"
                      @click="openNormalizeSettingModal(channel)">tune</i>
                  </a>
                </td>
                <td v-if="isEditableSpecificInputChannelSetting" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0"
                    @click="openChannelSpecificSettingModal(channel)">
                    <i class="material-icons-round" aria-hidden="true">edit</i>
                  </a>
                </td>
                <td v-if="isAdditableInputChannel" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0" @click="deleteChannelButtonClick(channel)">
                    <i class="material-icons-round" aria-hidden="true">delete</i>
                  </a>
                </td>
              </tr>
              <tr /><!-- v-ifで隠れている場合、一番下の縦線が表示されないので空の行を一つ追加している-->
              <tr v-if="isAdditableInputChannel">
                <td colspan="4" class="text-start">
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
          <table class="table  container mt-3"
            v-if="isAdditableOutputChannel || localModule.output_channels.length !== 0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 10px;">
                  出力チャンネル</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">出力チャンネル名</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 15%;">単位
                </th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7" style="width: 30px;">
                  少数点以下表示</th>
                <th v-if="isEditableSpecificOutputChannelSetting"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2" style="width: 15px;">
                  詳細設定
                </th>
                <th v-if="isAdditableOutputChannel"
                  class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 px-2 text-center"
                  style="width: 15px;">
                  削除
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(channel, index) in localModule.output_channels" :key="index">
                <td>チャンネル {{ index + 1 }}</td>
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
                <td v-if="isAdditableOutputChannel" class="align-middle text-center">
                  <a class="btn btn-link text-dark px-1 py-0 mb-0 mt-0" @click="deleteChannel(channel)">
                    <i class="material-icons-round" aria-hidden="true">delete</i>
                  </a>
                </td>
              </tr>
              <tr /><!-- v-ifで隠れている場合、一番下の縦線が表示されないので空の行を一つ追加している-->
              <tr v-if="isAdditableOutputChannel">
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
          <span v-if="isError" class="error-message">更新に失敗しました。</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" style="width: 110px;" @click="updateBtnClicked">{{
            $t('modal_window.update') }}</button>
          <button type="button" class="btn btn-secondary" style="width: 110px;" @click="cancelBtnClicked">{{
            $t('modal_window.cancel') }}</button>
        </div>
      </div>
    </div>
    <ChannelSpecificSettingModal v-if="selectedChannel" :visible="isChannelSpecificSettingVisible"
      :channel="selectedChannel!" @close="isChannelSpecificSettingVisible = false" @update="updateChannelSetting" />

    <InputDataSettingModal v-if="selectedChannel" :visible="isNormalizeSettingModalVisible"
      :channelSetting="selectedChannel!" @close="isNormalizeSettingModalVisible = false"
      @update="updateChannelSetting" />
    <CheckModal ref="checkModal" />
  </div>
</template>

<script lang="ts" setup>

import type { IChannelSetting,IOModule } from '@monitoring/shared/model';
import { createInputChannelForInitialization, createOutputChannelForInitialization } from '@monitoring/shared/model';
import { type Ref,ref, toRefs, watch } from 'vue'

import ChannelSpecificSettingModal from '@/components/ChannelSpecificSettingModal.vue';
import CheckModal from '@/components/Modal/CheckModal.vue';
import { addChannel, deleteChannel,deleteIOModule, updateIOModule } from '@/service/monitoringService';
import InputDataSettingModal from '@/views/components/Configurations/InputDataSettingModal.vue';

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

// isAdditableの状態をrefで管理
const isAdditableInputChannel = ref(false);
const isAdditableOutputChannel = ref(false);

const isEditableSpecificInputChannelSetting = ref(false);
const isEditableSpecificOutputChannelSetting = ref(false);

const isVisibleSpecificSettingTable: Ref<boolean> = ref(false);
const isChannelSpecificSettingVisible = ref(false);
const isNormalizeSettingModalVisible = ref(false);
const selectedChannel = ref<IChannelSetting<any> | null>(null);

const isError = ref(false);
// ConfirmModal の参照を保持する
const checkModal = ref<InstanceType<typeof CheckModal> | null>(null)

// moduleが変更されたらlocalModuleを更新し、isAdditableを制御
watch(module, (newModule) => {
  localModule.value = JSON.parse(JSON.stringify(newModule))
  isAdditableInputChannel.value = localModule.value.is_editable_input_channel;
  isAdditableOutputChannel.value = localModule.value.is_editable_output_channel;
  isEditableSpecificInputChannelSetting.value = localModule.value.input_channels.some(channel => Object.keys(channel.specific_channel_setting).length !== 0);
  isEditableSpecificOutputChannelSetting.value = localModule.value.output_channels.some(channel => Object.keys(channel.specific_channel_setting).length !== 0);
  if (Object.keys(module.value.specific_device_setting).length > 0) {
    isVisibleSpecificSettingTable.value = true;
  } else {
    isVisibleSpecificSettingTable.value = false;
  }
  isError.value = false;
}, { deep: true });

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

.modal-dialog {
  margin: 0;
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