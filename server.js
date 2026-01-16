import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { fetchAllJobs, JOB_PORTAL_URLS, DEFAULT_EXCLUDE_KEYWORDS } from './lib/fetch-jobs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


// Copy express template to public directory on startup
async function setupPublicDirectory() {
  try {
    const publicDir = path.join(__dirname, 'public');
    await fs.mkdir(publicDir, { recursive: true });
    
    const templatePath = path.join(__dirname, 'templates', 'express.html');
    const publicIndexPath = path.join(publicDir, 'index.html');
    
    await fs.copyFile(templatePath, publicIndexPath);
    console.log('Copied express template to public/index.html');
  } catch (error) {
    console.error('Error setting up public directory:', error);
  }
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Jobs aggregation endpoint
app.get('/api/jobs', async (req, res) => {
  try {
    // Parse exclude keywords from query parameter (comma-separated)
    const excludeParam = req.query.exclude || '';
    const excludeKeywords = excludeParam
      ? excludeParam.split(',').map(k => k.trim()).filter(Boolean)
      : DEFAULT_EXCLUDE_KEYWORDS;
    
    console.log('Fetching jobs with exclude keywords:', excludeKeywords);
    
    // Use the shared fetchAllJobs function
    const results = await fetchAllJobs(excludeKeywords);
    
    // Calculate summary
    const totalJobs = results.reduce((sum, r) => sum + r.jobs.length, 0);
    const errorCount = results.filter(r => r.error !== null).length;
    
    res.json({
      portals: results,
      summary: {
        totalPortals: JOB_PORTAL_URLS.length,
        totalJobs: totalJobs,
        errorCount: errorCount,
        excludeKeywords: excludeKeywords
      }
    });
    
  } catch (error) {
    console.error('Jobs endpoint error:', error);
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: error.message
    });
  }
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
async function startServer() {
  await setupPublicDirectory();
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Jobs API endpoint: http://localhost:${PORT}/api/jobs?exclude=<keywords>`);
  });
}

startServer();
