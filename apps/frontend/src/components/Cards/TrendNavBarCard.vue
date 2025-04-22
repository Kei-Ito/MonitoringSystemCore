<template>
    <div>

    <div class="card z-index-2 mb-3 mt-n3" style="z-index:1050">
        <div class="card-body d-flex align-items-center p-1">
            <div class="row w-100">
                <div class="col-lg-5 col-md-5 col-sm-12">
                    <button class="btn flex-btn w-100 d-flex align-items-center m-0" @click="showModulePicker">
                        <i class="material-icons-outlined fs-2 text-black">bar_chart</i>
                        <h4 class="fs-4 m-0 mx-3 text-black">{{selectedChannelName}}</h4>
                    </button>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-10 d-flex align-items-center">
                    <button class="btn flex-btn w-100 d-flex align-items-center m-0" @click="showModal">
                        <i class="material-icons-outlined fs-2 text-black">calendar_month</i>
                        <h4 class="fs-4 m-0 mx-3 text-black">{{DateToString(selectedDate)}}</h4>
                    </button>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2  d-flex align-items-center justify-content-end">
                    <button class="btn flex-btn d-flex align-items-center my-0 mx-1 p-2">
                        <i class="material-icons-outlined fs-2 text-black">insights</i>
                    </button>
                    <button class="btn flex-btn d-flex align-items-center my-0 mx-1 p-2" @click="downloadCSV">
                        <i class="material-icons-outlined fs-2 text-black">file_download</i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <date-picker-modal :show="isModalVisible" @close="hideModal" @date-selected="updateDate" />
    <channel-picker-modal :show="isModulePickerVisible" @close-channel-picker="hideChannelPicker" />
</div>
    
</template>

<script setup lang="ts">
import { ref,computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from "vue-toastification";
import DatePickerModal from '@/components/DatePickerModal.vue';
import ChannelPickerModal from '@/components/ChannelPickerModal.vue';
import type { IOModule,IChannelSetting } from '@monitoring/shared/model';
import { getCsvData } from "@/api/trendDataAPI";


const toast = useToast();
const store = useStore();

const selectedChannelName = computed(() => {
    const channel_id=store.state.systemSetting.trendChartSetting.channel_id;
    const module = store.state.systemSetting.ioModules.find((module:IOModule)=>module.input_channels.some((channel:IChannelSetting)=>channel.channel_id===channel_id));
    if(module){
        const channel = module.input_channels.find((channel:IChannelSetting)=>channel.channel_id===channel_id);
        if (channel){
            return channel.channel_name;
        }
        else return '';
    }
    else return '';
});
const selectedDate = computed(() => store.state.systemSetting.trendChartSetting.specific_chart_setting.selected_date);
const isModalVisible = ref(false);
const isModulePickerVisible = ref(false);

const emit = defineEmits(['date-selected']);

function showModal() {
  isModalVisible.value = true;
}

function showModulePicker() {
    isModulePickerVisible.value = true;
}

function hideModal() {
    isModalVisible.value = false;
}

function hideChannelPicker() {
    isModulePickerVisible.value = false;
}

function updateDate(date: any) {
    emit('date-selected', date);
}

function DateToString(date: Date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

async function downloadCSV() {
  await getCsvData([1, 2, 3,4,5,6,7], new Date(store.state.trendChartSetting.specific_chart_setting.selected_date));
  toast.success("CSV downloaded");
}

</script>
<style scoped>
.row-flex-div {
    display: flex;
}

.dark-version{   
    border: 1px solid #ffffff31;
    box-shadow: 0 0 10px 3px rgba(58, 178, 255, 0.3) !important;
    background-color: #121212 !important;
}

/* ボタンスタイル */
.flex-btn {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    width: auto;
    transition: background-color 0.3s, color 0.3s;
}

.flex-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

/* モジュールピッカーのマウスオーバー時スタイル */
.flex-btn:hover .text-black {
    color: #007bff; /* テキスト色を変更 */
}

/* ダークモード対応 */
.dark-version {
    border: 1px solid #ffffff31;
    box-shadow: 0 0 10px 3px rgba(58, 178, 255, 0.3) !important;
    background-color: #121212 !important;
}
</style>
