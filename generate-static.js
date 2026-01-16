#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Job portal configurations (same as server.js)
const JOB_PORTAL_URLS = [
  {
    name: "Porsche Consulting",
    url: "https://porsche-beesite-production-gjb.app.beesite.de/search/?data=%7B%22SearchParameters%22%3A%7B%22FirstItem%22%3A1%2C%22CountItem%22%3A0%2C%22MatchedObjectDescriptor%22%3A%5B%22Facet%3APositionLocation.City%22%5D%7D%2C%22SearchCriteria%22%3A%5B%7B%22CriterionName%22%3A%22PublicationChannel.Code%22%2C%22CriterionValue%22%3A%5B%2212%22%5D%7D%2C%7B%22CriterionName%22%3A%22CareerLevel.Code%22%2C%22CriterionValue%22%3A%5B%2212%22%5D%7D%2C%7B%22CriterionName%22%3A%22ParentOrganization%22%2C%22CriterionValue%22%3A%5B%225305%22%5D%7D%5D%2C%22LanguageCode%22%3A%22DE%22%7D",
  },
  {
    name: "MHP - A Porsche Company",
    url: "https://porsche-beesite-production-gjb-mhp.app.beesite.de/search/?data=%7B%22LanguageCode%22%3A%22DE%22%2C%22SearchParameters%22%3A%7B%22FirstItem%22%3A1%2C%22CountItem%22%3A10%2C%22Sort%22%3A%5B%7B%22Criterion%22%3A%22PublicationStartDate%22%2C%22Direction%22%3A%22DESC%22%7D%5D%2C%22MatchedObjectDescriptor%22%3A%5B%22ID%22%2C%22PositionTitle%22%2C%22PositionURI%22%2C%22PositionShortURI%22%2C%22PositionLocation.CountryName%22%2C%22PositionLocation.CityName%22%2C%22PositionLocation.Longitude%22%2C%22PositionLocation.Latitude%22%2C%22PositionLocation.PostalCode%22%2C%22PositionLocation.StreetName%22%2C%22PositionLocation.BuildingNumber%22%2C%22PositionLocation.Distance%22%2C%22JobCategory.Name%22%2C%22PublicationStartDate%22%2C%22ParentOrganizationName%22%2C%22ParentOrganization%22%2C%22OrganizationShortName%22%2C%22CareerLevel.Name%22%2C%22JobSector.Name%22%2C%22PositionIndustry.Name%22%2C%22PublicationCode%22%2C%22PublicationChannel.Id%22%5D%7D%2C%22SearchCriteria%22%3A%5B%7B%22CriterionName%22%3A%22CareerLevel.Code%22%2C%22CriterionValue%22%3A%5B%2212%22%5D%7D%2C%7B%22CriterionName%22%3A%22PositionLocation.City%22%2C%22CriterionValue%22%3A%5B%2215%22%5D%7D%2C%7B%22CriterionName%22%3A%22PublicationChannel.Code%22%2C%22CriterionValue%22%3A%5B%2288%22%5D%7D%2C%7B%22CriterionName%22%3A%22JobCategory.Code%22%2C%22CriterionValue%22%3A%5B%22%22%5D%7D%2C%7B%22CriterionName%22%3A%22CareerLevel.Code%22%2C%22CriterionValue%22%3A%5B%22%22%5D%7D%2C%7B%22CriterionName%22%3A%22PositionSchedule.Code%22%2C%22CriterionValue%22%3A%5B%22%22%5D%7D%2C%7B%22CriterionName%22%3A%22PositionOfferingType.Code%22%2C%22CriterionValue%22%3A%5B%22%22%5D%7D%2C%7B%22CriterionName%22%3A%22PositionLocation.Country%22%2C%22CriterionValue%22%3A%5B%22%22%5D%7D%2C%7B%22CriterionName%22%3A%22PositionLocation.City%22%2C%22CriterionValue%22%3A%5B%22%22%5D%7D%5D%7D",
  },
  {
    name: "BCG Platinion - Graduates",
    url: "https://platinion.avature.net/CareersDeEn/SearchJobs/?3_31_3=%5B%22144951%22%5D&3_25_3=%5B%2236510%22%5D",
  },
  {
    name: "BCG Platinion - Young Professional",
    url: "https://platinion.avature.net/CareersDeEn/SearchJobs/?3_31_3=%5B%22144951%22%5D&3_25_3=%5B%2236378%22%5D",
  },
  {
    name: "Siemens Advarta",
    url: "https://jobs.siemens.com/de_DE/externaljobs/SearchJobs/?42386=%5B812132%5D&42386_format=17546&42387=%5B813141%5D&42387_format=17547&42390=%5B102155%2C102156%5D&42390_format=17550&42394=32346191&42394_format=17553&listFilterMode=1&folderRecordsPerPage=6&",
  },
  {
    name: "McKinsey",
    url: "https://gateway.mckinsey.com/apigw-x0cceuow60/v1/api/jobs/search?pageSize=20&start=1&cities=Munich&interest=Analytics,Consulting,Digital,Implementation,Research&functions=Technology&lang=de",
  },
];

