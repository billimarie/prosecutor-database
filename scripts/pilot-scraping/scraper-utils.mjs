/**
 * Shared utility functions for prosecutor directory scrapers
 * Used by California, Texas, and Florida scraper implementations
 */

import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { createWriteStream } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Fetch HTML content from a URL with error handling
 */
export async function fetchHTML(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

/**
 * Parse HTML using cheerio and return jQuery-like object
 */
export function parseHTML(html) {
  return cheerio.load(html);
}

/**
 * Normalize prosecutor record to canonical schema
 */
export function normalizeRecord(rawRecord) {
  return {
    id: rawRecord.id || generateId(),
    name: sanitize(rawRecord.name || ''),
    office: sanitize(rawRecord.office || ''),
    jurisdiction: sanitize(rawRecord.jurisdiction || ''),
    state: rawRecord.state || '',
    county_or_region: sanitize(rawRecord.county_or_region || ''),
    small_town_focus: rawRecord.small_town_focus === true ? 'true' : 'false',
    campaign_theme: rawRecord.campaign_theme || '',
    incarceration_signal: rawRecord.incarceration_signal || '',
    source_urls: rawRecord.source_urls || '',
    notes: rawRecord.notes || '',
    last_verified_at: rawRecord.last_verified_at || new Date().toISOString()
  };
}

/**
 * Generate unique ID based on name and state
 */
export function generateId() {
  return `prosecutor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize string input (trim, remove extra spaces)
 */
export function sanitize(str) {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Convert records array to CSV string
 */
export function toCSV(records) {
  const headers = [
    'id',
    'name',
    'office',
    'jurisdiction',
    'state',
    'county_or_region',
    'small_town_focus',
    'campaign_theme',
    'incarceration_signal',
    'source_urls',
    'notes',
    'last_verified_at'
  ];
  
  return stringify(records, { header: true, columns: headers });
}

/**
 * Verify data quality of scraped record
 */
export function verifyRecord(record) {
  const issues = [];
  
  if (!record.name || record.name.length === 0) {
    issues.push('Missing name');
  }
  
  if (!record.state || record.state.length !== 2) {
    issues.push('Invalid state code');
  }
  
  if (!record.office) {
    issues.push('Missing office type');
  }
  
  if (!record.source_urls) {
    issues.push('Missing source URLs');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Log scraping statistics
 */
export function logStats(state, totalRecords, validRecords, issues) {
  console.log(`\n=== ${state} Scraping Results ===`);
  console.log(`Total records extracted: ${totalRecords}`);
  console.log(`Valid records: ${validRecords}`);
  console.log(`Invalid records: ${totalRecords - validRecords}`);
  if (issues.length > 0) {
    console.log(`Issues encountered:`);
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
}