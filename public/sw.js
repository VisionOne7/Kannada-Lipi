/**
 * KannadaLipi service worker — makes the whole app work offline, so school
 * computer labs with weak internet can keep coding.
 *
 *  - Pages:        network first, fall back to the cached app shell
 *  - /assets/*:    cache first (file names are content-hashed)
 *  - Google Fonts: cache first
 *  - Other files:  stale-while-revalidate
 *  - Live APIs (transliteration, visitor count) are never cached.
 */
const CACHE = 'kannadalipi-v5';
const FONT_CACHE = 'kannadalipi-fonts-v1';
const KEEP = [CACHE, FONT_CACHE];
const SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/favicon-32.png',
    '/images/logo.png',
    '/images/icon-192.png',
    '/images/icon-512.png',
];
const MANIFEST_URL = '/precache-manifest.json';

// Download every built file listed by the build. Safe to call repeatedly:
// it does nothing when the build version hasn't changed.
async function precacheAll() {
    const cache = await caches.open(CACHE);
    let manifest;
    try {
        const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
        if (!res.ok) return;
        manifest = await res.clone().json();
        const old = await cache.match(MANIFEST_URL);
        if (old) {
            const prev = await old.json().catch(() => null);
            if (prev && prev.version === manifest.version) return;
        }
        await Promise.all(manifest.files.map((url) =>
            cache.add(url).catch(() => { /* one missing file must not break the rest */ })
        ));
        await cache.put(MANIFEST_URL, res);
    } catch {
        return; // offline or dev server: try again next time
    }
    // Drop hashed assets from older builds.
    const wanted = new Set(manifest.files);
    const keys = await cache.keys();
    await Promise.all(keys.map((req) => {
        const path = new URL(req.url).pathname;
        return path.startsWith('/assets/') && !wanted.has(path) ? cache.delete(req) : null;
    }));
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await Promise.all(SHELL.map((u) => cache.add(u).catch(() => {})));
        await precacheAll();
    })());
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)));
        await self.clients.claim();
    })());
});

// The page asks for a refresh after each load, so a new deploy gets cached too.
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PRECACHE') {
        event.waitUntil(precacheAll());
    }
});

const isFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    // Google Fonts: cache first, so Kannada text still looks right offline.
    if (isFont(url)) {
        event.respondWith((async () => {
            const cache = await caches.open(FONT_CACHE);
            const hit = await cache.match(request);
            if (hit) return hit;
            try {
                const res = await fetch(request);
                if (res.ok || res.type === 'opaque') cache.put(request, res.clone());
                return res;
            } catch {
                return Response.error();
            }
        })());
        return;
    }

    // Other origins (transliteration, visitor counter): always live, never cached.
    if (url.origin !== self.location.origin) return;
    if (url.pathname === MANIFEST_URL) return;

    // Page navigations: fresh when online, cached app shell when offline.
    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE);
            try {
                const res = await fetch(request);
                if (res.ok) cache.put('/index.html', res.clone());
                return res;
            } catch {
                return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error();
            }
        })());
        return;
    }

    // Hashed build assets never change: cache first.
    if (url.pathname.startsWith('/assets/')) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE);
            const hit = await cache.match(request);
            if (hit) return hit;
            const res = await fetch(request);
            if (res.ok) cache.put(request, res.clone());
            return res;
        })());
        return;
    }

    // Everything else: serve cached copy now, refresh it in the background.
    event.respondWith((async () => {
        const cache = await caches.open(CACHE);
        const hit = await cache.match(request);
        const network = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
        }).catch(() => null);
        return hit || (await network) || Response.error();
    })());
});
