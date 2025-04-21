import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
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
