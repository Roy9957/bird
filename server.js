const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// Your VAPID keys
const vapidKeys = {
  publicKey: 'BGtTLNBb9fOzwB9gx-3JVnFTC5z6oUUTPmj2g-2TnhiFCHGxndAbcyoKr6JP2npAIemmNMrJOGg1oDCJZGyk4MQ',
  privateKey: 'VE31sNB6Ss8YVLMPFgnnPmppy3nvgBataKqdQnPfIPU',
};

// Configure web-push
webpush.setVapidDetails(
  'mailto:ronobirroy49@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions in-memory (can be replaced with a DB)
let subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscribed successfully.' });
});

app.post('/send-notification', async (req, res) => {
  const payload = JSON.stringify({
    title: 'MOBE GAME',
    body: 'Join now!',
  });

  try {
    const sendAll = subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        console.error('Failed to send to one subscriber:', err);
      })
    );
    await Promise.all(sendAll);
    res.json({ message: 'Notifications sent.' });
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
