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
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted,type Ref,ref } from "vue";
import { useToast } from "vue-toastification";

import SplashWindow from "@/components/SplashWindow.vue";
import AppFooter from "@/examples/Footer.vue";
import Navbar from "@/examples/Navbars/Navbar.vue";
import Sidenav from "@/examples/Sidenav/index.vue";
import { useUiStore } from "@/pinia/uiStore";
import { useMonitoringStore } from './pinia/monitoringStore';
import { getUiLayouts } from "@/service/uiService";
import { fetchSystemSetting, getIOModules } from "@/service/monitoringService";

const toast = useToast();
const uiStore = useUiStore()
const monitoringStore = useMonitoringStore();

let socket: WebSocket|null = null;
let retryTimer:  ReturnType<typeof setTimeout> | null = null;

const isLoading: Ref<boolean> = ref(true);

const { 
  isRTL,
  color,
  isAbsolute,
  isNavFixed,
  navbarFixed,
  absolute,
  showSidenav,
  showNavbar,
  showFooter,
} = storeToRefs(uiStore);

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

    // WebSocketのメッセージ受信時の処理
    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "IOModuleData":
          //updateGaugeValues(message.data);
          break;
        case "StartSampling":
          monitoringStore.isSampling = true;
          toast.success("モニタリングを開始しました");
          break;
        case "StopSampling":
          monitoringStore.isSampling = false;
          toast.success("モニタリングを停止しました");
          break;
        case "samplingStatus":
          // TODO: 不要かも。要確認
          monitoringStore.isSampling = message.data;
          break;
        default:
          console.error("Unknown message type:", message.type);
      }
    };

    // WebSocketが閉じられたときの処理
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      monitoringStore.isSampling = false;
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


onMounted(async () => {

  // IOモジュールの一覧を取得
  await getIOModules();
  // UIレイアウト（ダッシュボードやトレンドなど全ページ）を取得
  await getUiLayouts();
  // サンプリング間隔を取得
  await fetchSystemSetting();

  console.log(monitoringStore.ioModules)
  const sidenav = document.getElementsByClassName("g-sidenav-show")[0];

  if (window.innerWidth > 1200) {
    sidenav.classList.add("g-sidenav-pinned");
  }
  // TODO: デバッグ用に抑制
  setupWebSocket();
  isLoading.value = false;

});

onUnmounted(() => {
  if (socket !== null) {
    socket?.close(); // WebSocketのクローズ
  }
  if (retryTimer) {
    clearTimeout(retryTimer);
  }
});

function navbarMinimize() {
  uiStore.navbarMinimize();
}

   

//function updateGaugeValues(module_datas: getIOModuleInputResponse[]) {
  // 受け取ったデータをゲージチャートに反映
  // TODO: チャートの設定の更新影響を受ける箇所のため、一時的にコメントアウト
  /**
  for (let i = 0; i < dashboardCharts.value.length; i++) {
    try {
      const module_uuid = dashboardCharts.value[i].module_uuid;
      const channel_id = dashboardCharts.value[i].channel_id;

      // モジュールIDとチャンネルIDが一致するデータを取得
      const module_data = module_datas.find((data) => data.module_uuid === module_uuid);
      if (module_data) {
        const channel_data = module_data.channels.find((channel) => channel.channel_id === channel_id);
        if (channel_data) {
          dashboardCharts.value[i].specific_chart_setting.lastValue = channel_data.input_data;
        }
      }
    } catch {
      //エラー処理
      console.log("取得したゲージチャートのデータが不正です");
    }
  }
    */
//}

</script>