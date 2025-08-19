<template>
    <div class=" container-fluid" style="min-height: 80vh;">
        <div class="mt-4 row">
            <DeviceHealthCard class="col-sm-4" :title="DeviceHealth[0].name" :deviceHealth="DeviceHealth[0].status" />
            <DeviceHealthCard class="col-sm-4" :title="DeviceHealth[1].name" :deviceHealth="DeviceHealth[1].status" />
            <DeviceHealthCard class="col-sm-4" :title="DeviceHealth[2].name" :deviceHealth="DeviceHealth[2].status" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChannelValuesStore } from '@/pinia/channelValuesStore'
import DeviceHealthCard from './DeviceHealthCard.vue';

const channelValuesStore = useChannelValuesStore()
const { DeviceHealth } = storeToRefs(channelValuesStore)

</script>
<style scoped></style>