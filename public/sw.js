
const CACHE_NAME = 'tranquilimais-v2.1';
const urlsToCache = [
  '/',
  '/auth',
  '/chat',
  '/reports',
  '/achievements',
  '/shop',
  '/games',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/0a7e67ef-75f4-43a9-b51c-d5abc1d7f4d3.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('SW: Install event - TranquiliMais v2.1');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache aberto - TranquiliMais v2.1');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('SW: Erro ao fazer cache:', error);
      })
  );
  
  // Força o service worker a assumir controle imediatamente
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Assumir controle de todas as abas abertas
      return self.clients.claim();
    })
  );
});

// Message event - handle messages from the app
self.addEventListener('message', (event) => {
  console.log('SW: Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('SW: Pulando espera...');
    self.skipWaiting();
  }
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy for API calls
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Fetch from network and cache
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync event:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aqui você pode implementar sincronização de dados offline
      Promise.resolve()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('SW: Push event recebido');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/lovable-uploads/0a7e67ef-75f4-43a9-b51c-d5abc1d7f4d3.png',
      badge: '/lovable-uploads/0a7e67ef-75f4-43a9-b51c-d5abc1d7f4d3.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || 1
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir App',
          icon: '/lovable-uploads/0a7e67ef-75f4-43a9-b51c-d5abc1d7f4d3.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'TranquiliMais', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click event');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
