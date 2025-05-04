<template>
  <nav
    class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
    :class="isAbsolute ? 'mt-4' : 'mt-0'"
  >
    <div class="px-3 py-1 container-fluid">
      <li
        class="nav-item d-xl-none ps-3 d-flex align-items-center"
        style="margin-right: 50px; margin-left: -20px"
      >
        <a
          href="#"
          @click="toggleSidebar"
          class="p-0 nav-link text-body lh-1 mt-2"
          id="iconNavbarSidenav"
        >
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line" style="width: 25px; margin-bottom: 4px;"></i>
            <i class="sidenav-toggler-line" style="width: 25px; margin-bottom: 4px;"></i>
            <i class="sidenav-toggler-line" style="width: 25px; margin-bottom: 4px;"></i>
          </div>
        </a>
      </li>
      <!-- TODO: 要修正箇所-->
      <breadcrumbs :currentPage="currentRouteName" :color="props.color" />
      <div class="d-flex flex-grow-1  align-items-center justify-content-center gap-3 py-2">
        <select  class="form-select fs-4 select-with-border"  >
          <option class="fs-6" style="text-align: center">
            照射炉1
          </option>
          <option class="fs-6" style="text-align: center">
            照射炉2
          </option>
          <option class="fs-6" style="text-align: center">
            照射炉3
          </option>
        </select>
        <select class="form-select fs-4 select-with-border">
          <option class="fs-6" style="text-align: center">
            All
          </option>
          <option class="fs-6" style="text-align: center">
            液温
          </option>
          <option class="fs-6" style="text-align: center">
            UV強度
          </option>
          <option class="fs-6" style="text-align: center">
            炉内温度
          </option>
          <option class="fs-6" style="text-align: center">
            ランプ電圧
          </option>
          <option class="fs-6" style="text-align: center">
            ランプ電流
          </option>
          <option class="fs-6" style="text-align: center">
            安定器電流
          </option>
          <option class="fs-6" style="text-align: center">
            冷却ファン周波数
          </option>
        </select>
      </div>
      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        ></div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useUiStore } from "@/pinia/uiStore";
import Breadcrumbs from "../Breadcrumbs.vue";

/* Props */
const props = defineProps({
  color: String,
});

const uiStore = useUiStore();

/* Route */
const route = useRoute();

/* Computed Properties */
const { 
  isRTL,
  isAbsolute
} = storeToRefs(uiStore);

const currentRouteName = computed<string>(() => String(route.name ?? ""));

const toggleSidebar = () => {
  uiStore.navbarMinimize();
};

</script>
<style scoped>
/* 「常に」同じ見た目にしたいので :focus の上書きも忘れずに */
.select-with-border,
.select-with-border:focus {
  border: 1px solid #929292;
  /* 好きな色と太さに変更 */
  box-shadow: none;
  /* フォーカス時の青い影を消すなら */
  width: 30vw;
  max-width: 200px;
  /* 幅を指定 */

}
</style>