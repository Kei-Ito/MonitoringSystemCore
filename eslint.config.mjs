// eslint.config.mjs  ★ESM
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import securityPlugin from 'eslint-plugin-security';
import importSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser' // Vue 3 用のパーサー
import nodePlugin from 'eslint-plugin-node'
import globals from 'globals'

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
  plugins: {
    '@typescript-eslint': tsPlugin,
    'simple-import-sort': importSort,// インポートの順番をソートするプラグイン
    security: securityPlugin, // セキュリティルールを追加

  },
  rules: {
    // import の順番をソートする
    'simple-import-sort/imports': 'error',
    //var を使わないようにする
    'no-var': 'error',
    // 変数宣言は const を優先する
    'prefer-const': 'error',
    'security/detect-object-injection': 'warn', // オブジェクトインジェクションの検出
    '@typescript-eslint/naming-convention': [
      'error',
      // Enum メンバーはチェックしない（固有名詞の可能性があるため） 
      { selector: 'enumMember', format: null },
      // import は PascalCase または camelCase
      { selector: 'import', format: ['PascalCase', 'camelCase'] }, // import の命名規則
      // プロパティは命名規則の適用を無効化（ライブラリ側で決められていることもあるので）
      { selector: 'property', format: null },
      // 1) 何も指定しないものは camelCase
      { selector: 'default', format: ['camelCase'] },

      // 2) 型・クラス・enum・interface は PascalCase
      { selector: 'typeLike', format: ['PascalCase'] },

      // 3) 定数（再代入なし）は 定数の場合と参照が変わらない場合があるので、一様に解析しない
      {
        selector: 'variable',
        modifiers: ['const'],
        format: null,
      },

      // 4) boolean 変数は is/has で始める
      {
        selector: 'variable',
        modifiers: ['unused'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should', 'can'],
      },
    ],

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
      project: ['./tsconfig.app.json', './tsconfig.json', './tsconfig.node.json'],
    },
    globals: globals.browser,
  },
  plugins: {
    vue: vuePlugin,
    '@typescript-eslint': tsPlugin,
    'simple-import-sort': importSort,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'vue/define-macros-order': [
      'error',
      { order: ['defineOptions', 'defineProps', 'defineEmits'] },
    ],
    // <template> 内タグ名を PascalCase に統一
    //'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    // コンポーネントオプションの name: 'my-component'
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    // ファイル名 MyComponent.vue かどうか
    'vue/match-component-file-name': ['warn', { extensions: ['vue'], shouldMatchCase: true }],
    // emit 名を kebab-case に統一
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    '@typescript-eslint/naming-convention': [
      'error',
      // Enum メンバーはチェックしない（固有名詞の可能性があるため） 
      { selector: 'enumMember', format: null },
      // import は PascalCase または camelCase
      { selector: 'import', format: ['PascalCase', 'camelCase'] }, // import の命名規則
      // プロパティは命名規則の適用を無効化（ライブラリ側で決められていることもあるので）
      { selector: 'property', format: null },
      // 1) 何も指定しないものは camelCase
      { selector: 'default', format: ['camelCase'] },

      // 2) 型・クラス・enum・interface は PascalCase
      { selector: 'typeLike', format: ['PascalCase'] },

      // 3) 定数（再代入なし）は 定数の場合と参照が変わらない場合があるので、一様に解析しない
      {
        selector: 'variable',
        modifiers: ['const'],
        format: null,
      },

      // 4) boolean 変数は is/has で始める
      {
        selector: 'variable',
        modifiers: ['unused'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should', 'can'],
      },
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

/* ───────────────────────────────解析を無視するファイル */
// Viteの設定ファイルやmockファイルで命名規則を無効化
const ignoreFiles = {
  files: ['**/vite.config.*', '**/*.mock.ts'],
  rules: { '@typescript-eslint/naming-convention': 'off' },
};

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
  ignoreFiles,
  nodeBackend,
  shared,
  ...commonOverrides,
]
