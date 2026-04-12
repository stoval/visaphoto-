const CACHE_NAME = 'visaphoto-v5';

const MP_BASE = './vendor/mediapipe/selfie_segmentation/';
const MP_ASSETS = [
  MP_BASE + 'selfie_segmentation.js',
  MP_BASE + 'selfie_segmentation.binarypb',
  MP_BASE + 'selfie_segmentation.tflite',
  MP_BASE + 'selfie_segmentation_landscape.tflite',
  MP_BASE + 'selfie_segmentation_solution_simd_wasm_bin.js',
  MP_BASE + 'selfie_segmentation_solution_simd_wasm_bin.wasm',
  MP_BASE + 'selfie_segmentation_solution_wasm_bin.js',
  MP_BASE + 'selfie_segmentation_solution_wasm_bin.wasm',
];

const APP_ASSETS = [
  './',
  './index.html',
  './passport-photo-maker.html',
  './styles/main.css',
  './src/main.js',
  './src/ui.js',
  './src/i18n.js',
  './src/state.js',
  './src/editor.js',
  './src/export.js',
  './src/storage.js',
  './src/data/presets.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap'
];

// INSTALL: Pre-cache MediaPipe + App Core
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Use allSettled to ensure we cache as much as possible even if one fails
    await cache.addAll([...APP_ASSETS, ...MP_ASSETS]);
    await self.skipWaiting();
  })());
});

// ACTIVATE: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k !== CACHE_NAME)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// FETCH Handler
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  
  // Strategy 1: MediaPipe Assets -> Cache-First
  const isMediapipeAsset =
    url.pathname.includes('/vendor/mediapipe/selfie_segmentation/') ||
    url.pathname.endsWith('.wasm') ||
    url.pathname.endsWith('.tflite') ||
    url.pathname.endsWith('.binarypb');

  if (isMediapipeAsset) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;

      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        return new Response('Offline and not cached', { status: 504 });
      }
    })());
    return;
  }

  // Strategy 2: App Assets -> Stale-While-Revalidate
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });

    const networkPromise = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    return cached || (await networkPromise) || new Response('Offline', { status: 503 });
  })());
});
