<template>
  <router-link
    :data-bs-toggle="props.collapse ? 'collapse' : ''"
    :to="collapse ? `#${props.collapseRef}` : props.collapseRef"
    :aria-controls="props.collapseRef"
    :aria-expanded="isExpanded"
    class="nav-link"
    :class="getRoute() === props.collapseRef ? `active bg-gradient-${color}` : ''"
    v-bind="$attrs"
    @click="isExpanded = !isExpanded"
  >
    <div
      class="text-center d-flex align-items-center justify-content-center"
      :class="isRTL ? ' ms-2' : 'me-2'"
    >
      <slot name="icon"></slot>
    </div>
    <span class="nav-link-text" :class="isRTL ? ' me-1' : 'ms-1'">{{
      props.navText
    }}</span>
  </router-link>
  <div :class="isExpanded ? 'collapse show' : 'collapse'">
    <slot name="list"></slot>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { useRoute } from "vue-router"; 
import { ref,computed } from "vue";


const props = defineProps({
  collapseRef: {
    type: String,
    required: true
  },
  navText: {
    type: String,
    required: true
  },
  collapse: {
    type: Boolean,
    default: true
  }
});

const store = useStore();
const route = useRoute();

const color = computed(() => store.state.systemSetting.color);
const isRTL = computed(() => store.state.systemSetting.isRTL);

const isExpanded = ref(false);

function getRoute() {
  const routeArr = route.path.split("/");
  return routeArr[1];
}

</script>
