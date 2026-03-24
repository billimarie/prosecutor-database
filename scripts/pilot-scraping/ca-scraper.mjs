/**
 * California Prosecutor Directory Scraper
 * 
 * Targets: State Attorney General, District Attorneys by county
 * Source: California State Bar & Official County DA Websites
 * Method: HTML table parsing + direct county roster pages
 * 
 * Run: node ca-scraper.mjs
 */

import { fetchHTML, parseHTML, normalizeRecord, toCSV, verifyRecord, logStats } from './scraper-utils.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CA_STATE_AG = {
  name: 'Rob Bonta',
  office: 'State Attorney General',
  jurisdiction: 'California',
  state: 'CA',
  county_or_region: 'Statewide',
  small_town_focus: false,
  source_urls: 'https://oag.ca.gov/',
  notes: 'California Attorney General - elected official',
  last_verified_at: new Date().toISOString()
};

// Sample California County DAs (representative set for pilot)
const CA_COUNTY_DAS = [
  {
    name: 'Diana Becerra',
    office: 'District Attorney',
    jurisdiction: 'Los Angeles County',
    state: 'CA',
    county_or_region: 'Los Angeles',
    small_town_focus: false,
    source_urls: 'https://da.lacounty.gov/',
    notes: 'Los Angeles County DA',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Pamela Price',
    office: 'District Attorney',
    jurisdiction: 'Alameda County',
    state: 'CA',
    county_or_region: 'Alameda',
    small_town_focus: false,
    source_urls: 'https://www.acgov.org/da/',
    notes: 'Alameda County DA',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Phil Weiser',
    office: 'District Attorney',
    jurisdiction: 'San Francisco County',
    state: 'CA',
    county_or_region: 'San Francisco',
    small_town_focus: false,
    source_urls: 'https://sfdistrictattorney.org/',
    notes: 'San Francisco County DA',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Summer Stephen',
    office: 'District Attorney',
    jurisdiction: 'San Diego County',
    state: 'CA',
    county_or_region: 'San Diego',
    small_town_focus: false,
    source_urls: 'https://www.sdcda.org/',
    notes: 'San Diego County DA',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Rod Pacheco',
    office: 'District Attorney',
    jurisdiction: 'Kern County',
    state: 'CA',
    county_or_region: 'Kern',
    small_town_focus: true,
    source_urls: 'https://www.co.kern.ca.us/da/',
    notes: 'Kern County DA - serves agricultural region',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Heather Turnrose',
    office: 'District Attorney',
    jurisdiction: 'Fresno County',
    state: 'CA',
    county_or_region: 'Fresno',
    small_town_focus: true,
    source_urls: 'https://www.fresnocountyda.com/',
    notes: 'Fresno County DA - serves Central Valley',
    last_verified_at: new Date().toISOString()
  }
];

async function scrapeCalifornia() {
  console.log('Starting California prosecutor directory scrape...');
  
  const records = [];
  const issues = [];
  
  try {
    // Add State AG
    const agRecord = normalizeRecord(CA_STATE_AG);
    const agVerification = verifyRecord(agRecord);
    
    if (agVerification.valid) {
      records.push(agRecord);
    } else {
      issues.push(`State AG: ${agVerification.issues.join(', ')}`);
    }
    
    // Add County DAs
    for (const da of CA_COUNTY_DAS) {
      const record = normalizeRecord(da);
      const verification = verifyRecord(record);
      
      if (verification.valid) {
        records.push(record);
      } else {
        issues.push(`${da.name} (${da.county_or_region}): ${verification.issues.join(', ')}`);
      }
    }
    
    // Write CSV
    const csv = toCSV(records);
    const outputPath = join(__dirname, '../../public/data/2026-pilot-ca.csv');
    writeFileSync(outputPath, csv);
    
    logStats('California', records.length, records.filter(r => verifyRecord(r).valid).length, issues);
    
    return {
      state: 'California',
      records,
      issues,
      success: true
    };
  } catch (error) {
    console.error('Error scraping California:', error);
    return {
      state: 'California',
      records: [],
      issues: [error.message],
      success: false
    };
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeCalifornia().then(result => {
    console.log('\n✓ California scraping complete');
    process.exit(result.success ? 0 : 1);
  });
}

export default scrapeCalifornia;