import { defineConfig ,type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths' 
import { VitePWA } from 'vite-plugin-pwa'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({command }: ConfigEnv) => {
  
  /** true → モック有効。CLI で `MOCK=false pnpm dev` すれば強制無効 */
  const enableMock = command === 'serve' && process.env.MOCK !== 'false';
  const mockPlugin = enableMock && mockDevServerPlugin({ log: 'debug' });
console.log('mockPlugin ->', !!mockPlugin);          // ✅ true なら配列に乗った
  return {
    root: __dirname,                 // apps/frontend をプロジェクトルート扱い
    base: process.env.PUBLIC_URL || '/',
    plugins: [
      vue(),
      tsconfigPaths(),

      // dev 時だけモックを注入（falsy は無視される）&#8203;:contentReference[oaicite:0]{index=0}
      mockPlugin,
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
    ].filter(Boolean),           // ← falsy を除去
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