<template>
  <div class="modal" tabindex="-1" role="dialog" v-if="visible">
    <div class="modal-dialog" role="document" style="max-width: 80%;">
      <div class="modal-content">
        <div class="modal-header">
          <h5>{{ $t('system_settings.sampling_clock') }}</h5>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
          <!-- サンプリングインターバル一覧 -->
          <div class="row">
            <div v-for="interval in intervals" :key="interval.uuid" class="col-12 col-xl-6 mb-4">
              <div class="interval-item h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="flex-grow-1 me-3">
                    <div class="editable-name-wrapper">
                      <i class="material-icons align-middle me-2 edit-icon">edit</i>
                      <input
                        type="text"
                        class="form-control form-control-lg form-control-prominent editable-name-input"
                        v-model="interval.name"
                        placeholder="サンプリング設定の名前を入力"
                      />
                    </div>
                  </div>
                  <button
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
                    />
                  </div>
                </div>
                <div v-if="interval.error" class="alert alert-danger mt-2" role="alert">
                  <i class="material-icons align-middle me-1" style="font-size: 18px;">error</i>
                  サンプリング周期は1秒以上に設定してください。
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
          <div v-else class="alert alert-info" role="alert">
            <i class="material-icons align-middle me-1" style="font-size: 18px;">info</i>
            最大2つまでのサンプリング設定が可能です。
          </div>
        </div>

        <div class="modal-footer">
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
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
/* --------------------------------------
 * Imports
 * -------------------------------------- */
import { ref, watch } from 'vue';
import type { SamplingInterval } from '@monitoring/shared/model';
import { 
  getSamplingIntervals, 
  addSamplingInterval, 
  updateSamplingInterval as updateSamplingIntervalAPI,
  deleteSamplingInterval as deleteSamplingIntervalAPI
} from '@/api/systemSettingAPI';
import { useSystemSettingStore } from '@/pinia/systemSettingStore';

/* --------------------------------------
 * Props / Emits
 * -------------------------------------- */
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['close']);

const systemSettingStore = useSystemSettingStore();

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
    if (period === 0) {
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
      period
    });
    
    // ストアも更新
    if (result.ok) {
      systemSettingStore.updateSamplingInterval({
        uuid: interval.uuid,
        name: interval.name,
        period
      });
    }
  }

  // 元の値を更新
  originalIntervals.value = JSON.parse(JSON.stringify(intervals.value));
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
    period: 1000
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

.interval-item {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.interval-item:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
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
  