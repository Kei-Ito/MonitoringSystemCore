<template>
  <!-- メインコンテンツ (ロード完了後に表示、スプラッシュの下に配置) -->
  <div v-if="!isLoading || isSplashVisible">
    <sidenav 
      :custom_class="color" 
      :class="[
        isRTL ? 'fixed-end' : 'fixed-start',
        { 'splash-hidden-content': isSplashVisible }
      ]" 
      v-if="showSidenav" 
    />
    <main class="main-content position-relative max-height-vh-100 h-100 overflow-x-hidden d-flex flex-column">
      <!-- nav -->
      <navbar 
        ref="navbarRef"
        :class="[isNavFixed ? navbarFixed : '', isAbsolute ? absolute : '']"
        :minNav="navbarMinimize" 
        v-if="showNavbar"
        @show-date-range-picker="handleShowDateRangePicker" 
      />
      <div class="flex-grow-1">
        <router-view v-slot="{ Component }">
          <keep-alive include="Trend,Dashboard">
            <component :is="Component" @update-navbar-date-range="updateNavbarDateRange" @update-navbar-loading="updateNavbarLoading" />
          </keep-alive>
        </router-view>
      </div>
      <app-footer v-show="showFooter" />
    </main>
  </div>

  <!-- スプラッシュウィンドウ (最前面) -->
  <splash-window 
    v-if="isSplashVisible" 
    :is-finishing="!isLoading && !showAsError"
    :is-error="showAsError"
    @animation-end="onSplashAnimationEnd"
  />

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
import { onMounted, onUnmounted, ref, computed } from "vue";

import SplashWindow from "@/components/SplashWindow.vue";
import AppFooter from "@/components/PageLayout/Footer.vue";
import Navbar from "@/components/PageLayout/Navbars/Navbar.vue";
import Sidenav from "@/components/PageLayout/Sidenav/index.vue";
import DriveMountWarningModal from "@/components/DriveMountWarningModal.vue";
import { useUiStore } from "@/pinia/uiStore";
import { useAppInitializer } from '@/composables/useAppInitializer';
import { showDriveMountWarning, driveMountPath } from '@/composables/useWebSocket';
import { shutdownSystem } from '@/api';
import { useToast } from "vue-toastification";

const uiStore = useUiStore()
const { isLoading, isError, initialize } = useAppInitializer();
const toast = useToast();

const isSplashVisible = ref(true);
const isOffline = ref(!navigator.onLine);

// サーバーエラーまたはオフラインの場合にエラー表示とする
const showAsError = computed(() => isError.value || isOffline.value);

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

function onSplashAnimationEnd() {
  isSplashVisible.value = false;
}

// オンライン/オフライン状態の監視
const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine;
  if (!isOffline.value && isLoading.value) {
    // オフラインから復帰し、まだロード中の場合は初期化を再試行
    initialize();
  }
};

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

function updateNavbarLoading(loading: boolean) {
  if (navbarRef.value) {
    navbarRef.value.setIsLoading(loading);
  }
}

onMounted(async () => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  const sidenav = document.getElementsByClassName("g-sidenav-show")[0];

  if (window.innerWidth > 1200) {
    sidenav.classList.add("g-sidenav-pinned");
  }
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
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
<style>
/* スプラッシュ表示中はサイドバーの中身を隠す（大画面のみ） */
@media (min-width: 1200px) {
  .sidenav.splash-hidden-content > * {
    opacity: 0;
  }

  /* クラスが外れたらフェードイン */
  .sidenav:not(.splash-hidden-content) > * {
    opacity: 1;
    transition: opacity 0.8s ease-out;
  }
}
</style>