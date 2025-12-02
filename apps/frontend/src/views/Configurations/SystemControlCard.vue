<template>
  <div class="card my-4">
    <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
      <div class="border-radius-lg pt-4 pb-3" :class="`bg-gradient-${color} shadow-${color}`">
        <h6 class="text-white text-capitalize ps-3">{{ $t('system_control.title') }}</h6>
      </div>
    </div>
    <div class="card-body px-4 pb-4">
      <p class="text-sm mb-4">{{ $t('system_control.description') }}</p>
      
      <div class="d-flex gap-3 justify-content-center">
        <button  
          class="btn btn-outline-warning btn-lg d-flex align-items-center justify-content-center system-control-btn"
          @click="handleReboot"
          :disabled="isProcessing"
          style="width: 200px;"
        >
          <i class="material-icons me-2 btn-icon">restart_alt</i>
          <span class="btn-text">{{ $t('system_control.reboot') }}</span>
        </button>
        
        <button  
          class="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center system-control-btn"
          @click="handleShutdown"
          :disabled="isProcessing"
          style="width: 200px;"
        >
          <i class="material-icons me-2 btn-icon">power_settings_new</i>
          <span class="btn-text">{{ $t('system_control.shutdown') }}</span>
        </button>
      </div>

      <!-- 確認モーダル -->
      <BaseModal
        :show="showConfirmModal"
        :title="confirmTitle"
        size="modal-md"
        @close="cancelAction"
      >
        <div class="d-flex align-items-start mb-3">
          <i class="material-icons text-warning me-3" style="font-size: 48px;">warning</i>
          <p class="mb-0" style="font-size: 1.1rem;">{{ confirmMessage }}</p>
        </div>

        <template #footer>
          <button 
            type="button" 
            :class="actionType === 'shutdown' ? 'btn btn-danger' : 'btn btn-warning'"
            @click="confirmAction"
            :disabled="isProcessing"
            style="width: 150px;"
          >
            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
            {{ confirmButtonText }}
          </button>
          <button 
            type="button" 
            class="btn btn-secondary"
            @click="cancelAction"
            :disabled="isProcessing"
            style="width: 110px;"
          >
            {{ $t('system_control.cancel') }}
          </button>
        </template>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useUiStore } from '@/pinia/uiStore';
import { shutdownSystem, rebootSystem } from '@/api/systemAPI';
import BaseModal from '@/components/BaseModal.vue';

const { t } = useI18n();
const toast = useToast();
const uiStore = useUiStore();
const { color } = storeToRefs(uiStore);

const showConfirmModal = ref(false);
const actionType = ref<'shutdown' | 'reboot'>('shutdown');
const isProcessing = ref(false);

const confirmTitle = computed(() => {
  return actionType.value === 'shutdown' 
    ? t('system_control.confirm_shutdown_title')
    : t('system_control.confirm_reboot_title');
});

const confirmMessage = computed(() => {
  return actionType.value === 'shutdown'
    ? t('system_control.confirm_shutdown_message')
    : t('system_control.confirm_reboot_message');
});

const confirmButtonText = computed(() => {
  if (isProcessing.value) {
    return actionType.value === 'shutdown'
      ? t('system_control.shutting_down')
      : t('system_control.rebooting');
  }
  return actionType.value === 'shutdown'
    ? t('system_control.confirm_shutdown')
    : t('system_control.confirm_reboot');
});

function handleReboot() {
  actionType.value = 'reboot';
  showConfirmModal.value = true;
}

function handleShutdown() {
  actionType.value = 'shutdown';
  showConfirmModal.value = true;
}

function cancelAction() {
  if (!isProcessing.value) {
    showConfirmModal.value = false;
  }
}

async function confirmAction() {
  isProcessing.value = true;
  
  try {
    const result = actionType.value === 'shutdown' 
      ? await shutdownSystem()
      : await rebootSystem();

    if (result.ok) {
      const successMessage = actionType.value === 'shutdown'
        ? t('system_control.shutdown_success')
        : t('system_control.reboot_success');
      
      toast.success(successMessage);
      showConfirmModal.value = false;
    } else {
      const errorMessage = actionType.value === 'shutdown'
        ? t('system_control.shutdown_error')
        : t('system_control.reboot_error');
      
      toast.error(`${errorMessage}: ${result.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    const errorMessage = actionType.value === 'shutdown'
      ? t('system_control.shutdown_error')
      : t('system_control.reboot_error');
    
    toast.error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    isProcessing.value = false;
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 1rem;
}

.system-control-btn {
  padding: 0.75rem 1.25rem;
}

.btn-icon {
  font-size: 28px !important;
}

.btn-text {
  font-size: 1rem;
  font-weight: 700;
}
</style>
