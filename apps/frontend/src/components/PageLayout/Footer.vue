<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-12 mb-lg-0">
          <div class="text-sm text-center copyright text-muted" :class="isRTL ? 'text-lg-end' : 'text-lg-start'">
            © {{ currentYear }}, Toshiba Lighthing & Technology Corp
            provided by UV Technology Department
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useUiStore } from "@/pinia/uiStore";

const uiStore = useUiStore();
const { isRTL } = storeToRefs(uiStore);
const currentYear = new Date().getFullYear();
</script>