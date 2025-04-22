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
  </div>

</template>

<script>

import SystemSettingTable from "./Configurations/SystemSettingTable.vue";
import IOModuleTable from "./Configurations/IOModuleTable.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "configurations",
  components: {
    SystemSettingTable,
    IOModuleTable
  },
});
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
