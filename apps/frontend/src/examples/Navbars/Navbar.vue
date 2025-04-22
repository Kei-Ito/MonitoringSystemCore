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
      <breadcrumbs :currentPage="currentRouteName" :color="props.color" />
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
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";

/* Props */
const props = defineProps({
  color: String,
});

/* Vuex Store */
const store = useStore();

/* Route */
const route = useRoute();

/* Computed Properties */
const isRTL = computed(() => store.state.systemSetting.isRTL);
const isAbsolute = computed(() => store.state.systemSetting.isAbsolute);
const currentRouteName = computed(() => route.name);

const toggleSidebar = () => {
  store.commit("navbarMinimize");
};

</script>
