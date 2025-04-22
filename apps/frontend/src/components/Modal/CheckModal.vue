<template>
  <div class="modal" tabindex="-1" role="dialog" v-if="visible">
    <div class="modal-dialog" role="document" style="max-width: 80%;">
      <div class="modal-content">
        <div class="modal-header">
          <h5>{{ Title }}</h5>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
          <div>
            <div class="form-group row">
              <pre class="col-form-label my-3 text-dark">{{ Body }}</pre>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="confirm(true)" style="width: 110px;">
            {{ updateText }}
          </button>
          <button type="button" class="btn btn-secondary" @click="confirm(false)" style="width: 110px;">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
