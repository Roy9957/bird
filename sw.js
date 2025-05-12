self.addEventListener('push', function (event) {
    let data = {};

    try {
        data = event.data.json();  // Expecting JSON: { title: '', body: '' }
    } catch (e) {
        data = {
            title: 'MOBE GAME',
            body: event.data.text()
        };
    }

    const options = {
        body: data.body || 'Join now!',
        icon: '/icon.png',
        badge: '/badge.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'MOBE GAME', options)
    );
});
