<template>
    <div class=" container-fluid" style="min-height: 80vh;">
        <div class="mt-4 row">
            <DeviceHealthCard class="col-sm-4" title="照射炉 1" :deviceHealth="DeviceHealthEnum.Good" />
            <DeviceHealthCard class="col-sm-4" title="照射炉 2" :deviceHealth="DeviceHealthEnum.Caution" />
            <DeviceHealthCard class="col-sm-4" title="照射炉 3" :deviceHealth="DeviceHealthEnum.Error" />
        </div>
    </div>
</template>
<script setup lang="ts">
import DeviceHealthCard from './DeviceHealthCard.vue';
 import { DeviceHealthEnum } from '@/uniqueComponents/DeviceHealthEnum'

</script>
<style scoped></style>