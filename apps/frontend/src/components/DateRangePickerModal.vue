<template>
  <BaseModal :show="props.show" :title="$t('trend.select_date_range') || '表示期間を選択'" size="modal-lg" maxWidth="800px"
    @close="closeModal">
    <!-- Body -->
    <div>
      <!-- モード選択タブ -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: isRealtimeMode }" href="#" @click.prevent="setMode(true)">
            リアルタイム
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: !isRealtimeMode }" href="#" @click.prevent="setMode(false)">
            過去データ検索
          </a>
        </li>
      </ul>

      <!-- リアルタイムモード -->
      <div v-if="isRealtimeMode" class="p-3 text-center">
        <label class="mb-3 fs-6">当日のデータをリアルタイムに表示します</label>
        <h4 :class="[`text-${color}`]">{{ todayStr }}</h4>
        <p class="text-muted small mt-2">※日付が変わると翌日のデータを表示します</p>
      </div>

      <!-- 過去データ検索モード -->
      <div v-else class="past-data-container">
        <div class="text-center">
          <label class="fs-6 mb-3">過去のデータを検索して表示します</label>
        </div>
        <div class="row g-2">
          <div class="col-md-6">
            <div class="editable-name-wrapper">
              <label class="form-label">開始日</label>
              <input type="date" class="form-control fs-4" v-model="startDateStr" :max="endDateStr" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="editable-name-wrapper">
              <label class="form-label">終了日</label>
              <input type="date" class="form-control fs-4" v-model="endDateStr" :min="startDateStr" />
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <label class="form-label">クイック選択</label>
            <div class="btn-group w-100" role="group">
              <button type="button" class="btn btn-outline-secondary fs-6" @click="setYesterday">
                昨日
              </button>
              <button type="button" class="btn btn-outline-secondary fs-6" @click="setLastWeek">
                過去7日間
              </button>
              <button type="button" class="btn btn-outline-secondary fs-6" @click="setLastMonth">
                過去30日間
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <button type="button" class="btn btn-primary" style="width: 110px;" @click="confirmDateRange">
        {{ $t('modal_window.update') || '更新' }}
      </button>
      <button type="button" class="btn btn-secondary" style="width: 110px;" @click="closeModal">
        {{ $t('modal_window.cancel') || 'キャンセル' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUiStore } from '@/pinia/uiStore';
import { storeToRefs } from 'pinia';

import BaseModal from "@/components/BaseModal.vue";

const props = defineProps<{
  show: boolean;
  startDate?: Date;
  endDate?: Date;
  initialIsRealtime?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  'date-range-selected': [{ isRealtime: boolean; startDate: Date; endDate: Date }];
}>();

const uiStore = useUiStore();
const { color } = storeToRefs(uiStore);

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
const isRealtimeMode = ref(props.initialIsRealtime ?? true);

const todayStr = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
});

// propsが変更されたら内部の状態を更新
watch(() => props.startDate, (newDate) => {
  if (newDate) startDateStr.value = toDateString(newDate);
});

watch(() => props.endDate, (newDate) => {
  if (newDate) endDateStr.value = toDateString(newDate);
});

watch(() => props.initialIsRealtime, (val) => {
  if (val !== undefined) isRealtimeMode.value = val;
});

function setMode(isRealtime: boolean) {
  isRealtimeMode.value = isRealtime;
}

function closeModal() {
  emit('close');
}

function confirmDateRange() {
  let startDate: Date;
  let endDate: Date;

  if (isRealtimeMode.value) {
    // リアルタイムモードなら今日の日付を設定
    const today = new Date();
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  } else {
    // 過去データ検索モードなら入力値を使用
    startDate = fromDateString(startDateStr.value);
    endDate = fromDateString(endDateStr.value);

    // 開始時刻を00:00:00に、終了時刻を23:59:59に設定
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  emit('date-range-selected', { isRealtime: isRealtimeMode.value, startDate, endDate });
  closeModal();
}

// クイック選択機能
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
.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.nav-tabs .nav-link {
  cursor: pointer;
  color: #7b809a; /* 非選択時はグレー */
}

.nav-tabs .nav-link.active {
  color: #1a73e8; /* 選択時は青 */
  font-weight: 600;
}

.editable-name-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 2px dashed #007bff;
  border-radius: 8px;
  background-color: #f0f8ff;
  transition: all 0.3s ease;
}

.editable-name-wrapper:hover {
  background-color: #e6f2ff;
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

/* クイック選択ボタンを押している間、入力フィールドを強調表示 */
.past-data-container:has(.btn:active) .editable-name-wrapper {
  background-color: #e6f2ff;
  border-color: #0056b3;
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.5);
  transform: scale(1.02);
}

.editable-name-wrapper .form-label {
  white-space: nowrap;
  margin-right: 1rem;
  margin-bottom: 0;
}

.editable-name-wrapper input {
  flex-grow: 1;
}

</style>
