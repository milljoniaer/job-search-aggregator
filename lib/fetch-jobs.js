import { JSDOM } from 'jsdom';

// Job portal configurations
export const JOB_PORTAL_URLS = [
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
  {
    name: "BMW Group",
    url: "https://www.bmwgroup.jobs/de/de/_jcr_content/main/layoutcontainer/jobfinder30_copy.jobfinder_table.content.html?filterSearch=jobType_STANDARD%2CjobType_GRADUATE_JOB%2Clocation_DE%2FMunich%2CjobField_InformationTechnology%2CjobField_ResearchDevelopment%2CjobField_Consultancy&rowIndex=0&blockCount=22",
  }
];

export const DEFAULT_EXCLUDE_KEYWORDS = ["Senior ", "Lead ", "Security", "Experienced ", "Expert ", "Praktikum", "Intern"];

// Helper function to parse jobs from JSON data
export function parseJobsFromJson(data) {
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

// Helper function to parse jobs from HTML
export function parseJobsFromHtml(htmlText, baseUrl) {
  const jobs = [];
  const dom = new JSDOM(htmlText);
  const document = dom.window.document;

  const jobNodes = document.querySelectorAll(".listSingleColumnItemTitle, .article__header, .grp-jobfinder__wrapper");

  jobNodes.forEach((node) => {
    const a = node.querySelector("a");
    const standaloneTitleElement = node.querySelector(".grp-jobfinder__cell-title");
    const title = standaloneTitleElement?.textContent?.trim() || a?.textContent?.trim() || node.textContent?.trim() || "N/A";
    const href = a?.getAttribute("href") || null;

    const locNode = node.querySelector(".list-item-jobCity, .grp-jobfinder-cell-location");
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

// Helper function to check if content type is JSON
export function contentTypeLooksJson(ct) {
  if (!ct) return false;
  return ct.toLowerCase().includes("application/json") || ct.toLowerCase().includes("+json");
}

// Helper function to filter jobs by exclude keywords
export function passesFilter(title, excludeKeywords) {
  const t = (title || "").toLowerCase();
  return !excludeKeywords.some((kw) => t.includes(kw.toLowerCase()));
}

// Main function to fetch jobs from all portals
export async function fetchAllJobs(excludeKeywords = DEFAULT_EXCLUDE_KEYWORDS) {
  console.log('Fetching jobs from all portals...');
  console.log('Exclude keywords:', excludeKeywords);

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

      // Apply filters
      const jobsFiltered = jobsParsed.filter((j) => passesFilter(j.title, excludeKeywords));

      console.log(`${portal.name}: ${jobsFiltered.length} jobs (${jobsParsed.length} before filter)`);

      return {
        name: portal.name,
        url: portal.url,
        jobs: jobsFiltered,
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
