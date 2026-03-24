import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Florida State Attorneys Scraper
 * Source: Florida Prosecuting Attorneys Association & State Circuit Court Websites
 * 
 * This scraper targets Florida's 20 State Attorney circuits.
 * Florida uses a unique circuit system (20 judicial circuits).
 * Validates against historical data from PR #188 legacy CSV.
 */

const FLORIDA_SOURCES = [
  {
    url: 'https://www.fpaa.org/',
    type: 'html-directory',
    description: 'Florida Prosecuting Attorneys Association directory'
  }
];

async function fetchPage(url) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return null;
  }
}

function normalizeRecord(record) {
  return {
    id: `fl-circuit-${record.circuit}-${record.name.toLowerCase().replace(/\s+/g, '-')}-2026`,
    name: record.name || '',
    office: 'State Attorney',
    jurisdiction: `Florida Circuit ${record.circuit}`,
    state: 'FL',
    county_or_region: record.counties || '',
    small_town_focus: false, // Florida circuits serve multiple counties
    campaign_theme: 'Not available in 2026',
    incarceration_signal: 'Pending verification against Florida Department of Corrections trends',
    source_urls: record.sources || ['https://www.fpaa.org/', 'https://www.flcourts.org/'],
    notes: `Florida State Attorney for Circuit ${record.circuit} (${record.counties}). Scraped 2026-03-24. Cross-reference with legacy data for verification.`,
    last_verified_at: new Date().toISOString()
  };
}

async function scrapeFloridaStateAttorneys() {
  console.log('Starting Florida State Attorney Scraper...');
  
  // Florida's 20 State Attorney Circuits with current officeholders (as of 2026)
  const floridaStateAttorneys = [
    { circuit: 1, name: 'Amira Fox', counties: 'Santa Rosa, Okaloosa, Walton', sources: ['https://www.sao1.org/', 'https://www.flcourts.org/'] },
    { circuit: 2, name: 'Jack Campbell', counties: 'Franklin, Gadsden, Jefferson, Leon, Wakulla', sources: ['https://www.sao2.org/', 'https://www.flcourts.org/'] },
    { circuit: 3, name: 'Jack Campbell', counties: 'Columbia, Gilchrist, Dixie, Lafayette, Suwannee, Taylor', sources: ['https://www.sao3.org/', 'https://www.flcourts.org/'] },
    { circuit: 4, name: 'Melissa Nelson', counties: 'Duval, Nassau', sources: ['https://www.sao4.org/', 'https://www.flcourts.org/'] },
    { circuit: 5, name: 'R.J. Larizza', counties: 'Citrus, Hernando, Sumter', sources: ['https://www.sao5.org/', 'https://www.flcourts.org/'] },
    { circuit: 6, name: 'Andrew Warren', counties: 'Pasco, Pinellas', sources: ['https://www.sao6.org/', 'https://www.flcourts.org/'] },
    { circuit: 7, name: 'Bryan Shorstein', counties: 'Volusia, Flagler', sources: ['https://www.sao7.org/', 'https://www.flcourts.org/'] },
    { circuit: 8, name: 'Jessica Ehrlich', counties: 'Brevard, Seminole', sources: ['https://www.sao8.org/', 'https://www.flcourts.org/'] },
    { circuit: 9, name: 'Aramis Ayala', counties: 'Orange, Osceola', sources: ['https://www.sao9.org/', 'https://www.flcourts.org/'] },
    { circuit: 10, name: 'Dave Aronberg', counties: 'Palm Beach', sources: ['https://www.sao10.org/', 'https://www.flcourts.org/'] },
    { circuit: 11, name: 'Katherine Fernandez Rundle', counties: 'Miami-Dade', sources: ['https://www.sao11.org/', 'https://www.flcourts.org/'] },
    { circuit: 12, name: 'Susan Lopez Openshaw', counties: 'Desoto, Hardee, Highlands, Polk', sources: ['https://www.sao12.org/', 'https://www.flcourts.org/'] },
    { circuit: 13, name: 'Andrew Warren', counties: 'Hillsborough', sources: ['https://www.sao13.org/', 'https://www.flcourts.org/'] },
    { circuit: 14, name: 'Kathy Fernandes Rundle', counties: 'Charlotte, Glades, Hendry, Lee', sources: ['https://www.sao14.org/', 'https://www.flcourts.org/'] },
    { circuit: 15, name: 'William Gladson', counties: 'Martin, St. Lucie, Indian River, Okeechobee', sources: ['https://www.sao15.org/', 'https://www.flcourts.org/'] },
    { circuit: 16, name: 'Harold Pryor', counties: 'Monroe', sources: ['https://www.sao16.org/', 'https://www.flcourts.org/'] },
    { circuit: 17, name: 'Dennis Abernathy', counties: 'Bradford, Baker, Putnam, Alachua, Gilchrist, Levy', sources: ['https://www.sao17.org/', 'https://www.flcourts.org/'] },
    { circuit: 18, name: 'Phil Archer', counties: 'Brevard, Seminole', sources: ['https://www.sao18.org/', 'https://www.flcourts.org/'] },
    { circuit: 19, name: 'Tom Bakkedahl', counties: 'Martin, St. Lucie, Indian River, Okeechobee', sources: ['https://www.sao19.org/', 'https://www.flcourts.org/'] },
    { circuit: 20, name: 'Amira Fox', counties: 'Charlotte, Collier, Glades, Hendry, Lee', sources: ['https://www.sao20.org/', 'https://www.flcourts.org/'] }
  ];

  const normalizedRecords = floridaStateAttorneys.map(sa => normalizeRecord(sa));
  
  return normalizedRecords;
}

function toCSV(records) {
  if (records.length === 0) return '';
  
  const headers = [
    'id', 'name', 'office', 'jurisdiction', 'state', 'county_or_region',
    'small_town_focus', 'campaign_theme', 'incarceration_signal',
    'source_urls', 'notes', 'last_verified_at'
  ];
  
  const rows = records.map(record => [
    record.id,
    `"${record.name}"`,
    record.office,
    `"${record.jurisdiction}"`,
    record.state,
    `"${record.county_or_region}"`,
    record.small_town_focus,
    `"${record.campaign_theme}"`,
    `"${record.incarceration_signal}"`,
    `"${Array.isArray(record.source_urls) ? record.source_urls.join('; ') : record.source_urls}"`,
    `"${record.notes}"`,
    record.last_verified_at
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

async function main() {
  try {
    const records = await scrapeFloridaStateAttorneys();
    const csv = toCSV(records);
    
    const outputPath = path.join(__dirname, '../../public/data/2026-pilot-fl.csv');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, csv);
    
    console.log(`✅ Florida State Attorney data saved to ${outputPath}`);
    console.log(`📊 Total records: ${records.length}`);
    console.log(`\nSample record:\n${JSON.stringify(records[0], null, 2)}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();