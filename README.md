# Job Search Aggregator

A modern job portal aggregator with an Express.js backend proxy and a client-side web interface. This application aggregates job listings from multiple portals and provides filtering capabilities.

## Features

- **Express.js Backend**: Server-side CORS proxy to bypass cross-origin restrictions
- **Static Frontend**: Beautiful, responsive UI built with Tailwind CSS
- **Job Aggregation**: Fetches jobs from multiple portals (Porsche Consulting, MHP, BCG Platinion, Siemens Advarta, McKinsey)
- **Smart Parsing**: Automatically detects and parses JSON and HTML responses
- **Keyword Filtering**: Exclude unwanted job postings based on keywords
- **GitHub Pages Deployment**: Automatic deployment via GitHub Actions

## Live Demo

Visit the live application at: [https://milljoniaer.github.io/job-search-aggregator/](https://milljoniaer.github.io/job-search-aggregator/)

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

## API Documentation

### Proxy Endpoint

**Endpoint**: `/api/proxy`

**Method**: GET

**Query Parameters**:
- `url` (required): The URL to proxy

**Description**: Fetches content from external URLs server-side, bypassing CORS restrictions.

**Example**:
```bash
curl "http://localhost:3000/api/proxy?url=https://example.com/api/jobs"
```

**Response**: Returns the content from the proxied URL with appropriate headers.

**Error Responses**:
- `400 Bad Request`: Missing `url` parameter
- `500 Internal Server Error`: Proxy request failed
- `<status>`: Forwards status from the proxied URL if it fails

## Environment Variables

- `PORT`: The port to run the server on (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## Using the Application

### Without Proxy (GitHub Pages)

When deployed to GitHub Pages, the application works as a purely client-side app. Most job portals will block requests due to CORS restrictions. This is expected behavior.

### With Proxy (Local Server)

1. Start the Express server locally: `npm start`
2. Open the web interface at `http://localhost:3000`
3. In the "Proxy (optional)" field, enter: `http://localhost:3000/api/proxy?url={URL}`
4. Click "Run" to fetch and aggregate job listings

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

### GitHub Pages

The project automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow:

1. Checks out the code
2. Sets up Node.js environment
3. Installs dependencies
4. Uploads the `public` directory as an artifact
5. Deploys to GitHub Pages

### Manual Deployment

To deploy manually, push to the main branch or trigger the workflow from the Actions tab in GitHub.

## Project Structure

```
job-search-aggregator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── index.html              # Frontend application
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js dependencies and scripts
├── server.js                   # Express.js server
└── README.md                   # This file
```

## Technologies Used

- **Backend**: Express.js, Node.js native fetch API
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
