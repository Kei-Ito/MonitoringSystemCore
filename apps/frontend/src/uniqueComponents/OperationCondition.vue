<template>
    <div class="container-fluid" style="min-height: 60vh;">
        <div class="mt-4 row  device-health-row">
            <!-- 照射炉1の状態表示 -->
            <div class="col-sm-4">
                <DeviceHealthCard :title="allDeviceHealthStatuses[0].name" :deviceHealth="allDeviceHealthStatuses[0].status" />
            </div>
            <!-- 照射炉2の状態表示 -->
            <div class="col-sm-4">
                <DeviceHealthCard :title="allDeviceHealthStatuses[1].name" :deviceHealth="allDeviceHealthStatuses[1].status" />
            </div>
            <!-- 照射炉3の状態表示 -->
            <div class="col-sm-4">
                <DeviceHealthCard :title="allDeviceHealthStatuses[2].name" :deviceHealth="allDeviceHealthStatuses[2].status" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChannelValuesStore } from '@/pinia/channelValuesStore'
import DeviceHealthCard from './DeviceHealthCard.vue';

const { allDeviceHealthStatuses } = storeToRefs(useChannelValuesStore());

</script>
<style scoped>
.device-health-row {
    --bs-gutter-x: 0.5rem;
}

</style>