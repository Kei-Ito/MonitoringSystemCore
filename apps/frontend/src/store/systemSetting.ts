import * as api from '../api';
import type { IOModule, IChannelSetting, ChartSetting, SystemSettingData } from '@monitoring/shared/model';
import { ChartTypes } from '@monitoring/shared/enum';
import type { IOModuleStatusResponse } from "@monitoring/shared/api";
import { type Result, ok, err } from "@monitoring/shared/utils";
import { useToast } from "vue-toastification";
import { loadLocalStorageColor, saveLocalStorageColor } from './localStorageColor';

const toast = useToast();

// 検証用にデフォルトのチャート設定を追加
const defaultTrendChartSetting: ChartSetting = {
  chart_id: 0,
  module_uuid: "2adb03fa-6ee4-49bb-97c1-c83d82dde04a",
  channel_id: 1,
  chart_type: ChartTypes.GaugeChart,
  chart_position: {
    chart_id: 0,
    x: 0,
    y: 0,
    width: 4,
    height: 4,
  },
  specific_chart_setting: {
    selected_date: new Date(),
    data: null,
  },
}

interface State {
  hideConfigButton: boolean;
  isPinned: boolean;
  showConfig: boolean;
  sidebarType: string;
  isRTL: boolean;
  color: string;
  isNavFixed: boolean;
  isAbsolute: boolean;
  showNavs: boolean;
  showSidenav: boolean;
  showNavbar: boolean;
  showFooter: boolean;
  showMain: boolean;
  isDarkMode: boolean;
  isSampling: boolean;
  ioModules: IOModule[];
  dashboardCharts: ChartSetting[];
  trendChartSetting: ChartSetting;
  systemSetting: SystemSettingData;
  navbarFixed: string;
  absolute: string;
}

const state: State = {
  hideConfigButton: false,
  isPinned: true,
  showConfig: false,
  sidebarType: "bg-gradient-dark",
  isRTL: false,
  color: loadLocalStorageColor(),
  isNavFixed: false,
  isAbsolute: false,
  showNavs: true,
  showSidenav: true,
  showNavbar: true,
  showFooter: true,
  showMain: true,
  isDarkMode: false,
  isSampling: false,
  ioModules: [],
  dashboardCharts: [],
  trendChartSetting: defaultTrendChartSetting,
  systemSetting: {} as SystemSettingData,
  navbarFixed:
    "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
  absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
}

