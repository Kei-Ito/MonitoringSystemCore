<template>
    <div >
        <!-- 時間を入力 -->
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center" style="flex-direction: column;">
                <small>{{ $t('system_settings.clock.hour') }}</small>
                <label >{{timeHoursStr}}</label>
            </div>
            <!-- コロン -->
            <label style="align-self: flex-end;">:</label>
            <div class="d-flex align-items-center" style="display: flex; flex-direction: column; align-items: center;">
                <small>{{ $t('system_settings.clock.minute') }}</small>
                <label >{{timeMinutesStr}}</label>
            </div>
            <!-- コロン -->
            <label style="align-self: flex-end;">:</label>
            <div class="d-flex align-items-center" style="display: flex; flex-direction: column; align-items: center;">
                <small>{{ $t('system_settings.clock.second') }}</small>
                <label >{{timeSecondsStr}}</label>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useMonitoringStore } from "@/pinia/monitoringStore";

const monitoringStore = useMonitoringStore();

const { samplingInterval } = storeToRefs(monitoringStore);

const timeHoursStr = computed(() => {
    const hours = Math.floor(samplingInterval.value/1000 / 3600);
    return hours.toString().padStart(2, "0");
});

const timeMinutesStr = computed(() => {
    const minutes = Math.floor(((samplingInterval.value/1000) % 3600) / 60);
    return minutes.toString().padStart(2, "0");
});

const timeSecondsStr = computed(() => {
    const seconds = (samplingInterval.value/1000) % 60;
    return seconds.toString().padStart(2, "0");
});
</script>
<style scoped>

label {
    font-size: 1.2rem;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
}

small {
    font-size: 0.7rem;
}
</style>