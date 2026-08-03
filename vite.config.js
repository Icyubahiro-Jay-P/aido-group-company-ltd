import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'shipping.png', 'lumber.png', 'sheets.png', 'steel.png'],
      manifest: {
        name: 'AIDO Group - Inventory & Sales',
        short_name: 'AIDO',
        description: 'Inventory, sales, purchases and receipts for AIDO Group Company Ltd.',
        theme_color: '#2563eb',
        background_color: '#fafafa',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        // Serve the SPA shell for any navigation request so routes work offline.
        navigateFallback: '/index.html',
        // Precache every built asset (js/css/html) so the app loads with no network.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Dexie owns the data cache; the SW only serves the app shell.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'aido-pages',
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ],
})
