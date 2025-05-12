const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

const publicVapidKey = 'BGtTLNBb9fOzwB9gx-3JVnFTC5z6oUUTPmj2g-2TnhiFCHGxndAbcyoKr6JP2npAIemmNMrJOGg1oDCJZGyk4MQ';
const privateVapidKey = 'VE31sNB6Ss8YVLMPFgnnPmppy3nvgBataKqdQnPfIPU';

webpush.setVapidDetails(
  'mailto:ronobirroy49@gmail.com',
  publicVapidKey,
  privateVapidKey
);

app.use(bodyParser.json());

let subscriptions = [];

// Subscribe route
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscribed successfully' });
});

// Send notification to all
app.post('/send', async (req, res) => {
  const payload = JSON.stringify({
    title: 'MOBE GAME',
    body: 'Join now!',
  });

  const sendAll = subscriptions.map(sub =>
    webpush.sendNotification(sub, payload).catch(err => {
      console.error('Push error:', err);
    })
  );

  await Promise.all(sendAll);

  res.status(200).json({ message: 'Notifications sent' });
});

// Health check
app.get('/', (req, res) => {
  res.send('Push Notification Server is Running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
