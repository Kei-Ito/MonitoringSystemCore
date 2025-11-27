<template>
  <!-- ローディング画面 -->
  <div v-if="isLoading" class="loading-container">
    <splash-window />
  </div>
  <div v-else>
    <sidenav :custom_class="color" :class="[isRTL ? 'fixed-end' : 'fixed-start']" v-if="showSidenav" />
    <main class="main-content position-relative max-height-vh-100 h-100 overflow-x-hidden">
      <!-- nav -->
      <navbar 
        ref="navbarRef"
        :class="[isNavFixed ? navbarFixed : '', isAbsolute ? absolute : '']"
        :minNav="navbarMinimize" 
        v-if="showNavbar"
        @show-date-range-picker="handleShowDateRangePicker" 
      />
      <router-view v-slot="{ Component }">
        <keep-alive include="Trend,Dashboard">
          <component :is="Component" @update-navbar-date-range="updateNavbarDateRange" />
        </keep-alive>
      </router-view>
      <app-footer v-show="showFooter" />
    </main>
  </div>

  <!-- ドライブマウント警告モーダル -->
  <drive-mount-warning-modal
    :show="showDriveMountWarning"
    :drivePath="driveMountPath"
    @shutdown="handleShutdown"
    @reload="handleReload"
  />

</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from "vue";

import SplashWindow from "@/components/SplashWindow.vue";
import AppFooter from "@/examples/Footer.vue";
import Navbar from "@/examples/Navbars/Navbar.vue";
import Sidenav from "@/examples/Sidenav/index.vue";
import DriveMountWarningModal from "@/components/DriveMountWarningModal.vue";
import { useUiStore } from "@/pinia/uiStore";
import { useAppInitializer } from '@/composables/useAppInitializer';
import { showDriveMountWarning, driveMountPath } from '@/composables/useWebSocket';
import { shutdownSystem } from '@/api';
import { useToast } from "vue-toastification";

const uiStore = useUiStore()
const { isLoading } = useAppInitializer();
const toast = useToast();

const navbarRef = ref<InstanceType<typeof Navbar> | null>(null);
let dateRangePickerCallback: (() => void) | null = null;

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

// Navbarから日付範囲選択ボタンがクリックされたときの処理
function handleShowDateRangePicker() {
  if (dateRangePickerCallback) {
    dateRangePickerCallback();
  }
}

// Trendページから日付範囲テキスト更新のリクエストを受け取る
function updateNavbarDateRange(payload: { text: string; callback?: () => void }) {
  if (navbarRef.value) {
    navbarRef.value.setDateRangeText(payload.text);
  }
  if (payload.callback) {
    dateRangePickerCallback = payload.callback;
  }
}

onMounted(async () => {
  const sidenav = document.getElementsByClassName("g-sidenav-show")[0];

  if (window.innerWidth > 1200) {
    sidenav.classList.add("g-sidenav-pinned");
  }
});

function navbarMinimize() {
  uiStore.navbarMinimize();
}

// システムシャットダウン処理
async function handleShutdown() {
  try {
    const result = await shutdownSystem();
    if (result.ok) {
      toast.info("システムをシャットダウンしています...", {
        timeout: 5000
      });
    } else {
      toast.error(`シャットダウンに失敗しました: ${result.error}`);
    }
  } catch (error) {
    console.error('Shutdown error:', error);
    toast.error("シャットダウンリクエストの送信に失敗しました");
  }
}

// 画面再読み込み処理
function handleReload() {
  // キャッシュを無視して強制的に再読み込み
  window.location.reload();
}

</script>