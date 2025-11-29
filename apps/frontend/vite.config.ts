import { fileURLToPath, URL } from "node:url";

import vue from '@vitejs/plugin-vue'
import { type ConfigEnv,defineConfig  } from 'vite'
import { viteMockServe } from 'vite-plugin-mock';
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths' 

export default defineConfig(({command }: ConfigEnv) => {
  
  /** true → モック有効。CLI で `MOCK=false pnpm dev` すれば強制無効 */
  const enableMock = command === 'serve' && process.env.MOCK !== 'false';

  return {
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
        includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          name: 'UV Monitoring System',
          short_name: 'UV Monitor',
          description: 'UV Monitoring System Application',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1e90ff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                },
              }
            }
          ]
        },
        devOptions: {
          enabled: true
        }
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
    test: {
      environment: 'happy-dom',
      globals: true,
    },
  }
})