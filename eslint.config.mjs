// eslint.config.mjs  ★ESM
import js           from '@eslint/js'
import tsPlugin     from '@typescript-eslint/eslint-plugin'
import tsParser     from '@typescript-eslint/parser'
import vuePlugin    from 'eslint-plugin-vue'
import vueParser    from 'vue-eslint-parser' // Vue 3 用のパーサー
import nodePlugin   from 'eslint-plugin-node'
import globals      from 'globals'

/* ヘルパー：プリセットが配列なら 0 番だけ取る */
const first = cfg => (Array.isArray(cfg) ? cfg[0] : cfg)

/* ───────────────────────────────────────── JS 基本 */
const baseJs = first(js.configs.recommended)

/* ───────────────────────────────────────── TS 共通 */
const baseTs = {
  files: ['**/*.{ts,tsx}'],
  ...first(tsPlugin.configs.recommendedTypeChecked),
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['./tsconfig.json'],        // ルート tsconfig
    },
  },
}

/* ─────────────────────────────── Vue 3 Front-End */
const vueFrontend = {
  files: ['apps/frontend/**/*.{ts,vue}'],
  ...first(vuePlugin.configs['flat/vue3-recommended']),
  languageOptions: {
    parser: vueParser, 
    parserOptions: {
      parser: tsParser,  // Vue ファイル内の TypeScript を解析するためのパーサー
      extraFileExtensions: ['.vue'],
      project: ['./tsconfig.app.json','./tsconfig.json','./tsconfig.node.json'],
    },
    globals: globals.browser,
  },
  plugins: {
    vue: vuePlugin,
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    'vue/define-macros-order': [
      'error',
      { order: ['defineOptions', 'defineProps', 'defineEmits'] },
    ],
  },
}

/* ─────────────────────────────── Vue 3 Front-End */
const vueFrontendJs = {
  files: ['apps/frontend/**/*.{js, jsx}'],
  languageOptions: {
    globals: globals.browser,   // window や document を定義
    parserOptions: { project: null }, // ← これで TypeScript プロジェクトから除外
  },
  plugins: {
    vue: vuePlugin,
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    //var を使わないようにするルール
    //'no-var': 'error',
    // 変数宣言は const を優先する
    'prefer-const': 'error',
  },
}

/* ─────────────────────────────── Node Back-End */
const nodeBackend = {
  files: ['apps/backend/**/*.ts'],
  ...first(nodePlugin.configs['flat/recommended']),
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: ['./tsconfig.json'],
    },
    globals: { ...globals.node, NodeJS: 'readonly' }, // ← ここが no-undef 対策
  },
  plugins: {
    node: nodePlugin,
    '@typescript-eslint': tsPlugin,
  },
}

/* ─────────────────────────────── Shared Library */
const shared = {
  files: ['shared/**/*.ts'],
  ...first(tsPlugin.configs.recommendedTypeChecked),
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: ['./tsconfig.json'],
    },
  },
}

/* ─────────────────────── 追加の共通オーバーライド */
const commonOverrides = [
  /* 生成物を完全に無視 */
  { ignores: ['**/dist/**', '**/*.d.ts'] },

  /* TS ファイルでは core no-undef を無効化 */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: { 'no-undef': 'off' },
  },

  /* core → TS 版 no-unused-vars へ置き換え */
  {
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'none', ignoreRestSiblings: true },
      ],
    },
  },
]

/* ─────────────────────────────── エクスポート */
export default [
  baseJs,
  baseTs,
  vueFrontend,
  vueFrontendJs,
  nodeBackend,
  shared,
  ...commonOverrides,
]
