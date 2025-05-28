<template>

  <div
    class="page-header align-items-start min-vh-100"
    :style="{ backgroundImage: `url(${randomImage()})` }"
  >
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto bg-tran">
          <div class="mb-2 ">

              <router-link
                :to="{ name: 'Dashboard' }"
                class="btn text-white px-0 nav-link lh-1 d-inline-flex align-items-center"
              >
                <span class="material-icons-outlined opacity-10 me-2 fs-4">arrow_back</span>
                <span class="text-white fs-6">ゲストユーザーとして続行</span>
              </router-link>

          </div>
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
              <div
                class="bg-gradient-info shadow-secondary border-radius-lg py-3 pe-1"
              >
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                  Login
                </h4>
                <div class="row mt-3 text-center text-white bg-transparent">
                  <span >toshiba Lighting & technorogy</span>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form role="form" class="text-start mt-3">
                <div class="mb-3 border-radius-lg border-1 border">
                  <input 
                    class="form-control mx-2 fs-6"
                    type="text"
                    placeholder="Username"
                    />
                </div>
                <div class="mb-3 border-radius-lg border-1 border">
                  <input 
                    class="form-control mx-2 fs-6"
                    type="password"
                    placeholder="Password"
                    />
                </div>
                <div class="text-center">
                  <material-button
                    class="my-4 mb-2 main-color"
                    variant="gradient"
                    color="info"
                    fullWidth
                    >Login</material-button
                  >
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ---------- imports ---------- */
import { onMounted, onBeforeUnmount } from 'vue';
import { useUiStore } from '@/pinia/uiStore';
import { Images } from '@/enum/LoginImages';
import MaterialButton from '@/components/MaterialButton.vue';


/* ---------- component meta ---------- */
defineOptions({ name: 'sign-in' });

/* ---------- store & helpers ---------- */
const uiStore = useUiStore();

function toggleEveryDisplay() {
  uiStore.toggleEveryDisplay();
  // store.toggleEveryDisplay();              // Pinia アクション想定
}

function toggleHideConfig() {
  uiStore.toggleHideConfig();
  // store.toggleHideConfig();                // Pinia
}

function randomImage() {
  return Images[Math.floor(Math.random() * Images.length)];
}

/* ---------- lifecycle ---------- */
onMounted(() => {
  toggleEveryDisplay();
  toggleHideConfig();
});

onBeforeUnmount(() => {
  toggleEveryDisplay();
  toggleHideConfig();
});
</script>
<style scoped>
.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.6) !important;
}
</style>
<style scoped>
.main-color {
  background-color: #1d85ca;
  /**薄い紫色の影をつける */
  box-shadow: 0 4px 6px rgba(57, 49, 107, 0.1), 0 1px 3px rgba(57, 49, 107, 0.08);
}
</style>