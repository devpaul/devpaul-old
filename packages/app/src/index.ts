if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		const reg = await navigator.serviceWorker.register('/service-worker.js');
	});
}