const DEFAULT_EXCLUDE_KEYWORDS = ["Senior ", "Lead ", "Security", "Experienced ", "Expert ", "Praktikum", "Intern"];

// Helper functions for parsing jobs (copied from server.js)
function parseJobsFromJson(data) {
  const jobs = [];
  
  const searchResult = data?.SearchResult ?? null;
  const searchResults =
    searchResult?.SearchResultItems ??
    data?.docs ??
    data?.results ??
    data?.items ??
    data?.SearchResultItems ??
    [];
  
  if (!Array.isArray(searchResults)) return jobs;
  
  for (const obj of searchResults) {
    const job = obj?.MatchedObjectDescriptor ?? obj ?? {};
    
    const title = job?.PositionTitle ?? job?.title ?? job?.jobTitle ?? "N/A";
    
    let location = "N/A";
    const posLoc = job?.PositionLocation ?? job?.positionLocation ?? job?.locations;
    if (Array.isArray(posLoc)) {
      const cities = posLoc.map((j) => j?.CityName?.Name ?? j?.CityName ?? j?.City ?? j?.city ?? "N/A");
      location = cities.join(", ");
    } else if (posLoc && typeof posLoc === "object") {
      location =
        posLoc?.CityName?.Name ??
        posLoc?.CityName ??
        posLoc?.City ??
        posLoc?.city ??
        posLoc?.PositionLocation?.CityName ??
        "N/A";
    }
    
    const link = job?.PositionURI ?? job?.jobApplyURL ?? job?.url ?? job?.applyUrl ?? "N/A";
    
    jobs.push({ title, location, link });
  }
  
  return jobs;
}

function parseJobsFromHtml(htmlText, baseUrl) {
  const jobs = [];
  const dom = new JSDOM(htmlText);
  const document = dom.window.document;
  
  const jobNodes = document.querySelectorAll(".listSingleColumnItemTitle, .article__header");
  
  jobNodes.forEach((node) => {
    const a = node.querySelector("a");
    const title = a?.textContent?.trim() || node.textContent?.trim() || "N/A";
    const href = a?.getAttribute("href") || null;
    
    const locNode = node.querySelector(".list-item-jobCity");
    const location = locNode?.textContent?.trim() || "N/A";
    
    let link = null;
    if (href) {
      try {
        link = new URL(href, baseUrl).toString();
      } catch {
        link = href;
      }
    }
    
    jobs.push({ title, location, link: link || "N/A" });
  });
  
  return jobs;
}

function contentTypeLooksJson(ct) {
  if (!ct) return false;
  return ct.toLowerCase().includes("application/json") || ct.toLowerCase().includes("+json");
}

