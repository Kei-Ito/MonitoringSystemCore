<template>
    <div class="modal" tabindex="-1" role="dialog" v-if="props.visible">
        <div class="modal-dialog" role="document" style="max-width: 80%;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>{{ $t('system_settings.input_data_setting') }}</h5>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div class="d-flex align-items-center">
                        <i class="material-icons fs-4 text-dark">calculate</i>
                        <label class="fs-5 text-nowrap mb-0 pb-0 text-dark">正規化設定</label>
                    </div>
                    <span class="ms-2 mt-2 text-xs font-weight-bolder opacity-7">入力値を実際のセンサの値に補正</span>
                    <div class="d-flex justify-content-evenly">
                        <div class="form-group mb-3 me-2 p-2 border rounded-3">
                            <label class="fs-5 d-inline-block text-nowrap align-middle mb-2 text-dark">入力値</label>
                            <div class="d-flex align-items-center">
                                <label class="d-inline-block text-nowrap me-2 mb-0 align-middle text-dark">最大値</label>
                                <input type="number" class="form-control border px-2 fs-5" style="width:100px"
                                    v-model="localChannelSetting.normalize.src_max" :min="localChannelSetting.normalize.src_min" />
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <label class="d-inline-block text-nowrap me-2 mb-0 align-middle text-dark">最小値</label>
                                <input type="number" class="form-control border px-2 fs-5" style="width:100px"
                                    v-model="localChannelSetting.normalize.src_min" :max="localChannelSetting.normalize.src_max" />
                            </div>  
                        </div>
                        <div class="form-group mb-3 p-2 border rounded-3">
                            <label class="fs-5 d-inline-block text-nowrap align-middle mb-2 text-dark">正規化後</label>
                            <div class="d-flex align-items-center">
                                <label class="d-inline-block text-nowrap me-2 mb-0 align-middle text-dark">最大値</label>
                                <input type="number" class="form-control border px-2 fs-5" style="width:100px"
                                    v-model="localChannelSetting.normalize.dst_max" :min="localChannelSetting.normalize.dst_min" />
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <label class="d-inline-block text-nowrap me-2 mb-0 align-middle text-dark">最小値</label>
                                <input type="number" class="form-control border px-2 fs-5" style="width:100px"
                                    v-model="localChannelSetting.normalize.dst_min" :max="localChannelSetting.normalize.dst_max" />
                            </div>
                        </div>
                    </div>

                    <div class="d-flex align-items-center">
                        <i class="material-icons fs-4 text-dark">notification_important </i>
                        <label class="fs-5 text-nowrap mb-0 pb-0 text-dark">閾値設定</label>  
                    </div>
                    <span class="ms-2 mt-2 text-xs font-weight-bolder opacity-7">閾値の範囲外の入力値を異常と判定</span>
                    <div class="form-group mb-3 p-2 border rounded-3">
                        <div class="d-flex align-items-center">
                            <label class="d-inline-block text-nowrap me-2 mb-0 align-middle text-dark">最大値</label>
                            <input type="number" class="form-control border px-2 fs-5"
                                v-model="localChannelSetting.threshold.alert_max_threshold" :min="localChannelSetting.threshold.alert_min_threshold??0" />
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <label class="d-inline-block text-nowrap me-2 mb-0 align-middle text-dark">最小値</label>
                            <input type="number" class="form-control border px-2 fs-5"
                                v-model="localChannelSetting.threshold.alert_min_threshold" :max="localChannelSetting.threshold.alert_max_threshold??999999" />
                        </div>
                    </div>

                    <span v-if="isError" class="text-danger">入力値が不正です</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="update" style="width: 110px;">
                        {{ $t('modal_window.update') }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="close" style="width: 110px;">
                        {{ $t('modal_window.cancel') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* --------------------------------------
 * Props / Emits
 * -------------------------------------- */
const props = defineProps({
    visible: Boolean,
    channelSetting: {
        type: Object as PropType<IChannelSetting>,
        required: true,
    },
});
// 親コンポーネントへイベントを送る
const emit = defineEmits(["update", "close"]);
/* --------------------------------------
 * Imports
 * -------------------------------------- */
import type { IChannelSetting } from '@monitoring/shared/model';
import { type PropType,type Ref,ref, watch , } from 'vue';


const localChannelSetting: Ref<IChannelSetting> = ref<IChannelSetting>(props.channelSetting);
const isError = ref(false);



/**
 * モーダルを閉じる
 */
function close() {
    emit('close');
}


function update() {
    if (validateValue()) {
        isError.value = true;
        return;
    }
    emit('update', localChannelSetting.value);
    close();
}

//設定された値が有効かどうかを判定
function validateValue(): boolean {
    if (localChannelSetting.value.normalize.dst_min > localChannelSetting.value.normalize.dst_max || localChannelSetting.value.normalize.src_min > localChannelSetting.value.normalize.src_max) {
        return true;
    } else {
        return false;
    }
}

// モーダルが表示されたときに、localChannelSettingにprops.modelValueをセット
// (直前にキャンセルを選択された場合などに、localChannelSettingの値が変わっている可能性があるため)
watch(() => props.visible, (newVal) => {
    if (newVal) {
        localChannelSetting.value = props.channelSetting;
    }
});
</script>
