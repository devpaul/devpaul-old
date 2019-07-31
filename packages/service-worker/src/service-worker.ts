const cacheName = 'v1';
const files = [
	'/offline.html',
	'/resources/Smile.png'
]

self.addEventListener('install', (event: any) => {
	event.waitUntil(async () => {
		const cache = await caches.open(cacheName);
		cache.addAll(files);
	});
});

self.addEventListener('activate', (event: any) => {
	event.waitUntil(async() => {
		const keys = await caches.keys();
		for (let key of keys) {
			if (key !== cacheName) {
				await caches.delete(key);
			}
		}
	});
});

self.addEventListener('fetch', (event: any) => {
	const request = caches.match(event.request)
		.then((match) => {
			if (match) {
				return match;
			}
			else {
				return fetch(event.request)
					.then((response) => {
						const responseClone = response.clone();
						caches.open(cacheName).then((cache) => {
							cache.put(event.request, responseClone);
						});
						return response;
					})
					.catch(() => {
						return caches.match('/offline.html');
					});
			}
		});
	event.respondWith(request);
});
