<template>
  <BaseModal
    :show="visible"
    :title="$t('system_settings.sampling_clock')"
    size="modal-xl"
    maxWidth="80%"
    @close="close"
  >
    <!-- Body -->
    <div>
      <!-- サンプリングインターバル一覧 -->
      <div class="row">
        <div v-for="interval in intervals" :key="interval.uuid" class="col-12 col-xl-6 mb-4">
          <div class="interval-item h-100" :class="{ 'interval-locked': interval.requiresAdmin && !isAdmin }">
            <!-- ロック表示（管理者権限が必要で非管理者の場合） -->
            <div v-if="interval.requiresAdmin && !isAdmin" class="locked-overlay">
              <i class="material-icons lock-icon">lock</i>
              <span class="lock-text">管理者権限が必要です</span>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="flex-grow-1 me-3">
                <div class="editable-name-wrapper">
                  <i class="material-icons align-middle me-2 edit-icon">edit</i>
                  <input
                    type="text"
                    class="form-control form-control-lg form-control-prominent editable-name-input fs-4"
                    v-model="interval.name"
                    placeholder="サンプリング設定の名前を入力"
                    :disabled="interval.requiresAdmin && !isAdmin"
                  />
                </div>
              </div>
              <!-- 削除ボタン(管理者のみ表示) -->
              <button
                v-if="isAdmin"
                type="button"
                class="btn btn-sm btn-danger flex-shrink-0"
                @click="deleteInterval(interval.uuid)"
                :disabled="intervals.length <= 1"
              >
                <i class="material-icons">delete</i>
                {{ $t('modal_window.delete') }}
              </button>
            </div>
            
            <!-- 時間入力 -->
            <div class="mb-2">
              <label class="form-label fw-bold">
                <i class="material-icons align-middle me-1" style="font-size: 18px;">schedule</i>
                サンプリング周期
              </label>
            </div>
            <div class="d-flex justify-content-center align-items-center mx-4 time-inputs">
              <div class="time-input-group">
                <label class="time-label">{{ $t('system_settings.clock.hour') }}</label>
                <input
                  type="number"
                  class="form-control form-control-lg text-center"
                  v-model.number="interval.hours"
                  min="0"
                  max="24"
                  required
                  :disabled="interval.requiresAdmin && !isAdmin"
                />
              </div>
              <span class="time-separator">:</span>
              <div class="time-input-group">
                <label class="time-label">{{ $t('system_settings.clock.minute') }}</label>
                <input
                  type="number"
                  class="form-control form-control-lg text-center"
                  v-model.number="interval.minutes"
                  min="0"
                  max="60"
                  required
                  :disabled="interval.requiresAdmin && !isAdmin"
                />
              </div>
              <span class="time-separator">:</span>
              <div class="time-input-group">
                <label class="time-label">{{ $t('system_settings.clock.second') }}</label>
                <input
                  type="number"
                  class="form-control form-control-lg text-center"
                  v-model.number="interval.seconds"
                  min="0"
                  max="60"
                  required
                  :disabled="interval.requiresAdmin && !isAdmin"
                />
              </div>
            </div>
            <div v-if="interval.error" class="alert alert-danger mt-2" role="alert">
              <i class="material-icons align-middle me-1" style="font-size: 18px;">error</i>
              <span class="">サンプリング周期は1分以上に設定してください。</span>
            </div>

            <!-- 管理者権限要求設定 -->
            <div class="mt-3" v-if="isAdmin">
              <div class="form-check form-switch d-flex align-items-center">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  :id="'requiresAdmin-' + interval.uuid"
                  v-model="interval.requiresAdmin"
                  :disabled="!isAdmin"
                  role="switch"
                />
                <label class="form-check-label" :for="'requiresAdmin-' + intervaign-middll.uuid">
                  <i class="material-icons ale me-1" style="font-size: 18px;">admin_panel_settings</i>
                  管理者権限の要求
                </label>
              </div>
              <small class="text-muted ms-4">
                この設定を有効にすると、管理者以外はこのサンプリング設定を変更できなくなります。
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- 新規追加ボタン（最大2個まで） -->
      <button
        v-if="intervals.length < 2"
        type="button"
        class="btn btn-success btn-lg w-100"
        @click="addNewInterval"
      >
        <i class="material-icons align-middle me-2">add_circle</i>
        {{ $t('system_settings.interval.add') }}
      </button>
    </div>

    <!-- Footer -->
    <template #footer>
      <button
        type="button"
        class="btn btn-primary"
        @click="save"
        style="width: 110px;"
      >
        {{ $t('modal_window.update') }}
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="close"
        style="width: 110px;"
      >
        {{ $t('modal_window.cancel') }}
      </button>
    </template>
  </BaseModal>
</template>
  
<script setup lang="ts">
/* --------------------------------------
 * Imports
 * -------------------------------------- */
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { SamplingInterval } from '@monitoring/shared/model';
import { 
  getSamplingIntervals, 
  addSamplingInterval, 
  updateSamplingInterval as updateSamplingIntervalAPI,
  deleteSamplingInterval as deleteSamplingIntervalAPI
} from '@/api/systemSettingAPI';
import { useSystemSettingStore } from '@/pinia/systemSettingStore';
import { useUiStore } from '@/pinia/uiStore';

