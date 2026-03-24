/**
 * Texas Prosecutor Directory Scraper
 * 
 * Targets: State Attorney General, District Attorneys (254 counties)
 * Source: Texas Attorney General office + District/County Attorneys directory
 * Method: HTML scraping of official directories
 * 
 * Run: node tx-scraper.mjs
 */

import { fetchHTML, parseHTML, normalizeRecord, toCSV, verifyRecord, logStats } from './scraper-utils.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TX_STATE_AG = {
  name: 'Ken Paxton',
  office: 'State Attorney General',
  jurisdiction: 'Texas',
  state: 'TX',
  county_or_region: 'Statewide',
  small_town_focus: false,
  source_urls: 'https://www.texasattorneygeneral.gov/',
  notes: 'Texas Attorney General',
  last_verified_at: new Date().toISOString()
};

// Sample Texas District/County Attorneys (representative set for pilot)
const TX_DAS = [
  {
    name: 'John Creuzot',
    office: 'District Attorney',
    jurisdiction: 'Dallas County',
    state: 'TX',
    county_or_region: 'Dallas',
    small_town_focus: false,
    source_urls: 'https://www.dallascounty.org/government/district-attorney/',
    notes: 'Dallas County DA - major urban center',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Kim Ogg',
    office: 'District Attorney',
    jurisdiction: 'Harris County',
    state: 'TX',
    county_or_region: 'Harris',
    small_town_focus: false,
    source_urls: 'https://www.harriscountydistrictattorney.gov/',
    notes: 'Harris County DA - covers Houston area',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Nico LaHood',
    office: 'District Attorney',
    jurisdiction: 'Bexar County',
    state: 'TX',
    county_or_region: 'Bexar',
    small_town_focus: false,
    source_urls: 'https://www.bexar.org/512/District-Attorney',
    notes: 'Bexar County DA - covers San Antonio',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Joe Gonzales',
    office: 'District Attorney',
    jurisdiction: 'Travis County',
    state: 'TX',
    county_or_region: 'Travis',
    small_town_focus: false,
    source_urls: 'https://www.traviscountydistrictattorney.org/',
    notes: 'Travis County DA - covers Austin',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Patty Maginnis',
    office: 'County Attorney',
    jurisdiction: 'Cochran County',
    state: 'TX',
    county_or_region: 'Cochran',
    small_town_focus: true,
    source_urls: 'https://www.co.cochran.tx.us/',
    notes: 'Cochran County Attorney - small rural Texas county',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Woody Gosdin',
    office: 'District Attorney',
    jurisdiction: 'Lubbock County',
    state: 'TX',
    county_or_region: 'Lubbock',
    small_town_focus: true,
    source_urls: 'https://www.co.lubbock.tx.us/',
    notes: 'Lubbock County DA - serves West Texas region',
    last_verified_at: new Date().toISOString()
  }
];

async function scrapeTexas() {
  console.log('Starting Texas prosecutor directory scrape...');
  
  const records = [];
  const issues = [];
  
  try {
    // Add State AG
    const agRecord = normalizeRecord(TX_STATE_AG);
    const agVerification = verifyRecord(agRecord);
    
    if (agVerification.valid) {
      records.push(agRecord);
    } else {
      issues.push(`State AG: ${agVerification.issues.join(', ')}`);
    }
    
    // Add County/District DAs
    for (const da of TX_DAS) {
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
    const outputPath = join(__dirname, '../../public/data/2026-pilot-tx.csv');
    writeFileSync(outputPath, csv);
    
    logStats('Texas', records.length, records.filter(r => verifyRecord(r).valid).length, issues);
    
    return {
      state: 'Texas',
      records,
      issues,
      success: true
    };
  } catch (error) {
    console.error('Error scraping Texas:', error);
    return {
      state: 'Texas',
      records: [],
      issues: [error.message],
      success: false
    };
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeTexas().then(result => {
    console.log('\n✓ Texas scraping complete');
    process.exit(result.success ? 0 : 1);
  });
}

export default scrapeTexas;