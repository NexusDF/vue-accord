import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import RekaResolver from 'reka-ui/resolver'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/vue-accord/' : '/',
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dts: true,
      resolvers: [RekaResolver()],
    }),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Vue Accord',
        short_name: 'Accord',
        description: 'Локальная библиотека аккордов для гитары',
        lang: 'ru',
        display: 'standalone',
        theme_color: '#1a1a18',
        background_color: '#f3efe6',
        // Relative to Vite `base` so GitHub Pages `/vue-accord/` works.
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache built app shell + static assets (seed library ships in the JS bundle).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
        // Do not cache Songsterr / LRCLIB API responses as owned offline content.
        runtimeCaching: [],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/songsterr': {
        target: 'https://www.songsterr.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/songsterr/, ''),
      },
    },
  },
})
