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