import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS proxy endpoint
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ 
      error: 'Missing url query parameter',
      message: 'Please provide a URL to proxy via ?url=<target-url>'
    });
  }

  // Validate the URL format
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        error: 'Invalid URL protocol',
        message: 'Only HTTP and HTTPS protocols are supported'
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid URL format',
      message: 'Please provide a valid URL'
    });
  }

  try {
    console.log(`Proxying request to: ${targetUrl}`);

    // Fetch the external URL server-side (bypassing CORS)
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Proxy fetch failed',
        status: response.status,
        statusText: response.statusText
      });
    }

    // Forward appropriate headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Enable CORS for browser requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Get the response body
    const body = await response.text();
    
    // Return the proxied response
    res.send(body);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    });
  }
});

// Handle OPTIONS requests for CORS preflight
app.options('/api/proxy', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Proxy endpoint: http://localhost:${PORT}/api/proxy?url=<target-url>`);
});
