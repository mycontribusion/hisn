import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'icon.png'],
      manifest: {
        name: 'Hisnul Muslim - Fortress of the Muslim',
        short_name: 'Hisnul Muslim',
        description: 'Collection of authentic supplications and remembrances from the Quran and Sunnah',
        theme_color: '#064e3b',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'dua-data': ['./src/data/duas.ts', './src/data/categories.ts'],
          'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
