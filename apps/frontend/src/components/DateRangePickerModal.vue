<template>
  <teleport to="body">
    <div class="modal" role="dialog" v-if="props.show">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('trend.select_date_range') || '表示期間を選択' }}</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <label class="form-label">開始日</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="startDateStr"
                  :max="endDateStr"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">終了日</label>
                <input 
                  type="date" 
                  class="form-control" 
                  v-model="endDateStr"
                  :min="startDateStr"
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <div class="btn-group w-100" role="group">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="setToday"
                  >
                    今日
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="setYesterday"
                  >
                    昨日
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="setLastWeek"
                  >
                    過去7日間
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    @click="setLastMonth"
                  >
                    過去30日間
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" style="width: 110px;" @click="confirmDateRange">
              {{ $t('modal_window.update') || '更新' }}
            </button>
            <button type="button" class="btn btn-secondary" style="width: 110px;" @click="closeModal">
              {{ $t('modal_window.cancel') || 'キャンセル' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  startDate?: Date;
  endDate?: Date;
}>();

const emit = defineEmits<{
  close: [];
  'date-range-selected': [{ startDate: Date; endDate: Date }];
}>();

// 日付を YYYY-MM-DD 形式の文字列に変換
function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 形式の文字列から Date オブジェクトを生成
function fromDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const now = new Date();
const startDateStr = ref(toDateString(props.startDate || now));
const endDateStr = ref(toDateString(props.endDate || now));

// propsが変更されたら内部の状態を更新
watch(() => props.startDate, (newDate) => {
  if (newDate) startDateStr.value = toDateString(newDate);
});

watch(() => props.endDate, (newDate) => {
  if (newDate) endDateStr.value = toDateString(newDate);
});

function closeModal() {
  emit('close');
}

function confirmDateRange() {
  const startDate = fromDateString(startDateStr.value);
  const endDate = fromDateString(endDateStr.value);
  
  // 開始時刻を00:00:00に、終了時刻を23:59:59に設定
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  emit('date-range-selected', { startDate, endDate });
  closeModal();
}

// クイック選択機能
function setToday() {
  const today = new Date();
  startDateStr.value = toDateString(today);
  endDateStr.value = toDateString(today);
}

function setYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  startDateStr.value = toDateString(yesterday);
  endDateStr.value = toDateString(yesterday);
}

function setLastWeek() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  startDateStr.value = toDateString(start);
  endDateStr.value = toDateString(end);
}

function setLastMonth() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  startDateStr.value = toDateString(start);
  endDateStr.value = toDateString(end);
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
  z-index: 1050;
}

.modal-dialog {
  margin: 0;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
