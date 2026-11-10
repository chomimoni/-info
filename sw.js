// ヤマはる 通知用サービスワーカー
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'ヤマはる', {
    body: d.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    data: { url: d.url || '' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const hash = e.notification.data && e.notification.data.url || '';
  e.waitUntil((async () => {
    const ws = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of ws) {
      if ('focus' in w) { await w.focus(); w.postMessage({ url: hash }); return; }
    }
    await self.clients.openWindow(new URL('./' + hash, self.registration.scope).href);
  })());
});
