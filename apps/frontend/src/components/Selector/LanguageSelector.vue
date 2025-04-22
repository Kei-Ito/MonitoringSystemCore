<template>
  <div class="language-selector">
    <select 
    v-model="currentLocale" 
    @change="changeLanguage($event.target.value)"
    class="form-select"
    >
    <option 
      v-for="lang in languages" 
      :key="lang.code"
      :value="lang.code"
      style="text-align: center"
    >
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

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>
