import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const isDev = mode === 'development'

  // API Proxy Configuration
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000'
  const apiProxyRewriteBase = env.VITE_API_PROXY_REWRITE_BASE || '/api'

  return {
    resolve: {
      alias: {
        'ds-components': '/src/ds-components',
        'services': '/src/services'
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        // Deshabilitar PWA en desarrollo para evitar problemas de cache
        devOptions: {
          enabled: false
        },
        includeAssets: ['logo.png', 'logo_192x192.png', 'logo_512x512.png', 'vite.svg'],
        manifest: {
          name: env.VITE_APP_NAME || 'React Base Project',
          short_name: env.VITE_APP_SHORT_NAME || 'ReactBase',
          description: env.VITE_APP_DESCRIPTION || 'React + Vite Base Project with Design System',
          theme_color: '#6366f1',
          icons: [
            {
              src: 'logo_192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'logo_512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          display: 'standalone',
          // Deploy configurable según VITE_BASE_PATH
          start_url: env.VITE_BASE_PATH || '/',
          scope: env.VITE_BASE_PATH || '/',
          background_color: '#ffffff'
        },
        workbox: {
          // Activación INMEDIATA del nuevo Service Worker
          skipWaiting: true,
          clientsClaim: true,
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
          // Excluir version.json del cache para que siempre se obtenga fresco
          globIgnores: ['**/version.json'],
          runtimeCaching: [
            {
              // Cache para peticiones a la API (proxy local o servidor remoto)
              urlPattern: ({ url }) => url.pathname.startsWith('/api'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10
              }
            },
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'documents-cache'
              }
            },
            {
              urlPattern: ({ request }) => ['script', 'style'].includes(request.destination),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'assets-cache'
              }
            }
          ]
        }
      })
    ],
    // Base path configurable por variable de entorno (ej: /app/, /mi-proyecto/)
    base: mode.startsWith('production') ? (env.VITE_BASE_PATH || '/') : '/',
    server: {
      port: 3010,
      // CORS permitido para desarrollo
      cors: true,
      // Proxy para evitar CORS: /api -> {target}/api
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: apiProxyTarget.startsWith('https://'),
          rewrite: (path) => path.replace(/^\/api/, apiProxyRewriteBase)
        }
      },
      // Permitir hosts de Cloudflare Tunnel
      allowedHosts: [
        'localhost',
        '.trycloudflare.com'
      ]
    },
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('/src/ds-components/') ||
              id.includes('/src/ds-layout/') ||
              id.includes('/src/ds-forms/') ||
              id.includes('/src/ds-overlays/') ||
              id.includes('/src/ds-lists/')) {
              return 'ds-kit'
            }

            if (id.includes('node_modules')) {
              if (id.includes('exceljs')) {
                return 'exceljs';
              }
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@dnd-kit')) {
                return 'vendor-dnd';
              }
              return 'vendor';
            }
          }
        }
      }
    }
  }
})
