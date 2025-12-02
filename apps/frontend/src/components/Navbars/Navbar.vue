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
      <div class="d-flex flex-grow-1 flex-wrap align-items-center justify-content-center gap-3 py-2"
        v-if="currentRouteName === 'Dashboard' || currentRouteName === 'Trend'">
        
        <!-- フィルタリンググループ（表示対象） -->
        <div class="control-card">
          <div class="control-card-label">
            <i class="material-icons-round fs-6 me-1">filter_alt</i>
            表示対象
          </div>
          <div class="d-flex gap-2 align-items-end">
            <!-- 照射炉選択（カテゴリ1）のマルチセレクト -->
            <div class="multiselect-wrapper">
              <multiselect v-model="selectedCategory1" :options="availableCategory1List" :multiple="false" :close-on-select="true"
                :clear-on-select="false" :searchable="false" :allow-empty="false" :preserve-search="false" selectLabel=""
                selectedLabel="" deselectLabel="" placeholder="Category1を選択" :preselect-first="false" :disabled="isLayoutEditMode">
                <!-- マルチセレクト時のテンプレート -->
                <template #selection>
                  <span class="multiselect-selected">
                    {{ selectedCategory1.length === 1
                      ? selectedCategory1[0]
                      : `${selectedCategory1.length} 項目 選択中` }}
                  </span>
                </template>

                <template #option="props">
                  <div class="option__desc d-flex align-items-center">
                    <span class="material-icons-round me-2 fs-5">
                      {{ isSelected(props.option, selectedCategory1) }}
                    </span>
                    <span class="option__title">{{ props.option }}</span>
                  </div>
                </template>
              </multiselect>
            </div>

            <!-- カテゴリ2のマルチセレクト -->
            <div class="multiselect-wrapper">
              <multiselect v-model="selectedCategory2" :options="availableCategory2List" :multiple="true" :close-on-select="false"
                :clear-on-select="false" :preserve-search="false" placeholder="" :searchable="false" selectLabel=""
                selectedLabel="" deselectLabel="" :preselect-first="false" :disabled="isLayoutEditMode">
                <!-- マルチセレクト時のテンプレート -->
                <template #selection="{ values }">
                  <span class="multiselect-selected">
                    {{ values.length === 1
                      ? values[0]
                      : `${values.length} 項目 選択中` }}
                  </span>
                </template>

                <!-- プルダウンのテンプレート -->
                <template #option="props">
                  <div class="option__desc d-flex align-items-center">
                    <span class="material-icons-round me-2 fs-5">
                      {{ isSelected(props.option, selectedCategory2) }}
                    </span>
                    <span class="option__title">{{ props.option }}</span>
                  </div>
                </template>
              </multiselect>
            </div>
          </div>
        </div>

        <!-- Trendページ専用: 日付範囲選択 -->
        <div v-if="currentRouteName === 'Trend'" class="control-card">
          <div class="control-card-label">
            <i class="material-icons-round fs-6 me-1">date_range</i>
            表示期間
          </div>
          <div class="date-range-wrapper">
            <!-- <div class="input-label">表示範囲</div> -->
            <button class="btn btn-outline-secondary btn-date-range d-flex align-items-center justify-content-center" @click="showDateRangePicker" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="material-icons me-2" style="font-size: 1.2rem;">calendar_month</i>
              <span class="date-range-text">{{ dateRangeText }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="isAdmin" class="d-flex align-items-center">
        <span class="nav-link text-body font-weight-bold px-0 me-2">レイアウト編集</span>
        <ToggleBtn v-model="isLayoutEditModeModel" class="mr-3" />
      </div>
    
      <!-- ユーザーログインアイコン -->
       <!--
       <router-link :to="{ name: 'SignIn' }" class="px-0 nav-link font-weight-bold lh-1"
          :class="color ? color : 'text-body'">
      <a class="btn border-0  bg-transparent">
        
          <i class="material-icons me-sm-1">
            account_circle
          </i>
        
      </a>
      </router-link>
      -->
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar">
        <div class="pe-md-3 d-flex align-items-center" :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"></div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, watch, ref } from "vue";
import Multiselect from 'vue-multiselect';
import { useRoute } from "vue-router";

import ToggleBtn from "@/components/ToggleBtn.vue";
import { useUiStore } from "@/pinia/uiStore";
import { useChartStore } from "@/pinia/chartStore";


/* Emits */
const emit = defineEmits<{
  'show-date-range-picker': [];
  'date-range-text': [string];
}>();

const uiStore = useUiStore();
const chartStore = useChartStore();

/* Route */
const route = useRoute();

/* Computed Properties */
const {
  isRTL,
  isAbsolute,
  isAdmin,
  isLayoutEditMode,
  category1List,
  category2List,
  dashboardViewCategory1Selected,
  dashboardViewCategory2Selected,
  trendViewCategory1Selected,
  trendViewCategory2Selected
} = storeToRefs(uiStore);

const currentRouteName = computed<string>(() => String(route.name ?? ""));

// 日付範囲テキスト（親コンポーネントから受け取る）
const dateRangeText = ref("今日");
const isLoading = ref(false);

// 現在のページに存在するカテゴリーのみを抽出する computed プロパティ
const availableCategory1List = computed(() => {
  const allCategories = category1List.value ?? [];
  let pageCharts: any[] = [];

  if (currentRouteName.value === 'Dashboard') {
    pageCharts = chartStore.uiLayouts.dashboard ?? [];
  } else if (currentRouteName.value === 'Trend') {
    pageCharts = chartStore.uiLayouts.trend ?? [];
  } else {
    return [];
  }

  // ページ内のチャートで使用されている category1 を収集
  const usedCategories = new Set(pageCharts.map(c => c.category1).filter(c => c));

  // 全リストのうち、使用されているものだけをフィルタリングして返す（順序維持のため）
  return allCategories.filter(cat => usedCategories.has(cat));
});

const availableCategory2List = computed(() => {
  const allCategories = category2List.value ?? [];
  let pageCharts: any[] = [];

  if (currentRouteName.value === 'Dashboard') {
    pageCharts = chartStore.uiLayouts.dashboard ?? [];
  } else if (currentRouteName.value === 'Trend') {
    pageCharts = chartStore.uiLayouts.trend ?? [];
  } else {
    return [];
  }

  // ページ内のチャートで使用されている category2 を収集
  const usedCategories = new Set(pageCharts.map(c => c.category2).filter(c => c));

  return allCategories.filter(cat => usedCategories.has(cat));
});

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
    uiStore.setCategory1Selected(value, currentRouteName.value);
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
    uiStore.setCategory2Selected(value, currentRouteName.value);
  }
});

