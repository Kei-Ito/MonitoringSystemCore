<template>
  <div class="card z-index-2 mb-2 mt-0">
    <div
      class="card-header p-0 position-relative my-2 mx-2 z-index-2 bg-transparent"
    >
      <div
        class="border-radius-lg"
        :class="`bg-gradient-${props.color} shadow-${props.color}`">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  title: String,
  subtitle: String,
  color: String,
});


</script>