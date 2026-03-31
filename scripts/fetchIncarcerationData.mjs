import fs from 'fs';
import { parse } from 'csv-parse/sync';
import axios from 'axios';

/**
 * Script to fetch Vera Incarceration Trends and extract specific counties.
 * Usage: node scripts/fetchIncarcerationData.mjs --fips 13175,13167,42075
 */

const VERA_CSV_URL = 'https://raw.githubusercontent.com/vera-institute/incarceration-trends/main/incarceration_trends_county.csv';
const TARGET_FILE = './src/data/incarcerationTrends.json';

async function run() {
  const args = process.argv.slice(2);
  const fipsFlagIndex = args.indexOf('--fips');
  const targetFips = fipsFlagIndex !== -1 ? args[fipsFlagIndex + 1].split(',') : [];

  if (targetFips.length === 0) {
    console.error('Please specify FIPS codes: --fips 13175,12345');
    process.exit(1);
  }

  console.log(`Fetching Vera dataset (this may take a while)...`);
  try {
    const response = await axios({
      method: 'get',
      url: VERA_CSV_URL,
      responseType: 'text'
    });

    console.log('Parsing CSV...');
    const records = parse(response.data, {
      columns: true,
      skip_empty_lines: true
    });

    const results = {};
    targetFips.forEach(f => results[f] = []);

    console.log(`Filtering for FIPS: ${targetFips.join(', ')}`);
    records.forEach(row => {
      if (targetFips.includes(row.fips)) {
        const year = parseInt(row.year);
        if (year >= 2002 && year <= 2022) {
          results[row.fips].push({
            year,
            jail: parseFloat(row.jail_pop_rate) || 0,
            prison: parseFloat(row.prison_pop_rate) || 0
          });
        }
      }
    });

    // Load existing data to merge
    let existing = {};
    if (fs.existsSync(TARGET_FILE)) {
      existing = JSON.parse(fs.readFileSync(TARGET_FILE, 'utf8'));
    }

    const finalData = { ...existing, ...results };
    fs.writeFileSync(TARGET_FILE, JSON.stringify(finalData, null, 2));

    console.log(`Success! Updated ${TARGET_FILE} with data for ${targetFips.length} counties.`);
  } catch (err) {
    console.error('Error fetching or processing data:', err.message);
  }
}

run();
