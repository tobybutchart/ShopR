self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('shopr').then((cache) => cache.addAll([
            '/css/style.css',
            '/css/style.min.css',
            '/img/icons/android-chrome-192x192.png',
            '/img/icons/android-chrome-512x512.png',
            '/img/icons/apple-touch-icon.png',
            '/img/icons/favicon.ico',
            '/img/icons/favicon-16x16.png',
            '/img/icons/favicon-32x32.png',
            '/img/ShopR-home-background-white-mask.jpg',
            '/img/ShopR-lg-white.png',
            '/img/ShopR-sm-white.png',
            '/img/ShopR-lg-black-ds.png',
            '/js/accordion.js',
            '/js/accordion.min.js',
            '/js/header.js',
            '/js/header.min.js',
            '/js/meta.js',
            '/js/meta.min.js',
            '/js/modal.js',
            '/js/modal.min.js',
            '/js/nav-bar.js',
            '/js/nav-bar.min.js',
            '/js/page-control.js',
            '/js/page-control.min.js',
            '/js/peer.min.js',
            '/js/settings.js',
            '/js/settings.min.js',
            '/js/share.js',
            '/js/share.min.js',
            '/js/shopr.js',
            '/js/shopr.min.js',
            '/js/text-utils.js',
            '/js/text-utils.min.js',
            '/js/uuid.js',
            '/js/uuid.min.js',
            '/msg/css/msg.css',
            '/msg/css/msg.min.css',
            '/msg/js/chrome-ext.js',
            '/msg/js/chrome-ext.min.js',
            '/msg/js/msg.js',
            '/msg/js/msg.min.js',
            '/peerjs.min.js.map'
        ]))
    );
});

self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
