import type { IChannelSetting,IOModule } from '@monitoring/shared/model'
import { err,ok  } from '@monitoring/shared/utils';
import { defineStore } from 'pinia'

export const useMonitoringStore = defineStore('monitoringStore', {
  /** ------------state-------------- */
  state: () => ({
    isSampling: false,
    ioModules: [] as IOModule[],
    samplingInterval: 30000,
  }),
  /** ------------getters-------------- */
  getters: {
    findByUuid: (state) => {
      return (uuid: string) => {
        const module = state.ioModules.find(m => m.module_uuid === uuid);
        if (!module) {
          return err(`Module with UUID ${uuid} not found`);
        }
        return ok<IOModule>(module);
      };
    },
     /** チャンネルを uuid → 設定 へフラット化 */
     channelMap: (state) => {
      const map: Record<string, IChannelSetting> = {}
      Object.values(state.ioModules).forEach((m) => {
        ;[...m.input_channels, ...m.output_channels].forEach(
          (ch) => (map[ch.channel_uuid] = ch),
        )
      })
      return map
    },
  },
  /** ------------actions-------------- */
  actions: {
    setSamplingInterval(clock: number) {
      this.samplingInterval = clock;
    },
    setIOModules(modules: IOModule[]) {
      // グルーピング
      const groupedModules = modules.reduce((acc, module) => {
        if (!acc[module.module_type]) {
          acc[module.module_type] = [];
        }
        acc[module.module_type].push(module);
        return acc;
      }, {} as Record<string, IOModule[]>);

      // 各グループ内でソート
      for (const type in groupedModules) {
        groupedModules[type] = groupedModules[type].sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateA.getTime() - dateB.getTime();
        });
      }

      // グループを結合して配列に戻す
      this.ioModules = Object.values(groupedModules).flat();
    },
    addChannel(channel: IChannelSetting) {
      if (channel.direction === "input") {
        this.ioModules.find(m => m.module_uuid === channel.module_uuid)?.input_channels.push(channel);
      }
      else if (channel.direction === "output") {
        this.ioModules.find(m => m.module_uuid === channel.module_uuid)?.output_channels.push(channel);
      }
    },
    updateIOModule(updatedModule: IOModule) {
      const index = this.ioModules.findIndex(m => m.module_uuid === updatedModule.module_uuid);
      if (index !== -1) {
        this.ioModules.splice(index, 1, updatedModule);
      }
    },
    deleteIOModule(moduleUUID: string) {
      const index = this.ioModules.findIndex(m => m.module_uuid === moduleUUID);
      if (index !== -1) {
        this.ioModules.splice(index, 1);
      }
    },
    deleteChannel(channel: IChannelSetting) {
      if (channel.direction === "input") {
        const index = this.ioModules.find(m => m.module_uuid === channel.module_uuid)?.input_channels.findIndex(c => c.channel_uuid === channel.channel_uuid);
        if (index !== -1 && index !== undefined) {
          this.ioModules.find(m => m.module_uuid === channel.module_uuid)?.input_channels.splice(index, 1);
        }
      } else if (channel.direction === "output") {
        const index = this.ioModules.find(m => m.module_uuid === channel.module_uuid)?.output_channels.findIndex(c => c.channel_uuid === channel.channel_uuid);
        if (index !== -1 && index !== undefined) {
          this.ioModules.find(m => m.module_uuid === channel.module_uuid)?.output_channels.splice(index, 1);
        }
      }
    },
  },
})
