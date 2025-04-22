<template>
  <div>
    <div class="card my-4">
      <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
        <div class="border-radius-lg pt-4 pb-3" :class="`bg-gradient-${color} shadow-${color}`">
          <h6 class="text-white text-capitalize ps-3">IO Modules</h6>
        </div>
      </div>
      <div class="card-body px-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Name
                </th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Status
                </th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Created
                </th>
                <th class="text-secondary opacity-7"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(io_module, index) in ioModules" :key="index">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div>
                      <img :src="getModuleImage(io_module.module_type)"
                        class="avatar avatar-md me-3 border-radius-lg" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ io_module.module_name }}</h6>
                      <p class="text-xs text-secondary mb-0">
                        {{ io_module.module_type }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="badge badge-md p-2" :class="getIOModuleStatus(io_module.status)"
                    style="font-size: 1.2em; width: 100px; display: inline-block;">
                    {{ io_module.status }}</span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">{{ formatDate(io_module.created_at)
                    }}</span>
                </td>
                <td class="align-middle text-center">
                  <a class="btn btn-link text-dark px-3 mb-0 " @click="openIOModuleEditModal(io_module)">
                    <i class="material-icons-round" aria-hidden="true">edit</i>
                  </a>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="text-start">
                  <a class="btn bg-transparent border-0 d-flex flex-column justify-content-center"
                    @click="openIOModuleAddModal">
                    <div class="d-flex items-center justify-center  items-center">
                      <i class="material-icons me-2" style="font-size:25px;">add</i>
                      <p class="text-muted mb-0 flex" style="font-size: 1.0em;">モジュールを追加</p>
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <IOModuleEditModal :visible="isEditModalVisible" :module="selectedModule" @close="closeEditModal"/>
    <IOModuleAddModal :visible="isAddModalVisible" @close="closeAddModal" @add="handleAdd" />
  </div>
</template>
<script lang="ts" setup>
import { useStore } from "vuex";
import IOModuleEditModal from '@/components/IOModuleEditModal.vue';
import IOModuleAddModal from "@/components/IOModuleAddModal.vue";
import { IOModuleTypeImages } from "@/enum/IOModuleTypeImages";
import { IOModuleStatus,IOModuleTypes } from "@monitoring/shared/enum";
import type { IOModule } from "@monitoring/shared/model";
import { ref,computed } from "vue";




    const store = useStore();

    // data相当
    const isEditModalVisible = ref<boolean>(false);
    const isAddModalVisible = ref<boolean>(false);
    const selectedModule = ref<IOModule | null>(null);

    // computed相当（storeのstateをcomputedでラップ）
    const ioModules = computed(() => store.state.systemSetting.ioModules);
    const color = computed(() => store.state.systemSetting.color);

    // methods相当（Vuexアクションはstore.dispatchで呼び出し）
    const openIOModuleEditModal = (module:IOModule) => {
      selectedModule.value = { ...module };
      isEditModalVisible.value = true;
    };

    const closeEditModal = () => {
      isEditModalVisible.value = false;
    };

    const getIOModuleStatus = (status: IOModuleStatus) => {
      if (status === IOModuleStatus.Active) {
        return 'bg-gradient-success';
      } else if (status === IOModuleStatus.Inactive) {
        return 'bg-gradient-danger';
      }else if (status === IOModuleStatus.Unknown) {
        return 'bg-gradient-secondary';
      }


      return status;
    };

    const openIOModuleAddModal = () => {
      isAddModalVisible.value = true;
    };

    const closeAddModal = () => {
      isAddModalVisible.value = false;
    };

    const handleAdd = (newModule: IOModule) => {
      store.dispatch('addIOModule', newModule);
      closeAddModal();
    };

    const getModuleImage = (type: IOModuleTypes) => {
      const module = IOModuleTypeImages.find(m => m.module_type === type.toString());
      return module ? module.image : '';
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    // 必要に応じてstore.dispatch('getIOModules')などで初期データ取得可能
    // mounted相当はonMountedフックを使用可能（必要な場合のみ）
    // onMounted(() => {
    //   store.dispatch('getIOModules');
    // });


</script>