const express = require('express');
const webPush = require('web-push');
const app = express();
const PORT = process.env.PORT || 3000;

// VAPID keys (you've already provided these keys)
const vapidKeys = {
    publicKey: 'BGtTLNBb9fOzwB9gx-3JVnFTC5z6oUUTPmj2g-2TnhiFCHGxndAbcyoKr6JP2npAIemmNMrJOGg1oDCJZGyk4MQ',
    privateKey: 'VE31sNB6Ss8YVLMPFgnnPmppy3nvgBataKqdQnPfIPU'
};

// Set VAPID details
webPush.setVapidDetails(
    'mailto:ronobirroy49@gmail.com',  // Your contact email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.use(express.json());

// Endpoint to send a push notification
app.post('/send-notification', (req, res) => {
    const { subscription, payload } = req.body;

    // Send the push notification
    webPush.sendNotification(subscription, payload)
        .then(result => {
            res.status(200).json({ message: 'Notification sent successfully!', result });
        })
        .catch(err => {
            console.error('Error sending notification:', err);
            res.status(500).json({ message: 'Error sending notification', err });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
