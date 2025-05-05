// server.js - Minimal Express server for Telegram API
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware - keep it minimal
app.use(cors());
app.use(express.json());

// Health check - simple route with no parameters
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple route for Telegram sendMessage - no path parameters
app.post('/sendmessage', async (req, res) => {
  try {
    const { botToken, chatId, text, parseMode } = req.body;
    
    // Validate required fields
    if (!botToken || !chatId || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'botToken, chatId, and text are required' 
      });
    }
    
    // Create request payload
    const payload = {
      chat_id: chatId,
      text: text
    };
    
    // Add optional parse_mode if provided
    if (parseMode) {
      payload.parse_mode = parseMode;
    }
    
    // Make direct request to Telegram API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(telegramUrl, payload);
    
    // Return success response
    res.json({ 
      success: true, 
      data: response.data 
    });
  } catch (error) {
    console.error('Error sending message:', error.message);
    
    // Handle errors from Telegram API
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Send photo endpoint
app.post('/sendphoto', async (req, res) => {
  try {
    const { botToken, chatId, photoUrl, caption } = req.body;
    
    // Validate required fields
    if (!botToken || !chatId || !photoUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'botToken, chatId, and photoUrl are required' 
      });
    }
    
    // Create request payload
    const payload = {
      chat_id: chatId,
      photo: photoUrl
    };
    
    // Add optional caption if provided
    if (caption) {
      payload.caption = caption;
    }
    
    // Make direct request to Telegram API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    const response = await axios.post(telegramUrl, payload);
    
    // Return success response
    res.json({ 
      success: true, 
      data: response.data 
    });
  } catch (error) {
    console.error('Error sending photo:', error.message);
    
    // Handle errors from Telegram API
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Simple catch-all route with no parameters
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing
module.exports = app;