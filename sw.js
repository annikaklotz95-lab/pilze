/* Offline-Cache für den Pilzwald (nur eigene Dateien, keine Fremddienste) */
const CACHE = 'pilzwald-v9';
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'assets/icon.svg', 'assets/fotos/steinpilz.webp', 'assets/fotos/lamellenpilz.webp', 'assets/fotos/laengsschnitt.webp', 'assets/fotos/fliegenpilz.webp', 'assets/fotos/champignon.webp', 'assets/fotos/pilz-mit-myzel.webp', 'assets/fotos/myzel-holz.webp', 'assets/fotos/baumpilz.webp', 'assets/fotos/maronenroehrling.webp', 'assets/fotos/pfifferling.webp', 'assets/fotos/knollenblaetterpilz.webp', 'assets/fotos/gallenroehrling.webp', 'assets/fotos/falscher-pfifferling.webp',
  'js/art.js', 'js/assets.js', 'js/content.js', 'js/dialog.js', 'js/store.js', 'js/voice.js', 'js/ui.js', 'js/dnd.js', 'js/app.js',
  'js/screens/home.js', 'js/screens/map.js', 'js/screens/mission1.js', 'js/screens/mission2.js', 'js/screens/mission3.js', 'js/screens/mission4.js', 'js/screens/mission5.js', 'js/screens/mission6.js', 'js/screens/vorwissen.js', 'js/screens/garden.js',
  'js/screens/lexikon.js', 'js/screens/journal.js', 'js/screens/profiles.js', 'js/screens/teacher.js'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      // Schriften von Google Fonts für Offline-Nutzung mitspeichern
      if (res.ok && (new URL(e.request.url).origin === location.origin || /fonts\.(googleapis|gstatic)\.com/.test(e.request.url))) {
        const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