import BaseModal from "@/components/BaseModal.vue";

/* --------------------------------------
 * Props / Emits
 * -------------------------------------- */
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['close', 'update']);

const systemSettingStore = useSystemSettingStore();
const { isAdmin } = storeToRefs(useUiStore());

/* --------------------------------------
 * Reactive State
 * -------------------------------------- */
interface IntervalViewModel extends SamplingInterval {
  hours: number;
  minutes: number;
  seconds: number;
  error: boolean;
}

const intervals = ref<IntervalViewModel[]>([]);
const originalIntervals = ref<IntervalViewModel[]>([]);

/* --------------------------------------
 * Functions
 * -------------------------------------- */

/**
 * モーダルを閉じる（変更を破棄）
 */
function close() {
  // 元の値に戻す
  intervals.value = JSON.parse(JSON.stringify(originalIntervals.value));
  emit('close');
}

/**
 * 保存してモーダルを閉じる
 */
async function save() {
  // バリデーション
  let hasError = false;
  for (const interval of intervals.value) {
    interval.error = false;
    const period = serializeTime(interval.hours, interval.minutes, interval.seconds);
    if (period < 60000) {
      interval.error = true;
      hasError = true;
    }
  }

  if (hasError) {
    return;
  }

  // 全てのインターバルを更新
  for (const interval of intervals.value) {
    const period = serializeTime(interval.hours, interval.minutes, interval.seconds);
    const result = await updateSamplingIntervalAPI(interval.uuid, {
      name: interval.name,
      period,
      requiresAdmin: interval.requiresAdmin
    });
    
    // ストアも更新
    if (result.ok) {
      systemSettingStore.updateSamplingInterval({
        uuid: interval.uuid,
        name: interval.name,
        period,
        requiresAdmin: interval.requiresAdmin
      });
    }
  }

  // 元の値を更新
  originalIntervals.value = JSON.parse(JSON.stringify(intervals.value));
  emit('update');
  emit('close');
}

/**
 * サンプリングインターバル一覧を取得
 */
async function loadIntervals() {
  const result = await getSamplingIntervals();
  if (result.ok) {
    intervals.value = result.value.map(interval => ({
      ...interval,
      ...deserializeTime(interval.period),
      error: false
    }));
    // 元の値を保存
    originalIntervals.value = JSON.parse(JSON.stringify(intervals.value));
  }
}

/**
 * ミリ秒を時分秒に分解
 */
function deserializeTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

/**
 * 時分秒をミリ秒に変換
 */
function serializeTime(hours: number, minutes: number, seconds: number): number {
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * 新しいインターバルを追加
 */
async function addNewInterval() {
  const result = await addSamplingInterval({
    name: '新規サンプリング',
    period: 60000
  });

  if (result.ok) {
    const newInterval = {
      ...result.value,
      ...deserializeTime(result.value.period),
      error: false
    };
    intervals.value.push(newInterval);
    originalIntervals.value.push(JSON.parse(JSON.stringify(newInterval)));
    
    // ストアにも追加
    systemSettingStore.addSamplingInterval(result.value);
  }
}

/**
 * インターバルを削除
 */
async function deleteInterval(uuid: string) {
  if (intervals.value.length <= 1) {
    return;
  }

  const result = await deleteSamplingIntervalAPI(uuid);
  if (result.ok) {
    intervals.value = intervals.value.filter(i => i.uuid !== uuid);
    originalIntervals.value = originalIntervals.value.filter(i => i.uuid !== uuid);
    
    // ストアからも削除
    systemSettingStore.deleteSamplingInterval(uuid);
  }
}

/* --------------------------------------
 * Watchers
 * -------------------------------------- */
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      loadIntervals();
    }
  }
);
</script>

<style scoped>
.interval-item {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.interval-item:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.interval-item.interval-locked {
  border-color: #ffc107;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
}

.interval-item.interval-locked:hover {
  border-color: #ffb300;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.locked-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
}

.lock-icon {
  font-size: 20px;
  color: #856404;
}

.lock-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.form-label {
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.fw-bold {
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

.edit-icon {
  color: #007bff;
  font-size: 20px;
  flex-shrink: 0;
}

.editable-name-input {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding-left: 0.5rem !important;
}

.editable-name-input:focus {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.time-inputs {
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.time-input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.time-separator {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  align-self: flex-end;
  margin-bottom: 0.5rem;
}

input[type="number"].form-control-lg {
  width: 90px;
  font-size: 1.8rem;
  font-weight: bold;
  padding: 0.5rem;
  border: 2px solid #ced4da;
  border-radius: 8px;
  transition: border-color 0.2s;
}

input[type="number"].form-control-lg:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.material-icons {
  vertical-align: middle;
}

.align-middle {
  vertical-align: middle;
}

.btn-danger i,
.btn-success i {
  font-size: 18px;
}

.alert {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}
</style>
  