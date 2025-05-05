const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = '7845700712:AAGupQg3jBQc9a_RgBprzLXUvQN-TaxA9MY';

app.use(express.json());

app.post('/api/telegram/bot' + BOT_TOKEN + '/sendMessage', async (req, res) => {
    const { chat_id, text } = req.body;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id, text })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error sending message');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});