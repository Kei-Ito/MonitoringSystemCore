<template>
  <BaseModal 
    :show="show" 
    title="システムエラー" 
    maxWidth="600px"
    @close="handleClose"
  >
    <div class="warning-content">
      <div class="warning-icon-wrapper mb-4">
        <span class="material-icons warning-icon">warning</span>
      </div>
      
      <div class="alert alert-danger mb-4" role="alert">
        <h5 class="alert-heading fw-bold mb-3">
          <span class="material-icons align-middle me-2">error</span>
          データ保存用ドライブが認識されていません
        </h5>
        <hr>
        <p class="mb-0">
          データ保存用ドライブにアクセスできないため、システムは正常に動作しません。<br>
          ドライブを正しく接続し、システムを再起動してください。
        </p>
      </div>

      <div class="instructions">
        <h6 class="fw-bold mb-2">
          <span class="material-icons align-middle me-2">info</span>
          対処手順
        </h6>
        <ol class="mb-0">
          <li>データ保存用ドライブが正しく接続されているか確認してください</li>
          <li>正しく接続されていなかった場合、再接続後にシステムを再起動してください</li>
          <li>再起動後も認識されない場合、ドライブを別のPCへ接続し、動作を確認してください</li>
          <li>問題が解決しない場合は、システム管理者に連絡してください</li>
        </ol>
      </div>
    </div>

    <template #footer>
      <button 
        class="btn btn-danger d-flex align-items-center"
        @click="handleShutdown"
      >
        <span class="material-icons me-2">power_settings_new</span>
        システムをシャットダウン
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  drivePath: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'shutdown']);

const handleClose = () => {
  // ドライブ未マウント時はモーダルを閉じない
  // emit('close');
};

const handleShutdown = () => {
  emit('shutdown');
};
</script>

<style scoped>
.warning-content {
  text-align: center;
}

.warning-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.warning-icon {
  font-size: 4rem;
  color: #dc3545;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.alert {
  text-align: left;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.15);
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #2c2c2c;
}

.alert-heading {
  color: #1a1a1a;
  display: flex;
  align-items: center;
  font-weight: 700;
}

.alert p {
  color: #2c2c2c;
  font-weight: 500;
  line-height: 1.6;
}

.alert hr {
  border-color: #f5c2c7;
  opacity: 1;
}

.alert code {
  background-color: rgba(220, 53, 69, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #1a1a1a;
  font-weight: 600;
}

.instructions {
  text-align: left;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #17a2b8;
}

.instructions h6 {
  color: #17a2b8;
  display: flex;
  align-items: center;
}

.instructions ol {
  padding-left: 1.5rem;
}

.instructions ol li {
  margin-bottom: 0.5rem;
  color: #495057;
}

.btn-danger {
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.material-icons.align-middle {
  vertical-align: middle;
}
</style>
