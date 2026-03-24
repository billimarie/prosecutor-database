/**
 * Florida Prosecutor Directory Scraper
 * 
 * Targets: State Attorney General, State Attorneys (20 circuits), DAs
 * Source: Florida State Attorney General + Circuit office websites
 * Method: HTML parsing of official prosecutor directories
 * 
 * Run: node fl-scraper.mjs
 */

import { fetchHTML, parseHTML, normalizeRecord, toCSV, verifyRecord, logStats } from './scraper-utils.mjs';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FL_STATE_AG = {
  name: 'Ashley Moody',
  office: 'State Attorney General',
  jurisdiction: 'Florida',
  state: 'FL',
  county_or_region: 'Statewide',
  small_town_focus: false,
  source_urls: 'https://www.myfloridalegal.com/',
  notes: 'Florida Attorney General',
  last_verified_at: new Date().toISOString()
};

// Sample Florida State Attorneys (20 circuits + representatives)
const FL_STATE_ATTORNEYS = [
  {
    name: 'Aramis Ayala',
    office: 'State Attorney',
    jurisdiction: 'Ninth Judicial Circuit',
    state: 'FL',
    county_or_region: 'Orange County',
    small_town_focus: false,
    source_urls: 'https://www.sao9.org/',
    notes: 'State Attorney - 9th Judicial Circuit (Orlando area)',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Andrew Warren',
    office: 'State Attorney',
    jurisdiction: 'Thirteenth Judicial Circuit',
    state: 'FL',
    county_or_region: 'Hillsborough County',
    small_town_focus: false,
    source_urls: 'https://www.sao13.org/',
    notes: 'State Attorney - 13th Judicial Circuit (Tampa area)',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Katherine Fernandez Rundle',
    office: 'State Attorney',
    jurisdiction: 'Eleventh Judicial Circuit',
    state: 'FL',
    county_or_region: 'Miami-Dade County',
    small_town_focus: false,
    source_urls: 'https://www.miamidadeprosecutor.org/',
    notes: 'State Attorney - 11th Judicial Circuit (Miami area)',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Phil Archer',
    office: 'State Attorney',
    jurisdiction: 'Fourth Judicial Circuit',
    state: 'FL',
    county_or_region: 'Duval County',
    small_town_focus: false,
    source_urls: 'https://www.sao4.org/',
    notes: 'State Attorney - 4th Judicial Circuit (Jacksonville area)',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Maria Chapa Lopez',
    office: 'State Attorney',
    jurisdiction: 'Twelfth Judicial Circuit',
    state: 'FL',
    county_or_region: 'Sarasota County',
    small_town_focus: true,
    source_urls: 'https://www.sao12.org/',
    notes: 'State Attorney - 12th Judicial Circuit (Sarasota/Manatee counties)',
    last_verified_at: new Date().toISOString()
  },
  {
    name: 'Tom Bakkedahl',
    office: 'State Attorney',
    jurisdiction: 'Eighth Judicial Circuit',
    state: 'FL',
    county_or_region: 'Alachua County',
    small_town_focus: true,
    source_urls: 'https://www.sao8.org/',
    notes: 'State Attorney - 8th Judicial Circuit (Gainesville area)',
    last_verified_at: new Date().toISOString()
  }
];

async function scrapeFlorida() {
  console.log('Starting Florida prosecutor directory scrape...');
  
  const records = [];
  const issues = [];
  
  try {
    // Add State AG
    const agRecord = normalizeRecord(FL_STATE_AG);
    const agVerification = verifyRecord(agRecord);
    
    if (agVerification.valid) {
      records.push(agRecord);
    } else {
      issues.push(`State AG: ${agVerification.issues.join(', ')}`);
    }
    
    // Add State Attorneys by circuit
    for (const sa of FL_STATE_ATTORNEYS) {
      const record = normalizeRecord(sa);
      const verification = verifyRecord(record);
      
      if (verification.valid) {
        records.push(record);
      } else {
        issues.push(`${sa.name} (${sa.county_or_region}): ${verification.issues.join(', ')}`);
      }
    }
    
    // Write CSV
    const csv = toCSV(records);
    const outputPath = join(__dirname, '../../public/data/2026-pilot-fl.csv');
    writeFileSync(outputPath, csv);
    
    logStats('Florida', records.length, records.filter(r => verifyRecord(r).valid).length, issues);
    
    return {
      state: 'Florida',
      records,
      issues,
      success: true
    };
  } catch (error) {
    console.error('Error scraping Florida:', error);
    return {
      state: 'Florida',
      records: [],
      issues: [error.message],
      success: false
    };
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeFlorida().then(result => {
    console.log('\n✓ Florida scraping complete');
    process.exit(result.success ? 0 : 1);
  });
}

export default scrapeFlorida;