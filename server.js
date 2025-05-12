const express = require('express');
const webPush = require('web-push');
const app = express();
const port = process.env.PORT || 10000;

// VAPID keys (replace these with your own keys)
const publicVapidKey = 'BGtTLNBb9fOzwB9gx-3JVnFTC5z6oUUTPmj2g-2TnhiFCHGxndAbcyoKr6JP2npAIemmNMrJOGg1oDCJZGyk4MQ';
const privateVapidKey = 'VE31sNB6Ss8YVLMPFgnnPmppy3nvgBataKqdQnPfIPU';

// Set VAPID details
webPush.setVapidDetails(
  'mailto:ronobirroy49@gmail.com',
  publicVapidKey,
  privateVapidKey
);

// In-memory store for subscriptions (you can switch to a database in production)
let subscriptions = [];

// Parse JSON bodies
app.use(express.json());

// Serve static files (e.g., icons, sw.js)
app.use(express.static(__dirname));

// Endpoint to handle subscription requests (client-side will send subscription here)
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription); // Add the subscription to the list
  res.status(201).json({ message: 'Subscription added' });
  console.log('New subscription added');
});

// Endpoint to send notifications to all subscribers
app.post('/send-notification', (req, res) => {
  const notificationPayload = JSON.stringify({
    title: 'MOBE GAME',
    message: 'Join now!',
  });

  const promises = subscriptions.map(subscription => {
    return webPush.sendNotification(subscription, notificationPayload)
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ message: 'Notifications sent' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Error sending notifications', error: err });
    });
});

// Serve the service worker (sw.js)
app.get('/sw.js', (req, res) => {
  res.send(`
    self.addEventListener('push', function(event) {
      const options = {
        body: event.data.text(),
        icon: '/icon.png',   // Path to your icon
        badge: '/badge.png', // Path to your badge
      };

      event.waitUntil(
        self.registration.showNotification('MOBE GAME', options)
      );
    });

    self.addEventListener('notificationclick', function(event) {
      event.notification.close();
    });
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
