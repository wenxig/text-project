import { fileURLToPath, URL } from 'node:url'
import tailwindcss from 'tailwindcss';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { dynamicBase } from 'vite-plugin-dynamic-base'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    dynamicBase({
      publicPath: 'window.__dynamic_base__',
      transformIndexHtml: false
    })
  ],
  "css": {
    postcss: {
      plugins: [
        tailwindcss({
          content: [
            "./src/**/*.{vue,js,ts,jsx,tsx}",
          ],
          corePlugins: {
            preflight: false,
          }
        })
      ]
    }
  },
  base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@h': fileURLToPath(new URL('./src/hook', import.meta.url)),
      '@l': fileURLToPath(new URL('./src/layout', import.meta.url)),
      '@i': fileURLToPath(new URL('./src/i18n', import.meta.url)),
      '@s': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@p': fileURLToPath(new URL('./src/pages', import.meta.url))
    }
  }
})
