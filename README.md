# Job Search Aggregator

A modern job portal aggregator with dual modes: an Express.js backend for real-time aggregation and a static pre-fetched version for GitHub Pages.

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

## Using the Application

### Static Version (GitHub Pages)

Visit [https://milljoniaer.github.io/job-search-aggregator/](https://milljoniaer.github.io/job-search-aggregator/) to use the static version with pre-fetched data:
- Job data is updated daily at 7 AM UTC
- All filtering happens in your browser
- No backend server required
- Works offline after initial page load

### Dynamic Version (Local Server)

1. Start the Express server locally: `npm start`
2. Open the web interface at `http://localhost:3000`
3. Click "Run" to fetch fresh job listings in real-time
4. Use the keyword filter to exclude unwanted positions

### Filtering

The application includes default exclude keywords:
- Senior
- Lead
- Security
- Experienced
- Expert
- Praktikum
- Intern

You can customize these keywords in the "Exclude keywords" textarea (one per line).

## Deployment

### GitHub Pages (Static)

The static version is automatically generated and deployed daily at 7 AM UTC via GitHub Actions workflow (`.github/workflows/static-jobs.yml`):

1. Fetches jobs from all portals
2. Generates `docs/index.html` with embedded job data
3. Deploys to GitHub Pages

You can also manually trigger the workflow from the Actions tab.

### Manual Static Generation

To manually generate and deploy:
```bash
npm run generate-static
# Then commit and push the docs/ folder
```

## Project Structure

```
job-search-aggregator/
├── .github/
│   └── workflows/
│       ├── deploy.yml           # Original deployment workflow
│       └── static-jobs.yml      # Daily job fetch & static generation
├── public/
│   └── index.html               # Dynamic frontend (with backend)
├── docs/                        # Generated static site (for GitHub Pages)
│   └── index.html               # Auto-generated with job data
├── .gitignore                   # Git ignore rules
├── package.json                 # Node.js dependencies and scripts
├── server.js                    # Express.js server
├── generate-static.js           # Static HTML generator script
└── README.md                    # This file
```

## Technologies Used

- **Backend**: Express.js, Node.js native fetch API, jsdom
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Deployment**: GitHub Actions, GitHub Pages
- **Build Tools**: Node.js, npm

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/milljoniaer/job-search-aggregator/issues).
