<template>
    <div class="modal" tabindex="-1" role="dialog" v-if="visible">
        <div class="modal-dialog" role="document" style="max-width: 80%;min-width: 300px">
            <div class="modal-content">
                <!-- ヘッダー -->
                <div class="modal-header">
                    <h5 class="modal-title">入力 詳細設定</h5>
                    <button type="button" class="close" @click="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <!-- ボディ -->
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <!-- specific_channel_settingが存在する場合のみ表示 -->

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
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" style="width: 110px;" @click="update">{{ $t('modal_window.update')
                        }}</button>
                    <button type="button" class="btn btn-secondary" style="width: 110px;" @click="close">{{ $t('modal_window.cancel')
                        }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs,watch } from 'vue'

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
