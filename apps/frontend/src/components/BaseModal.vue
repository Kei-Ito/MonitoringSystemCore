<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click.self="close">
        <div class="modal-dialog" :class="dialogClass" :style="{ maxWidth: maxWidth }">
          <div class="modal-content shadow-lg">
            
            <!-- Header -->
            <div class="modal-header text-white bg-gradient-primary">
              <slot name="header">
                <h5 class="modal-title fw-bold">{{ title }}</h5>
              </slot>
              <button type="button" class="btn-close" @click="close" aria-label="Close">
                <span class="close-icon material-icons">close</span>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body custom-scrollbar">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
            
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '500px'
  },
  size: {
    type: String,
    default: '' // 'modal-lg', 'modal-xl', 'modal-sm'
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const dialogClass = computed(() => {
  return props.size ? props.size : '';
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px); /* すりガラス効果 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050; /* Bootstrap modal z-index */
  transition: opacity 0.3s ease;
}

.modal-dialog {
  width: 100%;
  margin: 1.75rem;
  transition: all 0.3s ease;
}

.modal-content {
  border: none;
  border-radius: 12px; /* 角丸を少し大きく */
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  /* Material Dashboard っぽいグラデーション背景の例 */
  background: linear-gradient(87deg, #42424a 0, #191919 100%) !important;
  color: white !important;
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.modal-header .modal-title {
  color: white !important;
}

.close-icon {
  font-size: 1.5rem;
  color: white;
  line-height: 1;
}

.btn-close {
  background: transparent;
  border: none;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  max-height: 65vh;
  overflow-y: auto;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
}

/* Transition Styles */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* バウンス効果 */
}

/* Custom Scrollbar for modal body */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
