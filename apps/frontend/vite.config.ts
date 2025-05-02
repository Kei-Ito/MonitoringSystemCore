import { defineConfig ,type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths' 
import { VitePWA } from 'vite-plugin-pwa'
import { viteMockServe } from 'vite-plugin-mock';
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({command }: ConfigEnv) => {
  
  /** true → モック有効。CLI で `MOCK=false pnpm dev` すれば強制無効 */
  const enableMock = command === 'serve' && process.env.MOCK !== 'false';

  return {
    root: __dirname,                 // apps/frontend をプロジェクトルート扱い
    base: process.env.PUBLIC_URL || '/',
    plugins: [
      vue(),
      tsconfigPaths(),

      // dev 時だけモックを注入（falsy は無視される）&#8203;:contentReference[oaicite:0]{index=0}
      viteMockServe({
        mockPath: 'src/mock',
        enable: enableMock,
        watchFiles: true,
        logger: true, // ログを表示
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'UV Monitoring System',
          short_name: 'Monitoring System',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1e90ff',
        },
      }),
    ],           // ← falsy を除去
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    /** dev でモックに無い URL → 実バックエンドへ転送 */
    server: {
      proxy: {
        '^/api': {
          target: 'http://localhost:2478',
          changeOrigin: true,
        },
      },
    },
    /** アプリ側でも使える “今モックかどうか” フラグ */
    define: {
      __MOCK_ENABLED__: JSON.stringify(enableMock),
    },
  }
})