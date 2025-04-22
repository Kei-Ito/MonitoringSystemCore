<template>
  <div class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100" id="sidenav-collapse-main" style="height: 100%;">
    <ul class="navbar-nav">
      <!--
      <li class="nav-item">
        <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="custom-dashboard"
        :navText="$t('menu.custom_dashboard')">
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      -->
      <li class="nav-item">
        <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="dashboard"
        :navText="$t('menu.dashboard')">
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="trend" :navText="$t('menu.trend')">
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">signal_cellular_alt</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="configurations"
          :navText="$t('menu.configurations')">
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">settings</i>
          </template>
        </sidenav-collapse>
      </li>

    </ul>
  </div>
</template>
<script setup lang="ts">
import SidenavCollapse from "./SidenavCollapse.vue";

</script>
