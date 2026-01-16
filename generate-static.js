#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAllJobs, DEFAULT_EXCLUDE_KEYWORDS } from './lib/fetch-jobs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Helper function to escape HTML
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Generate static HTML file
async function generateStaticHTML(portalsData) {
  const lastUpdated = new Date().toISOString();
  const totalJobs = portalsData.reduce((sum, p) => sum + p.jobs.length, 0);
  const errorCount = portalsData.filter(p => p.error).length;
  
  // Read the template
  const templatePath = path.join(__dirname, 'templates', 'static.html');
  let html = await fs.readFile(templatePath, 'utf-8');
  
  // Helper to safely embed JSON in HTML (escape closing script tags)
  const safeJsonStringify = (data) => {
    return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  };
  
  // Replace placeholders with actual data
  html = html.replace('{{LAST_UPDATED}}', escapeHtml(new Date(lastUpdated).toLocaleString()));
  html = html.replace(/{{TOTAL_JOBS}}/g, String(totalJobs));
  html = html.replace('{{PORTAL_COUNT}}', String(portalsData.length));
  html = html.replace('{{ERROR_COUNT}}', String(errorCount));
  html = html.replace('{{JOBS_DATA}}', safeJsonStringify(portalsData));
  html = html.replace('{{DEFAULT_EXCLUDE_KEYWORDS}}', safeJsonStringify(DEFAULT_EXCLUDE_KEYWORDS));
  
  return html;
}

// Main function
async function main() {
  try {
    console.log('Starting job aggregation...');
    
    // Fetch jobs from all portals without filtering (pass empty array to get all jobs)
    // This allows client-side filtering in the static template
    const portalsData = await fetchAllJobs([]);

    console.log('Generating static HTML...');
    const html = await generateStaticHTML(portalsData);

    const outputPath = path.join(__dirname, 'docs', 'index.html');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, 'utf-8');

    console.log(`Static HTML generated at: ${outputPath}`);
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
