const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Send a message via Telegram
 * 
 * Request body:
 * {
 *   "chat_id": "123456789",
 *   "text": "Hello from the API!",
 *   "parse_mode": "HTML" // optional
 * }
 */
app.post('/api/telegram/sendMessage', async (req, res) => {
  try {
    // Get the Telegram bot token from environment variables
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!telegramToken) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Telegram bot token is not configured' 
      });
    }

    // Validate required fields
    const { chat_id, text } = req.body;
    
    if (!chat_id || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both chat_id and text are required' 
      });
    }

    // Make the request to the Telegram API
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    const response = await axios.post(telegramUrl, req.body);

    // Return the Telegram API response
    res.status(200).json(response.data);
    
    console.log(`[${new Date().toISOString()}] Message sent to chat ${chat_id}`);
  } catch (error) {
    console.error('[Telegram API Error]', error.response?.data || error.message);
    
    // Handle Telegram API errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Telegram API Error',
        message: error.response.data
      });
    }
    
    // Handle other errors
    res.status(500).json({
      error: 'Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message
    });
  }
});

/**
 * Send a photo via Telegram
 * 
 * Request body:
 * {
 *   "chat_id": "123456789",
 *   "photo": "https://example.com/image.jpg",
 *   "caption": "Check out this photo!" // optional
 * }
 */
app.post('/api/telegram/sendPhoto', async (req, res) => {
  try {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!telegramToken) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Telegram bot token is not configured' 
      });
    }

    // Validate required fields
    const { chat_id, photo } = req.body;
    
    if (!chat_id || !photo) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both chat_id and photo are required' 
      });
    }

    // Make the request to the Telegram API
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendPhoto`;
    const response = await axios.post(telegramUrl, req.body);

    // Return the Telegram API response
    res.status(200).json(response.data);
    
    console.log(`[${new Date().toISOString()}] Photo sent to chat ${chat_id}`);
  } catch (error) {
    console.error('[Telegram API Error]', error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Telegram API Error',
        message: error.response.data
      });
    }
    
    res.status(500).json({
      error: 'Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message
    });
  }
});

// Catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested resource does not exist.' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;