const toggleSidebar = () => {
  uiStore.navbarMinimize();
};

const isSelected = (currentValue: any, value: any | any[]): string => {
  // 選択項目が配列の場合
  if (Array.isArray(value)) {
    if (Object.values(value).includes(currentValue)) {
      return "check_box";
    } else {
      return "check_box_outline_blank";
    }
    // 選択項目が配列でない場合
  } else if (typeof value === "string") {
    return currentValue === value ? "check_box" : "check_box_outline_blank";
  } else {
    return "";
  }
};

const showDateRangePicker = () => {
  emit('show-date-range-picker');
};

// 外部から日付範囲テキストを設定できるようにする
const setDateRangeText = (text: string) => {
  dateRangeText.value = text;
};

const setIsLoading = (loading: boolean) => {
  isLoading.value = loading;
};

const isLayoutEditModeModel = computed({
  get: () => isLayoutEditMode.value,
  set: () => uiStore.toggleLayoutEditMode()
});

// コンポーネント外から呼び出せるようにする
defineExpose({
  setDateRangeText,
  setIsLoading
});

// ルート変更時に選択状態を更新
watch(currentRouteName, () => {
  // selectedCategory1 と selectedCategory2 は computed プロパティなので自動的に更新される
}, { immediate: true });

</script>


<style scoped>
.control-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px 12px 8px 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #e0e0e0;
}

.control-card-label {
  font-size: 0.75rem;
  font-weight: bold;
  color: #6c757d;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.multiselect-wrapper {
  width: 30vw;
  max-width: 200px;
  display: flex;
  flex-direction: column;
}

.date-range-wrapper {
  min-width: 180px;
  max-width: 250px;
  display: flex;
  flex-direction: column;
}

.btn-date-range {
  width: 100%;
  height: 40px; /* ボタンの高さを固定 */
  padding: 0.375rem 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #929292; /* multiselectと同じボーダー色 */
  border-radius: 0.25rem;
  color: #35495e; /* multiselectのテキスト色に近づける */
  background-color: white;
  margin-bottom: 0; /* ボタンのデフォルトマージンを削除 */
}

.btn-date-range:hover {
  background-color: #f8f9fa;
  color: #35495e;
  border-color: #929292;
}

.date-range-text {
  font-size: 1.2rem; /* multiselect-selectedと同じサイズ */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  line-height: 1;
}

/* Vue-Multiselect のスタイルカスタマイズ */
:deep(.multiselect) {
  border: 1px solid #929292;
  border-radius: 0.25rem;
  min-height: 40px; /* 高さを固定 */
}

:deep(.multiselect__tags) {
  border: none;
  background: white;
  align-items: center;
  text-align: center;
  min-height: 38px; /* パディングを含めて40pxになるように調整 */
  padding-top: 6px;
}


:deep(.multiselect--active) {
  box-shadow: none;
}

:deep(.multiselect-selected) {
  font-size: 1.2rem;
  line-height: 1;
}

/* シングルラベルを非表示にするスタイルを追加 */
:deep(.multiselect__single) {
  display: none !important;
}
</style>