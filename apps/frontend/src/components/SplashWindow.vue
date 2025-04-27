<template>
  <div class="splashwindow_container">
    <h1 class="ml3">
      <span
        v-for="(c, i) in text"
        :key="i"
        class="letter"
        :style="{ animationDelay: `${i * 0.15}s` }"
      >
        {{ c }}
      </span>
    </h1>
    <loading-spinner />
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

// 文字列を変数にしておくと i18n などにも対応しやすい
const text = 'UV Monitoring System'.split('')
</script>

<style scoped>
.splashwindow_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: rgb(18 18 36);
}

.ml3 {
  font-weight: 900;
  font-size: 5em;
  color: #fff;
}

@keyframes fadeInUp {
  0%   { opacity: 0; transform: translateY(40%); }
  100% { opacity: 1; transform: translateY(0);  }
}

.letter {
  display: inline-block;
  animation: fadeInUp 0.6s ease-out forwards;
  /* animation-delay は inline-style で付与 */
}
</style>
