import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const LIST_URL = 'https://law.alaska.gov/department/criminal/da.html';
const BASE_DOMAIN = 'https://law.alaska.gov';

const outCsv = './public/data/2026-pilot-ak.csv';
const csvHeader = [
  'id', 'name', 'office', 'jurisdiction', 'state', 'county_or_region', 
  'small_town_focus', 'source_urls', 'notes', 'last_verified_at'
].join(',');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

async function scrape() {
  console.log(`Fetching office list from ${LIST_URL}...`);
  const res = await axios.get(LIST_URL);
  const $ = cheerio.load(res.data);

  const officeLinks = [];
  // Find links to office pages in the main paragraph
  $('a[href*="DA-"], a[href*="adao.html"]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.endsWith('.html')) {
      const fullUrl = href.startsWith('http') ? href : `${BASE_DOMAIN}/department/criminal/${href}`;
      if (!officeLinks.includes(fullUrl)) {
        officeLinks.push(fullUrl);
      }
    }
  });

  console.log(`Found ${officeLinks.length} office links. Extraction starting...`);
  const today = new Date().toISOString();
  const rows = [];

  for (const link of officeLinks) {
    try {
      const officeRes = await axios.get(link);
      const $o = cheerio.load(officeRes.data);
      
      const officeName = $o('h1').first().text().replace("District Attorney's Office", "").trim();
      
      // Selectors based on latest structure
      let daName = $o('.entry-content p span.bold').first().text().trim();
      if (!daName || /Office Contact/i.test(daName)) {
        // Try the image alt approach
        daName = $o('.entry-content img[alt*="District Attorney"]').attr('alt')?.split(',')[0] || '';
      }

      if (!daName) {
         // Final fallback: look for first bold text in .featured-content or entry-content
         daName = $o('.entry-content .bold').first().text().trim();
      }

      if (!daName || /Office Contact/i.test(daName)) {
         console.warn(`Could not find DA name for ${officeName} at ${link}`);
         continue;
      }

      const id = `prosecutor_ak_${slugify(officeName)}`;
      const row = [
        id,
        daName,
        'District Attorney',
        officeName,
        'AK',
        officeName,
        !['Anchorage', 'Fairbanks', 'Juneau', 'Palmer'].includes(officeName) ? 'true' : 'false',
        link,
        'Scraped from regional office page',
        today
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');

      rows.push(row);
      console.log(`✅ Extracted: ${daName} (${officeName})`);
    } catch (e) {
      console.error(`Failed to scrape ${link}: ${e.message}`);
    }
  }

  fs.writeFileSync(outCsv, csvHeader + '\n' + rows.join('\n'), 'utf8');
  console.log(`\nWrote ${rows.length} Alaska DAs to ${outCsv}`);
}

scrape();