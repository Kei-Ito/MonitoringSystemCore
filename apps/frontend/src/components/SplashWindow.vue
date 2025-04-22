<template>
  <div class="splashwindow_container">
    <h1 class="ml3">UV Monitoring System</h1>
    <loading-spinner />
  </div>
  
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import anime from 'animejs/lib/anime.es.js';
import LoadingSpinner from './LoadingSpinner.vue';

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
});

const components = {
  LoadingSpinner
};

onMounted(() => {
  const textWrapper = document.querySelector('.ml3');
  if (textWrapper) {
    textWrapper.innerHTML = textWrapper.textContent?.replace(/\S/g, "<span class='letter'>$&</span>") || '';

    anime.timeline({ loop: true })
      .add({
        targets: '.ml3 .letter',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 1800,
        delay: (_el:any, i:number) => 150 * (i + 1)
      }).add({
        targets: '.ml3',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  } else {
    console.error('textWrapper not found');
  }
});
</script>

<style scoped>
.splashwindow_container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: rgb(18, 18, 36)
  
}

.ml3 {
  font-weight: 900;
  font-size: 5em;
  color: white;
}

.letter {
  display: inline-block;
  
  line-height: 1em;
}
</style>