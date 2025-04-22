<template>
  <teleport to="body">
    <div class="modal" role="dialog" v-if="props.show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Date</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ColorCalendar v-model="selectedDate" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" style="width: 110px;" @click="confirmDate">{{ $t('modal_window.update') }}</button>
            <button type="button" class="btn btn-secondary" style="width: 110px;" @click="closeModal">{{ $t('modal_window.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref,computed,watch,onMounted } from 'vue';
import { useStore } from 'vuex';
import ColorCalendar from "@/components/ColorCalendar.vue";
const props = defineProps({
  show: Boolean
});

const store = useStore();
const trendChartSetting = computed(()=> store.state.systemSetting.trendChartSetting);

const selectedDate = ref(new Date());

const emit = defineEmits(['close', 'date-selected']);

function closeModal() {
  emit('close');
}

function confirmDate() {
  const newSetting={
    ...trendChartSetting.value,
    specific_chart_setting:{
      ...trendChartSetting.value.specific_chart_setting,
      selected_date:selectedDate.value
    }
  }
  store.commit('updateTrendChartSetting', newSetting);
  emit('date-selected', selectedDate.value);
  closeModal();
}

onMounted(()=>{
  selectedDate.value = trendChartSetting.value.specific_chart_setting.selected_date;
})

watch(()=>trendChartSetting.value,()=>{
  selectedDate.value = trendChartSetting.value.specific_chart_setting.selected_date;
})

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
</style>
