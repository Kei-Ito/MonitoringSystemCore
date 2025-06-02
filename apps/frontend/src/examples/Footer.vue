<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div class="text-sm text-center copyright text-muted" :class="isRTL ? 'text-lg-end' : 'text-lg-start'">
            ©
            <a href="https://www.tlt.co.jp/tlt/index_j.htm" class="font-weight-bold" target="_blank">
              {{ currentYear }}, Toshiba Lighthing & Technology Corp
            </a>

            provided by
            <a href="https://www.tlt.co.jp/tlt/products/industrial_light/industrial_light.htm" class="font-weight-bold"
              target="_blank">
              UV Technology Department</a>
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