<template>
    <BaseModal
        :show="visible"
        title="入力 詳細設定"
        size="modal-lg"
        maxWidth="80%"
        @close="close"
    >
        <!-- ボディ -->
        <div >
            <table class="table table-bordered mt-3">
                <thead class="custom-light-blue">
                    <tr>
                        <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">項目
                        </th>
                        <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-10">内容
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, key) in localSetting" :key="key">
                        <td>
                            <label class="form-label" :for="key">{{ key }}</label>
                        </td>
                        <td>
                            <input :type="determineInputType(value)" :id="key"
                                v-model="localSetting[key]" />
                        </td>
                    </tr>
                    <tr/>
                </tbody>
            </table>
        </div>

        <template #footer>
            <button type="button" class="btn btn-primary" style="width: 110px;" @click="update">{{ $t('modal_window.update')
                }}</button>
            <button type="button" class="btn btn-secondary" style="width: 110px;" @click="close">{{ $t('modal_window.cancel')
                }}</button>
        </template>
    </BaseModal>
</template>

<script lang="ts" setup>
import { ref, toRefs,watch } from 'vue'

import BaseModal from "@/components/BaseModal.vue";

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    channel: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'update'])
const { visible, channel } = toRefs(props)

// localSettingはspecific_channel_settingをディープコピーしたもの
// 初期表示用の設定 
const localSetting = ref<Record<string, any>>({})

watch(channel, (newVal) => {
    // チャンネル内にspecific_channel_settingがある場合、それを編集対象にする
    if (newVal && newVal.specific_channel_setting) {
        // ディープコピーしてlocalSettingに保持
        localSetting.value = JSON.parse(JSON.stringify(newVal.specific_channel_setting))
    } else {
        localSetting.value = {};
    }
}, { immediate: true, deep: true })

function close() {
    emit('close')
}

function update() {
    if (localSetting.value) {
        // channel.specific_channel_settingを更新して上位へ通知
        // 上位は、この更新結果をもとに実際にIOModuleをアップデートすることを想定
        const updatedChannel = {
            ...channel.value,
            specific_channel_setting: { ...localSetting.value }
        }
        emit('update', updatedChannel)
        close()
    } else {
        close()
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
.custom-light-blue {
  background-color: #e3f2fd; /* とても薄い青色 */
  color: #212529; /* Bootstrapデフォルトテキストカラー(黒っぽい) */
}

.table-bordered {
  border-color: #b7c7d6 !important;
}
.table-bordered th, .table-bordered td {
  border-color: #b7c7d6 !important;
}
</style>
