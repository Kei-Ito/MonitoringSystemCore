<template>
  <BaseModal
    :show="props.show"
    title="Select Data"
    size="modal-xl"
    maxWidth="900px"
    @close="closeModal"
  >
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
            @channel-selected="onChannelSelected"
          />
        </div>
      </div>

    </div> <!-- /v-for (module) -->
  </BaseModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import BaseModal from "@/components/BaseModal.vue";
import ChannelView from "@/components/ChannelView.vue";
import { useChartStore } from "@/pinia/chartStore";
import { useMonitoringStore } from "@/pinia/monitoringStore";

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close-channel-picker']);

const monitoringStore = useMonitoringStore();
const chartStore = useChartStore();

const {ioModules} = storeToRefs(monitoringStore);
const {trendCharts} = storeToRefs(chartStore);

//TODO: Trendは複数表示する仕様になったので要変更箇所
function onChannelSelected(channelUuid: string) {
  trendCharts.value[0].channel_uuids[0] = channelUuid;
  emit('close-channel-picker');
}

function closeModal() {
  emit('close-channel-picker');
}
</script>

<style scoped>
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
