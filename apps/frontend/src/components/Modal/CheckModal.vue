<template>
  <BaseModal
    :show="visible"
    :title="Title"
    size="modal-lg"
    maxWidth="80%"
    @close="confirm(false)"
  >
    <!-- Body -->
    <div>
      <div class="form-group row">
        <pre class="col-form-label my-3 text-dark">{{ Body }}</pre>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <button type="button" class="btn btn-primary" @click="confirm(true)" style="width: 110px;">
        {{ updateText }}
      </button>
      <button type="button" class="btn btn-secondary" @click="confirm(false)" style="width: 110px;">
        {{ cancelText }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseModal from "@/components/BaseModal.vue";

const visible = ref(false);
const Title = ref<string>('');
const Body = ref<string>('');
const updateText = ref<string>('');
const cancelText = ref<string>('');
// Promise の resolveを保持する変数
let resolvePromise:any = null;


function showModal(title: string, body: string, update:string, cancel: string) {
  Title.value = title;
  Body.value = body;
  updateText.value = update;
  cancelText.value = cancel;
  visible.value = true;

  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function confirm(result: boolean) {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(result);
    resolvePromise = null;
  }
}

defineExpose({
  showModal,
});
</script>
