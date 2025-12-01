<template>
  <BaseModal :show="props.show" :title="$t('trend.select_date_range') || '表示期間を選択'" size="modal-lg" maxWidth="800px"
    @close="closeModal">
    <!-- Body -->
    <div>
      <!-- プリセットモード選択 -->
      <div class="preset-buttons mb-4">
        <label class="form-label">表示モード</label>
        <div class="d-flex flex-wrap gap-2">
          <button 
            type="button" 
            class="btn preset-btn" 
            :class="selectedMode === TrendPresetMode.Realtime ? `btn-${color}` : 'btn-outline-secondary'"
            @click="selectPresetMode(TrendPresetMode.Realtime)"
          >
            <span class="preset-icon">📍</span>
            <span>リアルタイム（今日）</span>
          </button>
          <button 
            type="button" 
            class="btn preset-btn"
            :class="selectedMode === TrendPresetMode.LastWeek ? `btn-${color}` : 'btn-outline-secondary'"
            @click="selectPresetMode(TrendPresetMode.LastWeek)"
          >
            <span class="preset-icon">📅</span>
            <span>直近1週間</span>
          </button>
          <button 
            type="button" 
            class="btn preset-btn"
            :class="selectedMode === TrendPresetMode.LastMonth ? `btn-${color}` : 'btn-outline-secondary'"
            @click="selectPresetMode(TrendPresetMode.LastMonth)"
          >
            <span class="preset-icon">📆</span>
            <span>直近1ヶ月</span>
          </button>
          <button 
            type="button" 
            class="btn preset-btn"
            :class="selectedMode === TrendPresetMode.Custom ? `btn-${color}` : 'btn-outline-secondary'"
            @click="selectPresetMode(TrendPresetMode.Custom)"
          >
            <span class="preset-icon">🔧</span>
            <span>カスタム期間</span>
          </button>
        </div>
      </div>

      <!-- モード別の表示 -->
      <!-- リアルタイムモード -->
      <div v-if="selectedMode === TrendPresetMode.Realtime" class="mode-content p-3 text-center">
        <label class="mb-3 fs-6">当日のデータをリアルタイムに表示します</label>
        <h4 :class="[`text-${color}`]">{{ todayStr }}</h4>
        <p class="text-muted small mt-2">※日付が変わると翌日のデータを表示します</p>
      </div>

      <!-- 直近1週間モード -->
      <div v-else-if="selectedMode === TrendPresetMode.LastWeek" class="mode-content p-3 text-center">
        <label class="mb-3 fs-6">直近7日間のデータを表示します</label>
        <h4 :class="[`text-${color}`]">{{ lastWeekRangeStr }}</h4>
        <p class="text-muted small mt-2">※日付が変わると期間が自動で更新されます</p>
      </div>

      <!-- 直近1ヶ月モード -->
      <div v-else-if="selectedMode === TrendPresetMode.LastMonth" class="mode-content p-3 text-center">
        <label class="mb-3 fs-6">直近30日間のデータを表示します</label>
        <h4 :class="[`text-${color}`]">{{ lastMonthRangeStr }}</h4>
        <p class="text-muted small mt-2">※日付が変わると期間が自動で更新されます</p>
      </div>

      <!-- カスタム期間モード -->
      <div v-else class="mode-content past-data-container">
        <div class="text-center">
          <label class="fs-6 mb-3">任意の期間を指定して表示します</label>
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
              <button type="button" class="btn btn-outline-secondary fs-6" @click="setLastWeekCustom">
                過去7日間
              </button>
              <button type="button" class="btn btn-outline-secondary fs-6" @click="setLastMonthCustom">
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
import { TrendPresetMode } from '@monitoring/shared/enum';

import BaseModal from "@/components/BaseModal.vue";

const props = defineProps<{
  show: boolean;
  startDate?: Date;
  endDate?: Date;
  initialPresetMode?: TrendPresetMode;
  /** @deprecated initialPresetMode を使用してください */
  initialIsRealtime?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  'date-range-selected': [{ presetMode: TrendPresetMode; startDate: Date; endDate: Date }];
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

// 日付をフォーマット
function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

const now = new Date();
const startDateStr = ref(toDateString(props.startDate || now));
const endDateStr = ref(toDateString(props.endDate || now));

// 初期モードの決定
function getInitialMode(): TrendPresetMode {
  if (props.initialPresetMode) return props.initialPresetMode;
  if (props.initialIsRealtime === false) return TrendPresetMode.Custom;
  return TrendPresetMode.Realtime;
}

const selectedMode = ref<TrendPresetMode>(getInitialMode());

// 表示用の文字列
const todayStr = computed(() => {
  const d = new Date();
  return formatDate(d);
});

const lastWeekRangeStr = computed(() => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return `${formatDate(start)} ～ ${formatDate(end)}`;
});

const lastMonthRangeStr = computed(() => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return `${formatDate(start)} ～ ${formatDate(end)}`;
});

// propsが変更されたら内部の状態を更新
watch(() => props.startDate, (newDate) => {
  if (newDate) startDateStr.value = toDateString(newDate);
});

watch(() => props.endDate, (newDate) => {
  if (newDate) endDateStr.value = toDateString(newDate);
});

watch(() => props.initialPresetMode, (val) => {
  if (val !== undefined) selectedMode.value = val;
});

// 後方互換性
watch(() => props.initialIsRealtime, (val) => {
  if (val !== undefined && props.initialPresetMode === undefined) {
    selectedMode.value = val ? TrendPresetMode.Realtime : TrendPresetMode.Custom;
  }
});

function selectPresetMode(mode: TrendPresetMode) {
  selectedMode.value = mode;
}

function closeModal() {
  emit('close');
}

function confirmDateRange() {
  let startDate: Date;
  let endDate: Date;

  const today = new Date();
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  switch (selectedMode.value) {
    case TrendPresetMode.Realtime: {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      endDate = endOfToday;
      break;
    }
    case TrendPresetMode.LastWeek: {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 0, 0, 0);
      endDate = endOfToday;
      break;
    }
    case TrendPresetMode.LastMonth: {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29, 0, 0, 0);
      endDate = endOfToday;
      break;
    }
    case TrendPresetMode.Custom:
    default: {
      startDate = fromDateString(startDateStr.value);
      endDate = fromDateString(endDateStr.value);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    }
  }

  emit('date-range-selected', { presetMode: selectedMode.value, startDate, endDate });
  closeModal();
}

// クイック選択機能（カスタムモード用）
function setYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  startDateStr.value = toDateString(yesterday);
  endDateStr.value = toDateString(yesterday);
}

function setLastWeekCustom() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  startDateStr.value = toDateString(start);
  endDateStr.value = toDateString(end);
}

function setLastMonthCustom() {
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

.preset-buttons .form-label {
  display: block;
  margin-bottom: 0.75rem;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.25rem;
  min-width: 140px;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.preset-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.mode-content {
  min-height: 150px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #fafafa;
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
