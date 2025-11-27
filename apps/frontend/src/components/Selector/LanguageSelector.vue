<template>
  <div class="language-selector">
    <select v-model="currentLocale" class="form-select">
      <option v-for="lang in languages" :key="lang.code" :value="lang.code" style="text-align: center">
        {{ lang.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ko', label: '한국어' }
]

const currentLocale = computed<string>({
  get: () => locale.value,
  set: (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }
})

</script>

<style scoped>
.language-selector {
  max-width: 200px;
}

.language-selector .form-select {
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  font-size: 0.875rem;
}
</style>
