<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <SystemSettingTable />
      </div>
      <div class="col-lg-6 col-md-12">
        <IOModuleTable />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-6 col-md-12">
        <SystemControlCard />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import IOModuleTable from "@/views/Configurations/IOModuleTable.vue";
import SystemSettingTable from "@/views/Configurations/SystemSettingTable.vue";
import SystemControlCard from "@/views/Configurations/SystemControlCard.vue";
</script>
<style scoped>
button:focus,
button:active {
  outline: none;
  border: none;
}

button {
  border: none;
  width: 100%;
}
</style>
