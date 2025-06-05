<template>
  <router-link
    :data-bs-toggle="props.collapse ? 'collapse' : ''"
    :to="props.collapse ? `#${props.collapseRef}` : props.collapseRef"
    :aria-controls="props.collapseRef"
    :aria-expanded="isExpanded"
    class="nav-link"
    :class="getRoute() === props.collapseRef ? `active bg-gradient-${color}` : ''"
    v-bind="$attrs"
    @click="isExpanded = !isExpanded"
  >
    <div
      class="text-center d-flex align-items-center justify-content-center"
      :class="isRTL ? 'ms-2' : 'me-2'"
    >
      <slot name="icon"></slot>
    </div>
    <div class="d-flex align-items-center justify-content-between">
      <!-- 左側のテキスト -->
      <span class="nav-link-text" :class="isRTL ? 'me-1' : 'ms-1'">
        {{ props.navText }}
      </span>

      <!-- 右側のテキスト -->
      <span
        class="nav-link-text"
        style="color: red; font-weight: bold; text-align: right;"
        :class="isRTL ? 'me-1' : 'ms-1'"
      >
        Preview
      </span>
    </div>
  </router-link>
  <div :class="isExpanded ? 'collapse show' : 'collapse'">
    <slot name="list"></slot>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useUiStore } from "@/pinia/uiStore";

/* Props */
const props = defineProps({
  collapseRef: {
    type: String,
    required: true,
  },
  navText: {
    type: String,
    required: true,
  },
  collapse: {
    type: Boolean,
    default: true,
  },
});

/* Reactive State */
const isExpanded = ref(false);

const uiStore = useUiStore();
const { isRTL , color } = storeToRefs(uiStore);

/* Route */
const route = useRoute();

/* Methods */
function getRoute() {
  const routeArr = route.path.split("/");
  return routeArr[1];
}
</script>
