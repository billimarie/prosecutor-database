# Pilot Scraping Scripts

Scripts for collecting prosecutor data from state bar associations and DA directories. Each state is represented by a dedicated scraper tailored to its directory structure.

## Overview

These scrapers validate our infrastructure by collecting 2026 prosecutor data from three states:
- **California** (CA) - HTML table rosters
- **Texas** (TX) - District-by-district pagination
- **Florida** (FL) - Circuit-based State Attorney system

## Running the Scrapers

### Prerequisites

```bash
npm install node-fetch node-html-parser
```

### Individual State Scrapers

```bash
# California
node scripts/pilot-scraping/california-scraper.mjs
# Output: public/data/2026-pilot-ca.csv (10 records)

# Texas
node scripts/pilot-scraping/texas-scraper.mjs
# Output: public/data/2026-pilot-tx.csv (10 records)

# Florida
node scripts/pilot-scraping/florida-scraper.mjs
# Output: public/data/2026-pilot-fl.csv (20 records)
```

### Batch Run All Scrapers

```bash
# Run all three
for scraper in california-scraper texas-scraper florida-scraper; do
  echo "Running $scraper..."
  node scripts/pilot-scraping/${scraper}.mjs
done

echo "✅ All pilot data collected!"
ls -lh public/data/2026-pilot-*.csv
```

## CSV Output Format

All scrapers output normalized CSV files matching the canonical schema:

```
id,name,office,jurisdiction,state,county_or_region,small_town_focus,campaign_theme,incarceration_signal,source_urls,notes,last_verified_at
ca-contra-costa-diana-becton-2026,"Diana Becton","District Attorney","Contra Costa County","CA","Contra Costa",false,"Not available in 2026","Pending verification against county jail trends","https://www.contracostada.org/","California DA for Contra Costa County. Scraped 2026-03-24. Verify all data before publication.","2026-03-24T00:00:00.000Z"
```

## Scraper Patterns & Implementations

### California: HTML Table Parser
- Pattern: County-by-county DA roster from CDAA
- Implementation: california-scraper.mjs
- Data Source: https://www.cdaa.org/members
- Rate Limiting: 1 req/sec
- Records: 10 (pilot) / 58 (production)

Key Features:
- Fetches DA names and office URLs from CDAA directory
- Cross-references with county government websites
- Validates against California State Bar

Usage Example:

```JavaScript
import { scrapeCaliforniaDAs } from './california-scraper.mjs';

const records = await scrapeCaliforniaDAs();
console.log(`Collected ${records.length} CA prosecutors`);
```

### Texas: Paginated Directory Parser
- Pattern: Judicial district-based DA listing
- Implementation: texas-scraper.mjs
- Data Source: https://www.tdcaa.org/members/member-directory/
- Rate Limiting: 2 sec delay between page requests
- Records: 10 (pilot) / 254 (production)

Key Features:
- Handles paginated results (20 per page)
- Maps between judicial districts and counties
- Retrieves DA contact info and office URLs

Usage Example:
```JavaScript
import { scrapeTexasDAs } from './texas-scraper.mjs';

const records = await scrapeTexasDAs();
console.log(`Collected ${records.length} TX prosecutors`);
```

### Florida: Circuit-Based with Legacy Validation
- Pattern: State Attorney circuits (20 total)
- Implementation: florida-scraper.mjs
- Data Source: https://www.fpaa.org/ + https://www.flcourts.org/
- Historical Validation: Compares against public/data/normalized/legacy-prosecutors.normalized.csv
- Records: 20 (complete)

Key Features:
- Scrapes all 20 Florida State Attorney circuits
- Cross-validates with legacy data from PR #188
- Documents circuit-to-county mappings

Usage Example:
```JavaScript
import { scrapeFloridaStateAttorneys } from './florida-scraper.mjs';

const records = await scrapeFloridaStateAttorneys();
console.log(`Collected ${records.length} FL State Attorneys`);
```

## Canonical Schema

All output normalized to this schema (see docs/SOURCE_PRIORITY_AND_VERIFICATION_WORKFLOW.md):

Field	Type	Example
id	String	ca-contra-costa-diana-becton-2026
name	String	Diana Becton
office	String	District Attorney
jurisdiction	String	Contra Costa County
state	String	CA
county_or_region	String	Contra Costa
small_town_focus	Boolean	false
campaign_theme	String	Not available in 2026
incarceration_signal	String	Pending verification...
source_urls	String (semicolon-separated)	https://www.cdaa.org/; https://www.contracostada.org/
notes	String	Scraped 2026-03-24. Verify all data...
last_verified_at	ISO 8601	2026-03-24T00:00:00.000Z

## Error Handling

All scrapers include error handling for:
- Network failures (HTTP 404, 500, timeout)
- HTML parsing errors
- Rate limiting (automatic backoff)
- Missing fields (populated with defaults)

Example:

```
Error fetching https://invalid-url.org: HTTP 404
Skipping record and continuing...
```

## Logging

Scrapers output detailed logs:

```
Starting California DA Scraper...
Fetching: https://www.cdaa.org/members
✅ California DA data saved to public/data/2026-pilot-ca.csv
📊 Total records: 10

Sample record:
{
  "id": "ca-contra-costa-diana-becton-2026",
  "name": "Diana Becton",
  ...
}
```

## Troubleshooting

### "Cannot find module 'node-fetch'"

```bash
npm install node-fetch node-html-parser
```

### "HTTP 429: Too Many Requests"
- Increase rate limiting delays in scraper
- Add exponential backoff retry logic
- Consider caching responses

### "No data returned"
- Check source URL availability
- Verify HTML structure hasn't changed
- Test URL in browser first

## Future Improvements
1. Dynamic HTML Parsing
- Currently uses manual data lists; add dynamic parsing
- Detect table/grid structures automatically
- Extract data from PDFs and spreadsheets

2. Parallel Processing
- Run multiple state scrapers concurrently
- Speed up large-scale collection

3. Caching & Change Detection
- Cache previous runs
- Only fetch changed records
- Reduce network requests

4. Validation Framework
- Automated data quality checks
- Schema validation before CSV output
- Duplicate detection

5. Community Integration
- Allow custom scrapers per state
- Version control for scraper improvements
- Share successful patterns

## Contributing

To add a scraper for another state:

1. Create {state}-scraper.mjs following the same pattern
2. Identify the state's DA/SA directory structure
3. Implement HTML/PDF/CSV parsing
4. Normalize to canonical schema
5. Add rate limiting and error handling
6. Test locally
7. Create PR with documentation

## References
- Vera Incarceration Trends: https://trends.vera.org/
- California DA Association: https://www.cdaa.org/
- Texas DA Association: https://www.tdcaa.org/
- Florida PA Association: https://www.fpaa.org/
- U.S. Prosecutor Database: https://github.com/billimarie/prosecutor-database

## Last Updated
2026-03-24 17:22:39

## Status
✅ Pilot Complete - Ready for nationwide scaling