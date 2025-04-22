<template>
  <nav aria-label="breadcrumb">
    <ol
      class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb"
      :class="isRTL ? '' : ' me-sm-6'"
    >
      <li class="text-sm breadcrumb-item" :class="props.color">
        <a v-if="isRTL" :class="props.color" class="opacity-5 ps-2" href="#"
          >لوحات القيادة</a
        >
        <a v-else :class="props.color" class="opacity-8" href="#">Pages</a>
      </li>
      <li
        class="text-sm breadcrumb-item active"
        :class="props.color"
        aria-current="page"
      >
        {{ props.currentPage }}
      </li>
    </ol>
    <h6 class="mb-0 font-weight-bolder" :class="props.color">
      {{ props.currentPage }}
    </h6>
  </nav>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const isRTL  = computed(()=>store.state.systemSetting.isRTL);

const props = defineProps({
  currentPage: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "text-dark",
  },
});
</script>
