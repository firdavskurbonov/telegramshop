// const express = require('express');
// const cors = require('cors');
// const proxy = require('express-http-proxy');

// const app = express();
// const PORT = process.env.PORT || 3005;

// app.use(cors());
// app.use(express.json());

// // Proxy setup for Telegram API
// app.use('/api/telegram', proxy('https://api.telegram.org', {
//   filter: (req) => req.method === 'POST',
//   proxyReqPathResolver: (req) => {
//     return req.url.replace('/api/telegram', '');
//   },
//   // Optional: Log the request for debugging
//   onProxyReq: (proxyReq, req, res) => {
//     console.log('Proxying request to:', req.url);
//   },
//   // Handle errors
//   onError: (err, req, res) => {
//     console.error('Proxy error:', err);
//     res.status(500).send('Proxy error');
//   },
// }));

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for all routes with appropriate configuration for Render
app.use(cors({
  origin: '*', // You may want to restrict this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON requests
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy setup for Telegram API
app.use('/api/telegram', proxy('https://api.telegram.org', {
  filter: (req) => req.method === 'POST',
  proxyReqPathResolver: (req) => {
    return req.url.replace('/api/telegram', '');
  },
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Add any headers needed for the proxied request
    proxyReqOpts.headers['Accept'] = 'application/json';
    proxyReqOpts.headers['X-Forwarded-For'] = srcReq.ip;
    return proxyReqOpts;
  },
  // Log the request for debugging
  userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    const data = proxyResData.toString('utf8');
    console.log(`[${new Date().toISOString()}] Proxied request: ${userReq.method} ${userReq.url}`);
    return proxyResData;
  },
  // Handle errors
  proxyErrorHandler: function(err, res, next) {
    console.error('[Proxy Error]', err);
    res.status(500).json({
      error: 'Proxy Server Error',
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
  }
}));

// Serve static files if needed (uncomment if you have a public directory)
// app.use(express.static(path.join(__dirname, 'public')));

// Add a catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
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

module.exports = app; // Export for testing