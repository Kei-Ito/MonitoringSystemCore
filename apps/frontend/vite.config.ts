import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.PUBLIC_URL || '/',            // ← object 記法のまま
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',         // skipWaiting + clientsClaim を自動有効化 :contentReference[oaicite:1]{index=1}
      manifest: {
        name: 'UV Monitoring System',
        short_name: 'Monitoring System',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1e90ff'
      }
    })
  ],
  resolve: {
    alias: {
      // @/ はフロントエンド自身
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // @monitoring/shared/xxx で共通コードを参照
      "@monitoring/shared": fileURLToPath(
        new URL("../../shared/src", import.meta.url)
      )
    }
  },
})
