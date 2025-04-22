<!--
=========================================================
* Vue Material Dashboard 2 - v3.1.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-material-dashboard-2
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->
<template>
  <!-- ローディング画面 -->
  <div v-if="isLoading" class="loading-container">
    <splash-window />
  </div>
  <div v-else>
    <sidenav :custom_class="color" :class="[isRTL ? 'fixed-end' : 'fixed-start']" v-if="showSidenav" />
    <main class="main-content position-relative max-height-vh-100 h-100 overflow-x-hidden">
      <!-- nav -->
      <navbar :class="[isNavFixed ? navbarFixed : '', isAbsolute ? absolute : '']"
        :color="isAbsolute ? 'text-white opacity-8' : ''" :minNav="navbarMinimize" v-if="showNavbar" />
      <router-view />
      <app-footer v-show="showFooter" />
    </main>
  </div>

</template>
<script setup lang="ts">
import { ref,  onMounted, onUnmounted, computed,type Ref,type ComputedRef, } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import type { ChartSetting } from '@monitoring/shared/model';
import type { getIOModuleInputResponse } from '@monitoring/shared/api'
import SplashWindow from "@/components/SplashWindow.vue";
import Sidenav from "@/examples/Sidenav";
import Navbar from "@/examples/Navbars/Navbar.vue";
import AppFooter from "@/examples/Footer.vue";


const store = useStore();
const toast = useToast();

let socket: WebSocket | null;
let retryTimer: number | null = null;

const isLoading: Ref<boolean> = ref(true);

const isRTL = computed(() => store.state.systemSetting.isRTL);
const color = computed(() => store.state.systemSetting.color);
const isAbsolute = computed(() => store.state.systemSetting.isAbsolute);
const isNavFixed = computed(() => store.state.systemSetting.isNavFixed);
const navbarFixed = computed(() => store.state.systemSetting.navbarFixed);
const absolute = computed(() => store.state.systemSetting.absolute);
const showSidenav = computed(() => store.state.systemSetting.showSidenav);
const showNavbar = computed(() => store.state.systemSetting.showNavbar);
const showFooter = computed(() => store.state.systemSetting.showFooter);

const chartSettings: ComputedRef<ChartSetting[]> = computed(() => store.state.systemSetting.dashboardCharts);

onMounted(async () => {

  // IOモジュールの一覧を取得
  await store.dispatch('getIOModules');
  // ダッシュボードのチャート情報を取得
  await store.dispatch('getDashboardCharts');
  // サンプリング間隔を取得
  await store.dispatch('getSystemSetting');

  const sidenav = document.getElementsByClassName("g-sidenav-show")[0];

  if (window.innerWidth > 1200) {
    sidenav.classList.add("g-sidenav-pinned");
  }
  setupWebSocket();
  isLoading.value = false;

});

onUnmounted(() => {
  if (socket) {
    socket.close(); // WebSocketのクローズ
  }
  if (retryTimer) {
    clearTimeout(retryTimer);
  }
});

function navbarMinimize() {
  store.commit("navbarMinimize");
}

function setupWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const endpoint = `${protocol}//${host}:2479/ws`; // 相対URLを使用



  function createWebSocket() {
    const ws = new WebSocket(endpoint);

    ws.onopen = () => {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
    };

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "IOModuleData":
          updateGaugeValues(message.data);
          break;
        case "StartSampling":
          store.commit('setSampling', true);
          toast.success("Sampling started");
          break;
        case "StopSampling":
          store.commit('setSampling', false);
          toast.success("Sampling stoped");
          break;
        case "samplingStatus":
          store.commit('setSampling', message.data);
          break;
        default:
          console.error("Unknown message type:", message.type);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      store.commit('setSampling', false);
      // 数秒待って再接続
      retryTimer = setTimeout(() => {
        socket = createWebSocket();
      }, 5000);
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };
    return ws;
  }
  socket = createWebSocket();

}

function updateGaugeValues(module_datas: getIOModuleInputResponse[]) {
  // 受け取ったデータをゲージチャートに反映
  for (let i = 0; i < chartSettings.value.length; i++) {
    try {
      const module_uuid = chartSettings.value[i].module_uuid;
      const channel_id = chartSettings.value[i].channel_id;

      // モジュールIDとチャンネルIDが一致するデータを取得
      const module_data = module_datas.find((data) => data.module_uuid === module_uuid);
      if (module_data) {
        const channel_data = module_data.channels.find((channel) => channel.channel_id === channel_id);
        if (channel_data) {
          chartSettings.value[i].specific_chart_setting.lastValue = channel_data.input_data;
        }
      }
    } catch {
      //エラー処理
      console.log("取得したゲージチャートのデータが不正です");
    }
  }
}

</script>