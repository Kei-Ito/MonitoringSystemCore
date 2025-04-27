<template>
    <div class="card z-index-2 mb-1" :class="{ 'dark-version': isDarkMode, 'mt-3': expanded, 'mt-0': !expanded }"
        style="transition: margin-top 0.3s ease-in-out;">
        <div class="card-header p-0 position-relative mx-3 z-index-2 bg-transparent"
            :class="expanded ? 'mt-n2' : 'mt-2'" style="transition: margin-top 0.3s ease-in-out;">
            <div class="border-radius-lg bg-gradient-dark shadow-dark">
                <a v-if="!expanded" class="btn text-white px-3 pb-0 mb-0 " data-bs-toggle="collapse"
                    :data-bs-target="'#' + uniqueId">
                    <i class="material-icons-round fs-3" aria-hidden="true">settings</i>
                </a>
                <slot />
                <div v-if="expanded" class="py-3 px-2 mt-n3 z-index-2 border-top border-secondary">
                    <div class="row-flex-div px-1 mb-2">
                        <div class="px-1">
                            <label class="text-light">
                                最小値
                            </label>
                            <input type="number" class="form-control form-control-sm bg-white fs-6"
                                style="padding-left: 5px;padding-right: 0px;"
                                v-model.number="localSetting.specific_chart_setting.minValue" />
                        </div>
                        <div class="px-1">
                            <label class="text-light">
                                最大値
                            </label>
                            <input type="number" class="form-control form-control-sm bg-white fs-6"
                                style="padding-left: 5px;padding-right: 0px;"
                                v-model.number="localSetting.specific_chart_setting.maxValue" />
                        </div>
                        <span class="input-group-text border-start border-secondary my-1 mx-2"></span> <!-- ここで縦線 -->
                        <div class="px-1">
                            <label class="text-light">
                                警告下
                            </label>
                            <input type="number" class="form-control form-control-sm bg-white fs-6"
                                style="padding-left: 5px;padding-right: 0px;" />
                        </div>
                        <div class="px-1">
                            <label class="text-light">
                                警告上
                            </label>
                            <input type="number" class="form-control form-control-sm bg-white fs-6"
                                style="padding-left: 5px;padding-right: 0px;" />
                        </div>
                    </div>


                    <div class="row-flex-div px-2">
                        <input type="color" class="form-control form-control-color"
                            v-model="localSetting.specific_chart_setting.colors[0]" />
                        <span class="input-group-text border-start border-gray my-2"></span> <!-- ここで縦線 -->
                        <input type="color" class="form-control form-control-color"
                            v-model="localSetting.specific_chart_setting.colors[1]" />
                        <span class="input-group-text border-start border-gray my-2"></span> <!-- ここで縦線 -->
                        <input type="color" class="form-control form-control-color"
                            v-model="localSetting.specific_chart_setting.colors[2]" />
                        <span class="input-group-text border-start border-gray my-2"></span> <!-- ここで縦線 -->
                        <input type="color" class="form-control form-control-color"
                            v-model="localSetting.specific_chart_setting.colors[3]" />
                        <span class="input-group-text border-start border-gray my-2"></span> <!-- ここで縦線 -->
                        <input type="color" class="form-control form-control-color"
                            v-model="localSetting.specific_chart_setting.colors[4]" />

                    </div>
                    <div class="row-flex-div" style="padding-left: 10%; padding-right: 10%;">
                        <input type="number" class="form-control form-control-sm px-0 bg-white fs-6"
                            style="margin-left: 4%;margin-right:5%;"
                            v-model.number="localSetting.specific_chart_setting.thresholds[0]" min="0" max="1" />
                        <input type="number" class="form-control form-control-sm px-0 bg-white fs-6"
                            style="margin-right:5%" v-model.number="localSetting.specific_chart_setting.thresholds[1]"
                            min="0" max="1" />
                        <input type="number" class="form-control form-control-sm px-0 bg-white fs-6"
                            style="margin-right:5%" v-model.number="localSetting.specific_chart_setting.thresholds[2]"
                            min="0" max="1" />
                        <input type="number" class="form-control form-control-sm px-0 bg-white fs-6"
                            style="margin-right:4%" v-model.number="localSetting.specific_chart_setting.thresholds[3]"
                            min="0" max="1" />
                    </div>
                </div>


            </div>
        </div>
        <div class="card-body pt-2 pb-2">
            <div class="row-flex-div">

                <div class="px-2">
                    <h5 class="mb-0 fs-4">{{ selectedChannel?.channel_name }}</h5>
                </div>
                <div class="px-2">
                    <h5 class="mb-0 fs-4">{{ selectedChannel?.unit }}</h5>
                </div>

            </div>
            <div :id="uniqueId" class="collapse border-top">
                <div class="settings-panel mt-3">
                    <div class="me-3 mb-2">
                        <label for="io-module" class="form-label mb-0">IOモジュール選択</label>
                        <IOModuleSelector :selected-u-u-i-d="localSetting.module_uuid" @update="handleIOModuleUpdate" />
                    </div>
                    <div class="me-3 mb-2">
                        <label for="channel" class="form-label mb-0">チャンネル選択</label>
                        <ChannelSelector :selected-module-u-u-i-d="localSetting.module_uuid"
                            :selected-channel-i-d="localSetting.channel_id" @update="handleChannelUpdate" />
                    </div>
                    <div class="row mt-4">
                        <div class="row-flex-div">
                            <button type="button" class="btn btn-primary mx-2 w-80" @click="onUpdateClicked">{{
                                $t('modal_window.update')
                            }}</button>


                            <button type="button" class="btn btn-secondary mx-2 w-80" @click="onCancelClicked">{{
                                $t('modal_window.cancel')
                            }}</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, onMounted, defineEmits, computed, type Ref, type ComputedRef, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { Collapse } from 'bootstrap';
