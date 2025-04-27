<template>
  <div class="card mt-2" :class="props.directionReverse ? reverseDirection : ''">
    <div class="card-header p-3 pt-2">
      <div
        class="icon icon-lg icon-shape shadow text-center border-radius-xl mt-n4 position-absolute"
        :class="`bg-gradient-${props.icon.background} shadow-${props.icon.background}`"
      >
        <i
          class="material-icons opacity-10"
          :class="props.icon.color"
          aria-hidden="true"
          >{{ props.icon.name }}</i
        >
      </div>
      <div class="pt-1" :class="isRTL ? 'text-start' : 'text-end'">
        <p class="text-sm mb-0 text-capitalize">{{ props.title.text }}</p>
        <h4 class="mb-0">{{ props.title.value }}</h4>
      </div>
    </div>
    <hr class="dark horizontal my-0" />
    <div class="card-footer p-3" :class="isRTL ? 'text-start' : 'text-end'">
      <!--  eslint-disable-next-line vue/no-v-html -->
      <p class="mb-0" v-html="props.detail"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useUiStore } from "@/pinia/uiStore";

const props = defineProps({
  title: {
    type: Object,
    required: true,
  },
  detail: {
    type: String,
    default: "",
  },
  icon: {
    type: Object,
    required: true,
    default: () => ({
      color: "text-white",
      background: "success",
    }),
  },
  directionReverse: {
    type: Boolean,
    default: false,
  },
});

const uiStore = useUiStore();

const { isRTL } = storeToRefs(uiStore);
const reverseDirection = ref("flex-row-reverse justify-content-between");

</script>
