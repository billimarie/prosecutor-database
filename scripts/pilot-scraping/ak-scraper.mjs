import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const BASE_URL = 'https://law.alaska.gov/department/criminal/offices.html';

const outCsv = './public/data/2026-pilot-ak.csv';
const csvHeader = [
  'id',
  'name',
  'office',
  'jurisdiction',
  'state',
  'county_or_region',
  'small_town_focus',
  'source_urls',
  'notes',
  'last_verified_at'
].join(',');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function isSmallTown(city) {
  // Define Alaska large urban centers
  return !['Anchorage', 'Fairbanks', 'Juneau', 'Palmer'].includes(city);
}

const today = new Date().toISOString();

async function scrape() {
  const res = await axios.get(BASE_URL);
  const $ = cheerio.load(res.data);

  const rows = [];
  // Find every da office anchor
  $('a[name^="anchor_"]').each((i, anchor) => {
    const $anchor = $(anchor);
    // City name from anchor
    const anchorName = $anchor.attr('name'); // e.g. "anchor_anchorage"
    const city = anchorName.replace('anchor_', '');
    const cityTitle = city.charAt(0).toUpperCase() + city.slice(1);

    // Move forward in the DOM to find the next <b> matching "Supervising District Attorney"
    let parent = $anchor.parent();
    let foundDA = false;
    let supervisingDA = '';
    let notes = '';
    parent.find('b').each((_, bold) => {
      const t = $(bold).text();
      if (/supervising.+district attorney/i.test(t)) {
        // Look for "Supervising District Attorney: Name"
        const sibling = $(bold)[0].nextSibling && $(bold)[0].nextSibling.nodeValue;
        // Try to extract name after colon, else try next sibling text
        const possible = t.split(':')[1] ? t.split(':')[1] : '';
        supervisingDA = possible.trim() || (sibling ? sibling.trim() : '');
        notes = t;
        foundDA = true;
      }
    });
    if (!foundDA) {
      // Fallback: first bold in this office section (not perfect)
      supervisingDA = parent.find('b').first().text().replace(/^Supervising.+:?\s*/, '').trim();
      notes = 'No Supervising DA field, guessed from context';
    }
    if (!supervisingDA) return;

    const officeId = `prosecutor_ak_${slugify(city)}`;
    const csvRow = [
      officeId,
      supervisingDA,
      'District Attorney',
      cityTitle,
      'AK',
      cityTitle,
      isSmallTown(cityTitle) ? 'true' : 'false',
      `${BASE_URL}#${anchorName}`,
      notes,
      today
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');

    rows.push(csvRow);
  });

  fs.writeFileSync(outCsv, csvHeader + '\n' + rows.join('\n'), 'utf8');
  console.log(`Wrote ${rows.length} Alaska DAs to ${outCsv}`);
}

scrape();