import { useUiStore } from '@/pinia/uiStore';
import { useMonitoringStore } from '@/pinia/monitoringStore';
import { updateDashboardChart } from '@/service/chartService';
import IOModuleSelector from '@/components/Selector/IOModuleSelector.vue';
import ChannelSelector from '@/components/Selector/ChannelSelector.vue';

import type { IOModule, IChannelSetting, ChartSetting } from '@monitoring/shared/model';

const props = defineProps({
    color: String,
    setting: {
        type: Object as PropType<ChartSetting>,
        required: true
    }
});

const uiStore = useUiStore();
const monitoringStore = useMonitoringStore();

const { ioModules } = storeToRefs(monitoringStore);
const { isDarkMode } = storeToRefs(uiStore);

// collapseの開閉を制御するためにインスタンスのuidを取得
const instance = getCurrentInstance();
const uid = instance?.uid;
const uniqueId = `collapse-${uid}`;

// collapseの状態に応じて表示を切り替えるためのフラグ
const expanded = ref(false);

const selectedChannel: Ref<IChannelSetting | null> = ref(null);

// ローカルの選択状態を管理
const localSetting = ref(JSON.parse(JSON.stringify(props.setting)));

let collapseInstance: Collapse | null = null;

const emit = defineEmits(['update']);

onMounted(() => {
    const el = document.getElementById(uniqueId);
    if (el) {
        // Collapseインスタンスを取得または作成
        collapseInstance = Collapse.getOrCreateInstance(el, { toggle: false });
        el.addEventListener('show.bs.collapse', () => {
            expanded.value = true;
        });
        el.addEventListener('hide.bs.collapse', () => {
            expanded.value = false;
        });
    }
    updateSelectedChannel();
})

async function updateSelectedChannel() {
    let selectedModule: IOModule | undefined = ioModules.value.find((ioModule) => ioModule.module_uuid === localSetting.value.module_uuid);
    if (selectedModule) {
        let Channel = selectedModule.input_channels.find((channel) => channel.channel_id === localSetting.value.channel_id);
        if (Channel) {
            selectedChannel.value = Channel;
        }

    }
    await updateDashboardChart(localSetting.value);
}

function handleIOModuleUpdate(moduleUUID: string) {
    localSetting.value.module_uuid = moduleUUID;
}

function handleChannelUpdate(channelID: number) {
    localSetting.value.channel_id = channelID;
}

function onCancelClicked() {
    localSetting.value = JSON.parse(JSON.stringify(props.setting));
    updateDashboardChart(localSetting.value);
    close();
}

function onUpdateClicked() {
    // 必要な値は localSetting.value から取得するが、
    // store へはその時点のクローンを渡す
    const updatedSetting = JSON.parse(JSON.stringify(localSetting.value));
    emit('update', updatedSetting.module_uuid, updatedSetting.channel_id);
    // store 更新
    updateDashboardChart(updatedSetting);
    close();
}


function close() {
    //更新せずに閉じる
    expanded.value = false;
    // Bootstrapのcollapse APIを通して閉じる
    if (collapseInstance) {
        collapseInstance.hide();
    }
}

</script>

<style scoped>
.row-flex-div {
    display: flex;
    justify-content: space-between;
}

.dark-version {
    border: 1px solid #ffffff31;
    box-shadow: 0 0 10px 3px rgba(58, 178, 255, 0.3) !important;
    background-color: #121212 !important;
}
</style>