// Fetch jobs from all portals
async function fetchAllJobs() {
  console.log('Fetching jobs from all portals...');
  
  const fetchPromises = JOB_PORTAL_URLS.map(async (portal) => {
    try {
      console.log(`Fetching from ${portal.name}...`);
      
      const response = await fetch(portal.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/html, */*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type') || '';
      let jobsParsed = [];
      
      if (contentTypeLooksJson(contentType)) {
        const data = await response.json();
        jobsParsed = parseJobsFromJson(data);
      } else {
        const text = await response.text();
        const trimmed = text.trim();
        
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            const data = JSON.parse(trimmed);
            jobsParsed = parseJobsFromJson(data);
          } catch {
            jobsParsed = parseJobsFromHtml(text, portal.url);
          }
        } else {
          jobsParsed = parseJobsFromHtml(text, portal.url);
        }
      }
      
      console.log(`${portal.name}: ${jobsParsed.length} jobs`);
      
      return {
        name: portal.name,
        url: portal.url,
        jobs: jobsParsed,
        error: null
      };
      
    } catch (error) {
      console.error(`Error fetching from ${portal.name}:`, error.message);
      return {
        name: portal.name,
        url: portal.url,
        jobs: [],
        error: error.message
      };
    }
  });
  
  const results = await Promise.all(fetchPromises);
  return results;
}

// Generate static HTML file
async function generateStaticHTML(portalsData) {
  const lastUpdated = new Date().toISOString();
  const totalJobs = portalsData.reduce((sum, p) => sum + p.jobs.length, 0);
  
  // Escape HTML
  const escapeHtml = (s) => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  
  const html = `<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Job Portal Aggregator (Static)</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-slate-950 text-slate-100">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400"></div>
                    <div>
                        <h1 class="text-lg font-semibold leading-tight">Job Portal Aggregator</h1>
                        <p class="text-xs text-slate-400">Pre-fetched data with client-side filtering</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button id="filterBtn"
                        class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 active:scale-[0.99]">
                        Apply Filters
                    </button>
                    <button id="clearBtn"
                        class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 active:scale-[0.99]">
                        Clear Filters
                    </button>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-6xl px-4 py-6">
            <!-- Notice -->
            <div class="mb-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                <p class="text-sm text-blue-100">
                    <span class="font-semibold">Static Data:</span> Job listings are fetched daily at 7 AM UTC and pre-loaded into this page.
                    Filtering happens entirely in your browser.
                </p>
                <p class="mt-2 text-xs text-blue-100/80">
                    Last updated: ${escapeHtml(new Date(lastUpdated).toLocaleString())} • Total jobs: ${totalJobs}
                </p>
            </div>

            <!-- Controls -->
            <section class="mb-6 grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h2 class="text-sm font-semibold">Exclude keywords</h2>
                    <p class="mt-1 text-xs text-slate-400">Case-insensitive "contains" filter on titles.</p>
                    <label class="mt-3 block text-xs text-slate-300">Keywords (one per line)</label>
                    <textarea id="excludeInput" rows="7"
                        class="mt-1 w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"></textarea>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h2 class="text-sm font-semibold">Status</h2>
                    <div class="mt-3 space-y-2 text-sm">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">Portals</span>
                            <span id="portalCount" class="font-semibold">${portalsData.length}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">Jobs (after filter)</span>
                            <span id="jobCount" class="font-semibold">${totalJobs}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">Errors</span>
                            <span id="errorCount" class="font-semibold">${portalsData.filter(p => p.error).length}</span>
                        </div>
                    </div>

                    <div class="mt-4 rounded-xl border border-white/10 bg-slate-900/40 p-3">
                        <p class="text-xs text-slate-400">
                            Data is pre-fetched. Filtering happens instantly in your browser.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Results -->
            <section class="space-y-4">
                <div class="flex items-end justify-between">
                    <h2 class="text-base font-semibold">Results</h2>
                </div>

                <div id="results" class="grid gap-4 lg:grid-cols-2"></div>
            </section>
        </main>
    </div>

    <script>
        // Pre-loaded job data
        const jobsData = ${JSON.stringify(portalsData, null, 2)};
        
        const default_exclude_keywords = ${JSON.stringify(DEFAULT_EXCLUDE_KEYWORDS)};

        const $ = (id) => document.getElementById(id);

        function escapeHtml(s) {
            return String(s)
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#039;");
        }

        function getExcludeKeywords() {
            const raw = $("excludeInput").value
                .split("\\n")
                .filter(Boolean);
            return raw.length ? raw : default_exclude_keywords;
        }

        function passesFilter(title, excludeKeywords) {
            const t = (title || "").toLowerCase();
            return !excludeKeywords.some((kw) => t.includes(kw.toLowerCase()));
        }

        function renderPortalCard({ name, url, jobs, error }) {
            const container = $("results");

            const card = document.createElement("div");
            card.className =
                "rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm hover:bg-white/7 transition";

            const header = document.createElement("div");
            header.className = "flex items-start justify-between gap-3";

            header.innerHTML = \`
              <div>
                <h3 class="text-sm font-semibold">\${escapeHtml(name)}</h3>
                <p class="mt-1 text-xs text-slate-400 break-all line-clamp-1" title="\${escapeHtml(url)}">\${escapeHtml(url)}</p>
              </div>
              <span class="shrink-0 rounded-full border border-white/10 bg-slate-900/40 px-2 py-1 text-xs text-slate-300">
                \${error ? "Error" : \`\${jobs.length} jobs\`}
              </span>
            \`;
            card.appendChild(header);

            if (error) {
                const err = document.createElement("div");
                err.className =
                    "mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-xs text-rose-200";
                err.textContent = error;
                card.appendChild(err);
            } else if (jobs.length === 0) {
                const empty = document.createElement("div");
                empty.className =
                    "mt-3 rounded-xl border border-white/10 bg-slate-900/30 p-3 text-xs text-slate-300";
                empty.textContent = "No job postings found after applying filters.";
                card.appendChild(empty);
            } else {
                const list = document.createElement("div");
                list.className = "mt-3 space-y-2";

                for (const j of jobs) {
                    const item = document.createElement("a");
                    item.className =
                        "block rounded-xl border border-white/10 bg-slate-900/30 p-3 hover:bg-slate-900/50 transition";
                    item.target = "_blank";
                    item.rel = "noreferrer";
                    item.href = j.link && j.link !== "N/A" ? j.link : url;

                    item.innerHTML = \`
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <div class="text-sm font-semibold leading-snug">\${escapeHtml(j.title)}</div>
                          <div class="mt-1 text-xs text-slate-400">\${escapeHtml(j.location || "N/A")}</div>
                        </div>
                        <div class="text-xs text-slate-400">↗</div>
                      </div>
                    \`;
                    list.appendChild(item);
                }

                card.appendChild(list);
            }

            container.appendChild(card);
        }

        function clearUI() {
            $("results").innerHTML = "";
        }

        function applyFilters() {
            clearUI();
            
            const excludeKeywords = getExcludeKeywords();
            
            let totalJobs = 0;
            
            for (const portal of jobsData) {
                if (portal.error) {
                    renderPortalCard(portal);
                    continue;
                }
                
                const jobsFiltered = portal.jobs.filter((j) => passesFilter(j.title, excludeKeywords));
                totalJobs += jobsFiltered.length;
                
                renderPortalCard({
                    name: portal.name,
                    url: portal.url,
                    jobs: jobsFiltered,
                    error: portal.error
                });
            }
            
            $("jobCount").textContent = String(totalJobs);
        }

        function clearFilters() {
            $("excludeInput").value = default_exclude_keywords.join("\\n");
            applyFilters();
        }

        // Initialize
        $("excludeInput").value = default_exclude_keywords.join("\\n");
        $("filterBtn").addEventListener("click", applyFilters);
        $("clearBtn").addEventListener("click", clearFilters);
        
        // Apply filters on load
        applyFilters();
    </script>
</body>

</html>`;

  return html;
}

// Main function
async function main() {
  try {
    console.log('Starting job aggregation...');
    const portalsData = await fetchAllJobs();
    
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
