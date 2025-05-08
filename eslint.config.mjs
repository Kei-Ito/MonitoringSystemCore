// eslint.config.mjs  (ESM)
import js           from '@eslint/js'
import tsPlugin     from '@typescript-eslint/eslint-plugin'
import tsParser     from '@typescript-eslint/parser'
import vuePlugin    from 'eslint-plugin-vue'
import nodePlugin   from 'eslint-plugin-node'
import globals        from 'globals'                        // ★追加

/* ヘルパー：配列なら 0 番、オブジェクトならそのまま返す */
const first = cfg => (Array.isArray(cfg) ? cfg[0] : cfg)

/* -------------------------------------------------- */
/* 1) JS 推奨 */
const baseJs = first(js.configs.recommended)

/* 2) TS 共通 ── recommendedTypeChecked (キャメルケース!!) */
const baseTs = {
  files: ['**/*.{ts,tsx}'],
  ...first(tsPlugin.configs.recommendedTypeChecked),
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['./tsconfig.json'],
    },
  },
}

/* 3) Vue 3 Frontend ── flat/vue3-recommended */
const vueFrontend = {
  files: ['apps/frontend/**/*.{ts,vue}'],
  ...first(vuePlugin.configs['flat/vue3-recommended']),
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      extraFileExtensions: ['.vue'],
      project: ['./tsconfig.json'],
    },
    globals: globals.browser,
  },
  processor: vuePlugin.processors['.vue'],
  rules: {
    'vue/define-macros-order': [
      'error',
      { order: ['defineOptions', 'defineProps', 'defineEmits'] },
    ],
  },
  
}

/* 4) Node Backend ── flat/recommended */
const nodeBackend = {
  files: ['apps/backend/**/*.ts'],
  ...first(nodePlugin.configs['flat/recommended']),
  languageOptions: {
    parser: tsParser,
    parserOptions: { project: ['./tsconfig.json'] },
    globals: globals.node,
  },
  
}

/* 5) Shared Library ── もう一度 TS 推奨を流用 */
const shared = {
  files: ['shared/**/*.ts'],
  ...first(tsPlugin.configs.recommendedTypeChecked),
  languageOptions: {
    parser: tsParser,
    parserOptions: { project: ['./tsconfig.json'] },
  },
}

/* -------------------------------------------------- */
export default [baseJs, baseTs, vueFrontend, nodeBackend, shared,
  {
     /* ★ plugins を必ず宣言する！ */
     plugins: { '@typescript-eslint': tsPlugin },
     ignores: ['**/dist/**'],
     rules: {
       'no-unused-vars': 'off',                       // Core を無効化
       '@typescript-eslint/no-unused-vars': ['error', {
         args: 'none',
         ignoreRestSiblings: true,
       }],
     },
   },
 ]