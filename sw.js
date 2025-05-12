self.addEventListener('push', function (event) {
    let options = {
        body: event.data.text(),  // The push message body
        icon: '/icon.png',        // You can use any icon you want
        badge: '/badge.png'       // You can use any badge image you want
    };

    event.waitUntil(
        self.registration.showNotification('MOBE GAME', options)
    );
});
