import fs from 'fs';
import { parse } from 'csv-parse/sync';
import axios from 'axios';

/**
 * Script to fetch Vera Incarceration Trends and extract specific counties + state averages.
 * Usage: 
 *   node scripts/fetchIncarcerationData.mjs --fips 13175,13167
 *   node scripts/fetchIncarcerationData.mjs --generate-averages
 */

const VERA_CSV_URL = 'https://raw.githubusercontent.com/vera-institute/incarceration-trends/main/incarceration_trends_county.csv';
const TARGET_FILE = './src/data/incarcerationTrends.json';
const STATE_AVG_FILE = './src/data/stateAverages.json';

async function run() {
  const args = process.argv.slice(2);
  const fipsFlagIndex = args.indexOf('--fips');
  const targetFips = fipsFlagIndex !== -1 ? args[fipsFlagIndex + 1].split(',') : [];
  const genAverages = args.includes('--generate-averages');

  if (targetFips.length === 0 && !genAverages) {
    console.error('Please specify FIPS codes: --fips 13175,12345 or --generate-averages');
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
      skip_empty_lines: true,
      trim: true
    });

    // 1. Generate State Averages if requested
    if (genAverages) {
      console.log("Generating State Averages (2002-2022)...");
      const stateStats = {}; // { "GA": { "2022": { jailSum: 0, prisonSum: 0, count: 0 } } }

      records.forEach(row => {
        const year = parseInt(row.year);
        const state = row.state_abbr;
        if (year >= 2002 && year <= 2022 && state) {
          if (!stateStats[state]) stateStats[state] = {};
          if (!stateStats[state][year]) stateStats[state][year] = { jailSum: 0, prisonSum: 0, count: 0 };
          
          stateStats[state][year].jailSum += parseFloat(row.total_jail_pop_rate) || 0;
          stateStats[state][year].prisonSum += parseFloat(row.total_prison_pop_rate) || 0;
          stateStats[state][year].count += 1;
        }
      });

      const finalAverages = {};
      Object.entries(stateStats).forEach(([state, years]) => {
        finalAverages[state] = Object.entries(years).map(([year, stats]) => ({
          year: parseInt(year),
          jail: Math.round(stats.jailSum / stats.count),
          prison: Math.round(stats.prisonSum / stats.count)
        })).sort((a, b) => a.year - b.year);
      });

      fs.writeFileSync(STATE_AVG_FILE, JSON.stringify(finalAverages, null, 2));
      console.log(`✅ Success! State averages saved to ${STATE_AVG_FILE}`);
    }

    // 2. Extract specific FIPS if requested
    if (targetFips.length > 0) {
      const results = {};
      targetFips.forEach(f => results[f] = []);

      console.log(`Filtering for FIPS: ${targetFips.join(', ')}`);
      records.forEach(row => {
        if (targetFips.includes(row.county_fips)) {
          const year = parseInt(row.year);
          if (year >= 2002 && year <= 2022) {
            results[row.county_fips].push({
              year,
              jail: parseFloat(row.total_jail_pop_rate) || 0,
              prison: parseFloat(row.total_prison_pop_rate) || 0
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
      console.log(`✅ Success! Updated ${TARGET_FILE} with data for ${targetFips.length} counties.`);
    }
  } catch (err) {
    console.error('Error fetching or processing data:', err.message);
  }
}

run();
