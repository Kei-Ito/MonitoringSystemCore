import type { SamplingInterval } from '@monitoring/shared/model';
import { defineStore } from 'pinia';

import { getSamplingIntervals } from '@/api/systemSettingAPI';

export const useSystemSettingStore = defineStore('systemSettingStore', {
  state: () => ({
    samplingIntervals: [] as SamplingInterval[],
    isLoaded: false,
  }),

  getters: {
    /**
     * サンプリングインターバルをUUIDで検索
     */
    findIntervalByUuid: (state) => {
      return (uuid: string) => {
        return state.samplingIntervals.find(interval => interval.uuid === uuid);
      };
    },
  },

  actions: {
    /**
     * サンプリングインターバル一覧を取得
     */
    async loadSamplingIntervals() {
      const result = await getSamplingIntervals();
      if (result.ok) {
        this.samplingIntervals = result.value;
        this.isLoaded = true;
      }
      return result;
    },

    /**
     * サンプリングインターバルを追加
     */
    addSamplingInterval(interval: SamplingInterval) {
      this.samplingIntervals.push(interval);
    },

    /**
     * サンプリングインターバルを更新
     */
    updateSamplingInterval(updatedInterval: SamplingInterval) {
      const index = this.samplingIntervals.findIndex(i => i.uuid === updatedInterval.uuid);
      if (index !== -1) {
        this.samplingIntervals.splice(index, 1, updatedInterval);
      }
    },

    /**
     * サンプリングインターバルを削除
     */
    deleteSamplingInterval(uuid: string) {
      const index = this.samplingIntervals.findIndex(i => i.uuid === uuid);
      if (index !== -1) {
        this.samplingIntervals.splice(index, 1);
      }
    },
  },
});
