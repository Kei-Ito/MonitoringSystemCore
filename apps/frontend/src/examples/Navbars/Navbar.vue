<template>
  <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" v-bind="$attrs" id="navbarBlur"
    data-scroll="true" :class="isAbsolute ? 'mt-4' : 'mt-0'">
    <div class="px-3 py-1 container-fluid">
      <li class="nav-item d-xl-none ps-3 d-flex align-items-center" style="margin-right: 50px; margin-left: -20px">
        <a href="#" @click="toggleSidebar" class="p-0 nav-link text-body lh-1 mt-2" id="iconNavbarSidenav">
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line" style="width: 25px; margin-bottom: 4px;"></i>
            <i class="sidenav-toggler-line" style="width: 25px; margin-bottom: 4px;"></i>
            <i class="sidenav-toggler-line" style="width: 25px; margin-bottom: 4px;"></i>
          </div>
        </a>
      </li>
      <breadcrumbs :currentPage="currentRouteName" :color="props.color" />
      <div class="d-flex flex-grow-1 align-items-center justify-content-center gap-3 py-2"
        v-if="currentRouteName === 'Dashboard' || currentRouteName === 'Trend'">
        <!-- 照射炉選択（カテゴリ1）のマルチセレクト -->
        <div class="multiselect-container">
          <multiselect v-model="selectedCategory1" :options="category1List" :multiple="false" :close-on-select="true"
            :clear-on-select="false" :allow-empty="false" :preserve-search="true" placeholder="" :preselect-first="false">
          </multiselect>
        </div>

        <!-- 測定項目選択（カテゴリ2）のマルチセレクト -->
        <div class="multiselect-container">
          <multiselect v-model="selectedCategory2" :options="category2List" :multiple="true" :close-on-select="false"
            :clear-on-select="false" :preserve-search="true" placeholder="測定項目を選択" :preselect-first="false"
           >
            <template #selection="{ values }">
              <span class="multiselect-selected">
                {{ values.length === category2List.length ? `All` : `${values.length} 項目 選択中` }}
              </span>
            </template>
          </multiselect>
        </div>
      </div>
      <ToggleBtn v-model="isAdmin" class="mr-3" />
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar">
        <div class="pe-md-3 d-flex align-items-center" :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"></div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useUiStore } from "@/pinia/uiStore";
import ToggleBtn from "@/components/ToggleBtn.vue";
import Breadcrumbs from "../Breadcrumbs.vue";
import Multiselect from 'vue-multiselect';

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
  isAbsolute,
  isAdmin,
  category1List,
  category2List,
  dashboardViewCategory1Selected,
  dashboardViewCategory2Selected,
  trendViewCategory1Selected,
  trendViewCategory2Selected
} = storeToRefs(uiStore);

const currentRouteName = computed<string>(() => String(route.name ?? ""));

// 現在のルートに基づいて適切なカテゴリ選択を取得する computed プロパティ
const selectedCategory1 = computed({
  get() {
    if (currentRouteName.value === "Dashboard") {
      return dashboardViewCategory1Selected.value;
    } else if (currentRouteName.value === "Trend") {
      return trendViewCategory1Selected.value;
    }
    return [];
  },
  set(value) {
    if (currentRouteName.value === "Dashboard") {
      uiStore.dashboardViewCategory1Selected = value;
    } else if (currentRouteName.value === "Trend") {
      uiStore.trendViewCategory1Selected = value;
    }
  }
});

const selectedCategory2 = computed({
  get() {
    if (currentRouteName.value === "Dashboard") {
      return dashboardViewCategory2Selected.value;
    } else if (currentRouteName.value === "Trend") {
      return trendViewCategory2Selected.value;
    }
    return [];
  },
  set(value) {
    if (currentRouteName.value === "Dashboard") {
      uiStore.dashboardViewCategory2Selected = value;
    } else if (currentRouteName.value === "Trend") {
      uiStore.trendViewCategory2Selected = value;
    }
  }
});

const toggleSidebar = () => {
  uiStore.navbarMinimize();
};
// ルート変更時に選択状態を更新
watch(currentRouteName, () => {
  // selectedCategory1 と selectedCategory2 は computed プロパティなので自動的に更新される
}, { immediate: true });

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
.multiselect-container {
  width: 30vw;
  max-width: 200px;
}

/* Vue-Multiselect のスタイルカスタマイズ */
:deep(.multiselect) {
  border: 1px solid #929292;
  border-radius: 0.25rem;
}

:deep(.multiselect__tags) {
  border: none;
  background: white;
  padding: 0.375rem 0.75rem;
  min-height: 38px;
}

:deep(.multiselect__select) {
  height: 38px;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid #929292;
  border-top: none;
}

:deep(.multiselect__option--highlight) {
  background: #5e72e4;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background: #3a57e0;
}

:deep(.multiselect--active) {
  box-shadow: none;
}

:deep(.multiselect-selected) {
  font-size: 1.0rem;
}
</style>