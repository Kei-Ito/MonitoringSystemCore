<template>
  <div class="modal" role="dialog" v-if="props.show">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Select Data</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- ioModules ごとに表示 -->
          <div v-for="(module, mIndex) in ioModules" :key="mIndex" class="mb-3 module-container">

            <!-- モジュール名 -->
            <p class="fs-5 fw-bold mb-2">
              {{ module.module_name }}
            </p>

            <!-- チャンネルを Bootstrap のグリッドで表示 -->
            <div class="row g-3">
              <div
                class="col-12 col-sm-6 col-md-4 col-lg-3"
                v-for="(channel, cIndex) in module.input_channels"
                :key="cIndex"
              >
                <ChannelView
                  :channel_uuid="channel.channel_uuid"
                  :name="channel.channel_name"
                  @channel-selected="on_channel_selected"
                />
              </div>
            </div>

          </div> <!-- /v-for (module) -->
        </div><!-- /modal-body -->
        <div class="modal-footer">
        </div>
      </div><!-- /modal-content -->
    </div><!-- /modal-dialog -->
  </div><!-- /modal -->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMonitoringStore } from "@/pinia/monitoringStore";
import { useChartStore } from "@/pinia/chartStore";
import ChannelView from "@/components/ChannelView.vue";

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close-channel-picker']);

const monitoringStore = useMonitoringStore();
const chartStore = useChartStore();

const {ioModules} = storeToRefs(monitoringStore);
const {trendChartSettings} = storeToRefs(chartStore);

//TODO: Trendは複数表示する仕様になったので要変更箇所
function on_channel_selected(channel_uuid: string) {
  trendChartSettings.value[0].channel_uuids[0] = channel_uuid;
  emit('close-channel-picker');
}

function closeModal() {
  emit('close-channel-picker');
}
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-dialog {
  max-width: 900px;
  width: 80%;
}

.modal-body {
  background-color: #ededed;
  overflow-y: auto;
  max-height: 70vh;
}

.modal-footer {
  background-color: #ededed;
}

.module-container {
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
}

/* 画面幅が狭い場合の例 (Bootstrapとは別に独自指定するなら) */
@media (max-width: 770px) {
  .col-xs-6 {
    flex: 0 0 50%;
    max-width: 50%;
    margin: 0;
  }
}
</style>