const mutations = {
  toggleConfigurator(state: State) {
    state.showConfig = !state.showConfig;
  },
  navbarMinimize(state: State) {
    const sidenav_show = document.querySelector(".g-sidenav-show");

    if (sidenav_show === null) return;

    if (sidenav_show.classList.contains("g-sidenav-pinned")) {
      sidenav_show.classList.remove("g-sidenav-pinned");
      state.isPinned = true;
    } else {
      sidenav_show.classList.add("g-sidenav-pinned");
      state.isPinned = false;
    }
  },
  navbarFixed(state: State) {
    if (state.isNavFixed === false) {
      state.isNavFixed = true;
    } else {
      state.isNavFixed = false;
    }
  },
  toggleEveryDisplay(state: State) {
    state.showNavbar = !state.showNavbar;
    state.showSidenav = !state.showSidenav;
    state.showFooter = !state.showFooter;
  },
  toggleHideConfig(state: State) {
    state.hideConfigButton = !state.hideConfigButton;
  },
  setSampling(state: State, payload: boolean) {
    state.isSampling = payload;
  },
  color(state: State, payload: string) {
    state.color = payload;
  },
  setSystemSetting(state: State, setting: SystemSettingData) {
    state.systemSetting = setting
  }
  ,
  setSamplingInterval(state: State, clock: number) {
    state.systemSetting.samplingInterval = clock;
  },
  setIOModules(state: State, modules: IOModule[]) {
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
    state.ioModules = Object.values(groupedModules).flat();
  },
  addIOModule(state: State, module: IOModule) {
    state.ioModules.push(module);
  },
  addChannel(state: State, channel: IChannelSetting) {
    if (channel.direction === "input") {
      state.ioModules.find(m => m.module_uuid === channel.module_uuid)?.input_channels.push(channel);
    }
    else if (channel.direction === "output") {
      state.ioModules.find(m => m.module_uuid === channel.module_uuid)?.output_channels.push(channel);
    }
  },
  updateIOModule(state: State, updatedModule: IOModule) {
    const index = state.ioModules.findIndex(m => m.module_uuid === updatedModule.module_uuid);
    if (index !== -1) {
      state.ioModules.splice(index, 1, updatedModule);
    }
  },
  deleteIOModule(state: State, moduleUUID: string) {
    const index = state.ioModules.findIndex(m => m.module_uuid === moduleUUID);
    if (index !== -1) {
      state.ioModules.splice(index, 1);
    }
  },
  deleteChannel(state: State, channel: IChannelSetting) {
    if (channel.direction === "input") {
      const index = state.ioModules.find(m => m.module_uuid === channel.module_uuid)?.input_channels.findIndex(c => c.channel_id === channel.channel_id);
      if (index !== -1 && index !== undefined) {
        state.ioModules.find(m => m.module_uuid === channel.module_uuid)?.input_channels.splice(index, 1);
      }
    } else if (channel.direction === "output") {
      const index = state.ioModules.find(m => m.module_uuid === channel.module_uuid)?.output_channels.findIndex(c => c.channel_id === channel.channel_id);
      if (index !== -1 && index !== undefined) {
        state.ioModules.find(m => m.module_uuid === channel.module_uuid)?.output_channels.splice(index, 1);
      }
    }
  },
  setDashboardCharts(state: State, charts: ChartSetting[]) {
    state.dashboardCharts = charts;
  },
  addDashboardChart(state: State, chart: ChartSetting) {
    state.dashboardCharts.push(chart);
  },
  updateDashboardChart(state: State, chart: ChartSetting) {
    const index = state.dashboardCharts.findIndex(c => c.chart_id === chart.chart_id);
    if (index !== -1) {
      state.dashboardCharts.splice(index, 1, chart);
    }
  },
  updateTrendChartSetting(state: State, setting: ChartSetting) {
    state.trendChartSetting = setting;
  }
}
const actions = {
  setColor({ commit }: any, payload: string) {
    saveLocalStorageColor(payload);
    commit("color", payload);
  },
  async getSystemSetting({ commit }: any) {
    return await api.getSystemSetting().then(setting => {
      commit('setSystemSetting', setting);
    });
  }
  ,
  async updateSamplingInterval({ commit }: any, clock: number) {
    //api経由でサンプリングクロックを送信する処理を追加
    commit('setSamplingInterval', clock);
    api.setSamplingInterval(clock);
  },
  async getIOModules({ commit }: any) {
    return await api.getIOModules().then(modules => {
      commit('setIOModules', modules);
    });
  },
  async addIOModule({ commit }: any, module: IOModule) {
    const result = await api.addIOModule(module)
    if (result.ok) {
      commit('addIOModule', result.value);
      toast.success("IO module added successfully");
    }
    else {
      toast.error("Error adding IO module\n" + result.error);
    }
  },
  async updateIOModule({ commit }: any, updatedModule: IOModule): Promise<Result<void>> {
    const result = await api.updateIOModule(updatedModule);
    if (result.ok) {
      updatedModule.status = result.value;
      commit('updateIOModule', updatedModule);
      toast.success("IO module updated successfully");
      return ok(void 0);
    }
    else {
      toast.error("Error updating IO module\n" + result.error);
      return err(result.error);
    }
  },
  async addChannel({ commit }: any, channel: IChannelSetting) {
    return await api.addChannel(channel).then(response => {
      commit('addChannel', response);
    });
  },

  async deleteIOModule({ commit, dispatch, state }: any, moduleUUID: string) {
    const input_channels = (state.ioModules as IOModule[]).find(m => m.module_uuid === moduleUUID)?.input_channels;
    const result = await api.deleteIOModule(moduleUUID)

    if (result.ok) {
      commit('deleteIOModule', moduleUUID);
      // 削除するIOモジュールを表示しているダッシュボードのチャートがあれば、そのチャートをdeactivateにする
      if (input_channels) {
        for (const channel of input_channels) {
          const charts = (state.dashboardCharts as ChartSetting[]).filter(c => c.channel_id === channel.channel_id);
          for (const chart of charts) {
            console.log('Deactivate chart:', chart);
            chart.specific_chart_setting.lastValue = NaN;
            dispatch('updateDashboardChart', chart);
          }
        }
      }
      toast.success("IO module delete successfully");
    }
    else {
      toast.error("Error deleting IO module");
    }
  },
  async deleteChannel({ commit, dispatch, state }: any, channel: IChannelSetting) {
    return await api.deleteChannel(channel).then(() => {
      commit('deleteChannel', channel);

      // 削除するチャンネルを表示しているダッシュボードのチャートがあれば、そのチャートをdeactivateにする
      const charts = (state.dashboardCharts as ChartSetting[]).filter(c => c.channel_id === channel.channel_id);
      for (const chart of charts) {
        chart.specific_chart_setting.lastValue = NaN;
        dispatch('updateDashboardChart', chart);
      }
    });
  },
  async startSampling({ state }: any) {
    //IOモジュールをサンプリング開始する処理を追加
    const response: Result<IOModuleStatusResponse[]> = await api.startSampling();
    if (response.ok) {
      const datas = response.value;
      for (const data of datas) {
        const index = (state.ioModules as IOModule[]).findIndex(io_module => io_module.module_uuid === data.module_uuid);
        if (index !== -1) {
          state.ioModules[index].status = data.status;
        }
      }
    }
    else {
      //エラー処理を追加
      console.log("Error starting sampling:", response.error);
      toast.error("Error starting sampling");
    }
  },
  async stopSampling() {
    //IOモジュールをサンプリング停止する処理を追加
    const response: Result<void> = await api.stopSampling();
    if (response.ok) {
      console.log("Sampling stopped successfully");
    }
    else {
      //エラー処理を追加
      console.log("Error stopping sampling:", response.error);
      toast.error("Error stopping sampling");
    }
  },
  async getDashboardCharts({ commit }: any) {
    return await api.getDashboardCharts().then(charts => {
      commit('setDashboardCharts', charts);
    });
  },
  async addDashboardChart({ commit }: any, chart: ChartSetting) {
    return await api.addDashboardChart(chart).then(() => {
      commit('addDashboardChart', chart);
    });
  },
  async updateDashboardChart({ commit }: any, chart: ChartSetting) {
    return await api.updateDashboardChart(chart).then(() => {
      commit('updateDashboardChart', chart);
    });
  }
}

export default {
  namespaced: false, // 名前空間を無効化
  state,
  mutations,
  actions,
};

