<template>
  <div class="splashwindow_container">
    <h1 class="ml3">
      <span
        v-for="(c, i) in text"
        :key="i"
        class="letter"
        :style="{ animationDelay: `${i * 0.08}s` }"
      >
        {{ c === ' ' ? '\u00A0' : c }}
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
  background: radial-gradient(circle at center, #2b2b44 0%, #121224 100%);
  color: #ffffff;
}

.ml3 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 900;
  font-size: 5em;
  color: #fff;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin: 0;
  padding-bottom: 40px;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.letter {
  display: inline-block;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  /* animation-delay は inline-style で付与 */
}
</style>
