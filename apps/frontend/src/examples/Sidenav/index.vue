<template>
  <aside id="sidenav-main" class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl my-3 ms-3 d-flex flex-column flex-nowrap"
    :class="[`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3' 
      } ${sidebarType}`, isDarkMode ? 'dark-version ' : '']" >
    <!-- header -->
    <div class="sidenav-header d-flex align-items-center justify-content-between" style="height: 65px;">
      <a class="m-0 navbar-brand ">
        <span class="font-weight-bold text-white " style="font-size: 27px;">UV Monitor</span>
      </a>
      <a class=" nav-item d-xl-none btn d-flex align-items-center nav-linklh-1"
        style="margin-left: -30px;;margin-top:12px" @click="toggleSidebar" id="iconNavbarSidenav">
        <i class="material-icons-outlined" style="color:white;font-size:30px">close</i>
      </a>
    </div>

    <hr class="horizontal light mt-0 mb-2" />

     <!-- 中身：可変部分をスクロールできるようにする -->
    <div class="flex-grow-1 overflow-auto custom-scrollbar-area w-100">
      <sidenav-list />
    </div>

    <!-- フッター：サイドバー下に固定し、必要に応じてスクロール対象外にする -->
    <div class="sidenav-footer w-100 mt-auto">
      <MonitoringView/>
    </div>
  </aside>
</template>
<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useUiStore } from "@/pinia/uiStore";
import MonitoringView from "@/components/MonitoringView.vue";
import SidenavList from '@/examples/Sidenav/SidenavList.vue';

const uiStore = useUiStore();

const{
  isDarkMode,
  isRTL,
  sidebarType,
} = storeToRefs(uiStore);

function toggleSidebar() {
  uiStore.toggleSidebar();
}


</script>
<style scoped>
#sidenav-main {
  z-index: 1030; /* Bootstrapのモーダルが 1050 なので、それより低く */
}

/* 
  ↓ スクロールバーのカスタマイズ 
  今回は「.custom-scrollbar-area」クラス下のoverflow要素に対して適用。
  フラットで細め、ホバーすると少し色が濃くなる例です。
*/
.custom-scrollbar-area::-webkit-scrollbar {
  width: 8px;               /* スクロールバーの太さ */
}
.custom-scrollbar-area::-webkit-scrollbar-track {
  background: transparent;  /* スクロールバーのトラック部分 */
}
.custom-scrollbar-area::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* サムのデフォルト色 */
  border-radius: 4px;                         /* 角丸にする */
  border: 1px solid transparent;              /* 内側に余白を作る感じ */
}

/* ホバー時にちょっと濃くする例 */
.custom-scrollbar-area::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dark-version{
  border: 1px solid #ffffff31;   
    box-shadow: 0 0 10px 3px rgba(58, 178, 255, 0.3) !important;
}


</style>
