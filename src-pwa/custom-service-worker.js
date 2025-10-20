/* eslint-env serviceworker */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// 🔥 ativa imediatamente o novo service worker
self.skipWaiting()
clientsClaim()

// 📦 precache dos arquivos gerados pelo Quasar (build)
precacheAndRoute(self.__WB_MANIFEST)

// 🧹 remove caches antigos
cleanupOutdatedCaches()

// 📌 fallback: se o usuário está offline, abrir index.html (SPA)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  )
}

// ==================== EXTRA PROFISSIONAL ====================

// 📌 Cache CSS/JS/fontes (carregamento mais rápido)
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
)

// 📌 Cache de imagens (com expiração de 30 dias e limite de 60 imagens)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
)

// 📌 Cache de APIs (exemplo: /api/* → guarda por 5 minutos)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutos
      })
    ]
  })
)

// ==================== PUSH NOTIFICATIONS ====================
// (opcional, só funciona se você integrar FCM ou outra plataforma)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Notificação'
  const options = {
    body: data.body || 'Você tem uma nova mensagem!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Quando o usuário clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
