<template>
    <div class="modal" tabindex="-1" role="dialog" v-if="visible">
      <div class="modal-dialog" role="document" style="max-width: 80%;">
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ $t('system_settings.sampling_clock') }}</h5>
          </div>
          <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <!-- 時間を入力 -->
            <div class="modal-body d-flex justify-content-between align-items-center mx-4">
              <div class="d-flex align-items-center" style="flex-direction: column;">
                <small>{{ $t('system_settings.clock.hour') }}</small>
                <input
                  id="time-hours"
                  type="number"
                  v-model.number="timHoursStr"
                  min="0"
                  max="24"
                  required
                />
              </div>
              <!-- コロン -->
              <label style="align-self: flex-end;">:</label>
              <div
                class="d-flex align-items-center"
                style="display: flex; flex-direction: column; align-items: center;"
              >
                <small>{{ $t('system_settings.clock.minute') }}</small>
                <input
                  id="time-minutes"
                  type="number"
                  v-model.number="timMinutesStr"
                  min="0"
                  max="60"
                  required
                />
              </div>
              <!-- コロン -->
              <label style="align-self: flex-end;">:</label>
              <div
                class="d-flex align-items-center"
                style="display: flex; flex-direction: column; align-items: center;"
              >
                <small>{{ $t('system_settings.clock.second') }}</small>
                <input
                  id="time-seconds"
                  type="number"
                  v-model.number="timeSecondsStr"
                  min="0"
                  max="60"
                  required
                />
              </div>
            </div>
            <span v-if="isError" class="error-message"
              >サンプリング周期は1秒以上に設定してください。</span
            >
          </div>
  
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="updateModule"
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
  import { ref, computed, watch, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useMonitoringStore } from "@/pinia/monitoringStore";
  import { updateSamplingInterval } from '@/service/monitoringService';
  
  /* --------------------------------------
   * Props / Emits
   * -------------------------------------- */
  const props = defineProps<{
    visible: boolean;
  }>();
  
  // 親コンポーネントへイベントを送る
  const emit =  defineEmits(['close', 'update'])

  const monitoringStore = useMonitoringStore();
  
  /* --------------------------------------
   * Reactive State
   * -------------------------------------- */
  const timHoursStr = ref('');
  const timMinutesStr = ref('');
  const timeSecondsStr = ref('');
  const isError = ref(false);
  
  const { isSampling,samplingInterval } = storeToRefs(monitoringStore);
  
  /**
   * モーダルを閉じる
   */
  function close() {
    emit('close');
  }
  
  /**
   * 更新ボタン押下時の処理
   */
  function updateModule() {
    isError.value = false;
  
    const hours = Number(timHoursStr.value);
    const minutes = Number(timMinutesStr.value);
    const seconds = Number(timeSecondsStr.value);
  
    // 0h0m0s は許可しない（最低1秒以上）
    if (hours === 0 && minutes === 0 && seconds === 0) {
      isError.value = true;
      return;
    }
  
    const milliseconds = serializeTime({ hours, minutes, seconds });
  
    updateSamplingInterval(milliseconds);
  
    // 親コンポーネントにも更新値を通知
    emit('update', milliseconds);
    close();
  }
  
  /**
   * システム設定のサンプリング周期を分解して { hours, minutes, seconds } 形式で返す
   */
  function deserializeTime(time: number) {
    const hours = Math.floor(time / 1000 / 3600);
    const minutes = Math.floor(((time / 1000) % 3600) / 60);
    const seconds = (time / 1000) % 60;
    return { hours, minutes, seconds };
  }
  
  /**
   * { hours, minutes, seconds } からミリ秒へ変換
   */
  function serializeTime({
    hours,
    minutes,
    seconds,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
  }): number {
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
  
  /**
   * 2桁ゼロ埋め
   */
  function padZero(num: number | string) {
    return String(num).padStart(2, '0');
  }
  
  /**
   * store からサンプリング周期を取得し、timHoursStr などに反映
   */
  function syncClockWithStore() {
    const { hours, minutes, seconds } = deserializeTime(samplingInterval.value);
    timHoursStr.value = padZero(hours);
    timMinutesStr.value = padZero(minutes);
    timeSecondsStr.value = padZero(seconds);
  }
  
  /* --------------------------------------
   * Watchers
   * -------------------------------------- */
  // モーダル表示フラグが変わったら、store から時刻を再取得する
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        syncClockWithStore();
        isError.value = false;
      }
    }
  );
  
  // 常に2桁で表示されるよう監視
  watch(timHoursStr, (newVal) => {
    timHoursStr.value = padZero(newVal);
  });
  
  watch(timMinutesStr, (newVal) => {
    timMinutesStr.value = padZero(newVal);
  });
  
  watch(timeSecondsStr, (newVal) => {
    timeSecondsStr.value = padZero(newVal);
  });
  
  /* --------------------------------------
   * Lifecycle
   * -------------------------------------- */
  onMounted(() => {
    // 初期表示時にストアから時間を同期
    const { hours, minutes, seconds } = deserializeTime(samplingInterval.value);
    timHoursStr.value = padZero(hours);
    timMinutesStr.value = padZero(minutes);
    timeSecondsStr.value = padZero(seconds);
  });
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
  
  input {
    text-align: center;
    font-size: 1.5rem;
  }
  
  label {
    font-size: 1.7rem;
    margin-bottom: 0.2rem;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
  }
  
  .error-message {
    color: red;
    font-size: 1rem;
  }
  </style>
  