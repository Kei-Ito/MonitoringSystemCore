<template>
    <div class="card my-4">
        <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="border-radius-lg pt-4 pb-3" :class="`bg-gradient-${color} shadow-${color}`">
                <h6 class="text-white text-capitalize ps-3">{{ $t(('system_settings.title')) }}</h6>
            </div>
        </div>
        <div class="card-body px-0 pb-2">
            <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{
                                $t('system_settings.setting_item') }}</th>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{
                                $t('system_settings.setting_value') }}</th>
                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{
                                $t('system_settings.discription') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div class="d-flex flex-column justify-content-center">
                                        <h6 class="mb-0 text-sm">{{ $t('system_settings.system_color') }}</h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <ColorSelector />
                            </td>
                            <td>
                                <p class="text-xs text-secondary mb-0">{{
                                    $t('system_settings.descriptions.system_color') }}</p>
                            </td>
                        </tr>
                        <!--サンプリング周期-->
                        <tr>
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div class="d-flex flex-column justify-content-center">
                                        <h6 class="mb-0 text-sm">{{ $t('system_settings.sampling_clock') }}</h6>
                                    </div>
                                </div>
                            </td>
                            <td class="align-middle ps-2">
                                <button class="btn btn-outline-secondary btn-sm d-flex align-items-center" @click="showModal">
                                    <i class="material-icons me-2" style="font-size: 18px;">edit</i>
                                    {{ $t('system_settings.edit_sampling_intervals') }}
                                </button>
                            </td>
                            <td class="align-middle">
                                <p class="text-xs text-secondary mb-0">{{
                                    $t('system_settings.descriptions.sampling_clock') }}</p>
                            </td>
                        </tr>
                        <!--保存期間-->
                        <tr>
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div class="d-flex flex-column justify-content-center">
                                        <h6 class="mb-0 text-sm">{{ $t('system_settings.data_retention') }}</h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p class="text-s font-weight-bold mb-0">30日</p>
                            </td>
                            <td>
                                <p class="text-xs text-secondary mb-0">{{
                                    $t('system_settings.descriptions.data_retention') }}</p>
                            </td>
                        </tr>
                        <!--言語設定-->
                        <tr>
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div class="d-flex flex-column justify-content-center">
                                        <h6 class="mb-0 text-sm">{{ $t('system_settings.language') }}</h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <language-selector />
                            </td>
                            <td>
                                <p class="text-xs text-secondary mb-0">{{ $t('system_settings.descriptions.language') }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <SamplingClockSettingModal :visible="isModalVisible" @close="closeModal" @update="handleUpdate" />
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import LanguageSelector from "@/components/Selector/LanguageSelector.vue";
import { useUiStore } from "@/pinia/uiStore";

import SamplingClockSettingModal from "./SamplingClockSettingModal.vue";

const uiStore = useUiStore();
const { color } = storeToRefs(uiStore);

const isModalVisible = ref<boolean>(false);
function showModal() {
    isModalVisible.value = true;
}
function handleUpdate() {
    isModalVisible.value = false;
}
function closeModal() {
    isModalVisible.value = false;
}
</script>