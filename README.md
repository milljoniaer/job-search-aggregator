# Job Search Aggregator

A modern job portal aggregator with dual modes: an Express.js backend for real-time aggregation and a static pre-fetched version for GitHub Pages.

*Disclaimer: This webpage & crawler is tailored to my specific job search needs and companies I am interested in. A complete reuse for someone else is thus probably not possible.*

## Features

- **Express.js Backend**: Real-time server-side job aggregation with `/api/jobs` endpoint
- **Static Pre-fetched Mode**: Daily automated job fetching at 7 AM UTC with client-side filtering
- **Beautiful UI**: Responsive interface built with Tailwind CSS
- **Job Aggregation**: Fetches jobs from multiple portals (Porsche Consulting, MHP, BCG Platinion, Siemens Advarta, McKinsey)
- **Smart Parsing**: Automatically detects and parses JSON and HTML responses
- **Keyword Filtering**: Exclude unwanted job postings based on keywords
- **GitHub Pages Deployment**: Automatic deployment via GitHub Actions

## Live Demo

Visit the live static application at: [https://milljoniaer.github.io/job-search-aggregator/](https://milljoniaer.github.io/job-search-aggregator/)

*The static version is updated daily at 7 AM UTC with fresh job data.*

## Local Development

### Prerequisites

- Node.js 18.0.0 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/milljoniaer/job-search-aggregator.git
cd job-search-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Production Mode

To run in production mode:
```bash
npm start
```

### Generate Static HTML

To manually generate the static HTML file with pre-fetched job data:
```bash
npm run generate-static
```

This will create a `docs/index.html` file with all job data embedded for client-side filtering.

## Two Deployment Modes

### 1. Static Mode (GitHub Pages)

The static version is automatically updated daily at **7:00 AM UTC** via GitHub Actions:
- Fetches jobs from all portals
- Generates a static HTML file with embedded data
- Deploys to GitHub Pages
- Allows client-side filtering without a backend server
- Perfect for simple deployment without server costs

**Workflow**: `.github/workflows/static-jobs.yml`

### 2. Dynamic Mode (Express Server)

Run the Express server locally or deploy it for real-time job aggregation:
- Fetches jobs on-demand when users click "Run"
- Backend-powered filtering via `/api/jobs` endpoint
- Always shows the latest job listings
- Requires Node.js server

## API Documentation

### Jobs Endpoint

**Endpoint**: `/api/jobs`

**Method**: GET

**Query Parameters**:
- `exclude` (optional): Comma-separated list of keywords to exclude from job titles

**Description**: Fetches jobs from all portals, applies filters, and returns aggregated results.

**Example**:
```bash
curl "http://localhost:3000/api/jobs?exclude=Senior,Lead,Expert"
```

**Response**:
```json
{
  "portals": [
    {
      "name": "Portal Name",
      "url": "https://...",
      "jobs": [
        {
          "title": "Job Title",
          "location": "Location",
          "link": "https://..."
        }
      ],
      "error": null
    }
  ],
  "summary": {
    "totalPortals": 6,
    "totalJobs": 25,
    "errorCount": 0,
    "excludeKeywords": ["Senior", "Lead", "Expert"]
  }
}
```

**Error Responses**:
- `500 Internal Server Error`: Failed to fetch jobs

## Environment Variables

- `PORT`: The port to run the server on (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/milljoniaer/job-search-aggregator/issues).
