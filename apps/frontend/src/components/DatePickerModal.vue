<template>
  <BaseModal
    :show="props.show"
    title="Select Date"
    size="modal-md"
    maxWidth="400px"
    @close="closeModal"
  >
    <!-- Body -->
    <div>
      <ColorCalendar v-model="selectedDate" />
    </div>

    <!-- Footer -->
    <template #footer>
      <button type="button" class="btn btn-primary" style="width: 110px;" @click="confirmDate">{{ $t('modal_window.update') }}</button>
      <button type="button" class="btn btn-secondary" style="width: 110px;" @click="closeModal">{{ $t('modal_window.cancel') }}</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
//import { storeToRefs } from 'pinia';
import { onMounted,ref } from 'vue';

import BaseModal from "@/components/BaseModal.vue";
import ColorCalendar from "@/components/ColorCalendar.vue";
//import { useChartStore } from '@/pinia/chartStore';

// TODO: トレンドグラフが複数配置される仕様に変更されたので要修正
const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'date-selected']);

//const chartStore = useChartStore();
//const { trendCharts } = storeToRefs(chartStore);

const selectedDate = ref(new Date());



function closeModal() {
  emit('close');
}

function confirmDate() {
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  //trendChartSettings.value[0].specific_chart_setting.selected_date = selectedDate.value;
  emit('date-selected', selectedDate.value);
  closeModal();
}

onMounted(()=>{
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  //selectedDate.value = trendChartSettings.value[0].specific_chart_setting.selected_date;
})


</script>

<style scoped>
/* BaseModalを使用するため、独自のモーダルスタイルは不要 */
</style>
