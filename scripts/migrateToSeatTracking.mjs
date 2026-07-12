import 'dotenv/config';
import fs from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

/**
 * Migration script to add seat tracking fields to existing prosecutor records
 * 
 * This script:
 * 1. Generates seat_id from state and county_or_region
 * 2. Sets is_current: true for all existing records
 * 3. Prepares the database for historical prosecutor tracking
 */

// Generate seat_id from state and county_or_region
function generateSeatId(state, countyOrRegion) {
  if (!state || !countyOrRegion) return null;
  const normalizedCounty = countyOrRegion
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${state.toLowerCase()}-${normalizedCounty}`;
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateProsecutors() {
  console.log('Starting seat tracking migration...\n');
  
  // Load existing data from seed file
  let seedData;
  try {
    seedData = JSON.parse(fs.readFileSync('./public/data/prosecutors.seed.json', 'utf8'));
  } catch (error) {
    console.error('Error reading seed file:', error.message);
    console.log('Trying fallback data...');
    try {
      const fallbackModule = await import('../src/data/fallbackProsecutors.js');
      seedData = fallbackModule.fallbackProsecutors;
    } catch (e) {
      console.error('Failed to load fallback data. Please ensure you have data available.');
      process.exit(1);
    }
  }
  
  if (!seedData || seedData.length === 0) {
    console.error('No prosecutor data found to migrate.');
    process.exit(1);
  }
  
  console.log(`Found ${seedData.length} prosecutor records to migrate\n`);
  
  let migrated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const prosecutor of seedData) {
    try {
      const seatId = generateSeatId(prosecutor.state, prosecutor.county_or_region);
      
      if (!seatId) {
        console.log(`⚠ Skipping ${prosecutor.name}: missing state or county`);
        skipped++;
        continue;
      }
      
      // Update the record with seat tracking fields
      await updateDoc(doc(db, "prosecutors", prosecutor.id), {
        seat_id: seatId,
        is_current: true,
        updated_at: new Date().toISOString()
      });
      
      console.log(`✓ Migrated ${prosecutor.name}`);
      console.log(`  → seat_id: ${seatId}`);
      console.log(`  → is_current: true\n`);
      
      migrated++;
    } catch (error) {
      console.error(`✗ Error migrating ${prosecutor.name}:`, error.message);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Migration Summary:');
  console.log(`  ✓ Migrated: ${migrated}`);
  console.log(`  ⚠ Skipped: ${skipped}`);
  console.log(`  ✗ Errors: ${errors}`);
  console.log('='.repeat(50));
  
  if (migrated > 0) {
    console.log('\nNext steps:');
    console.log('1. Create Firestore composite index for seat_id + is_current');
    console.log('2. Add historical prosecutors for each seat');
    console.log('3. Update future imports to include seat tracking fields');
    console.log('\nSee MIGRATION_TO_SEAT_TRACKING.md for detailed instructions.');
  }
}

migrateProsecutors().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
