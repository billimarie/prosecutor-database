/**
 * Link Existing Prosecutors to Existing Seats
 * 
 * This script assumes:
 * 1. The 'seats' collection exists and is populated.
 * 2. The 'prosecutors' collection exists with raw data (state, county, etc.).
 * 
 * It will:
 * 1. Map seats by "state-county" key.
 * 2. Update prosecutors to include the matching 'seat_id'.
 * 3. Automatically determine 'is_current' based on term dates or lack of end_date.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase Config
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

async function linkProsecutorsToSeats() {
  console.log('🔍 Fetching existing seats...');
  const seatsSnapshot = await getDocs(collection(db, 'seats'));
  
  if (seatsSnapshot.empty) {
    console.error('❌ No seats found in "seats" collection. Please seed seats first.');
    return;
  }

  // Create a map: "state-county" -> seatId
  const seatMap = new Map();
  let seatCount = 0;
  
  seatsSnapshot.forEach((doc) => {
    const data = doc.data();
    // Adjust these field names if your seats collection uses different keys
    const state = data.state?.toLowerCase();
    const county = data.county?.toLowerCase(); // Or counties[0] if array
    
    if (state && county) {
      // Handle multi-county seats if necessary, but starting with primary
      const key = `${state}-${county}`;
      seatMap.set(key, doc.id);
      seatCount++;
    }
  });

  console.log(`✅ Found ${seatCount} unique seats to match against.`);

  console.log('🔍 Fetching existing prosecutors...');
  const prosecutorsSnapshot = await getDocs(collection(db, 'prosecutors'));
  
  if (prosecutorsSnapshot.empty) {
    console.log('⚠️ No prosecutors found.');
    return;
  }

  const batch = writeBatch(db);
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log(`🔄 Processing ${prosecutorsSnapshot.size} prosecutors...`);

  for (const procDoc of prosecutorsSnapshot.docs) {
    const data = data = procDoc.data();
    const state = data.state?.toLowerCase();
    const county = data.county?.toLowerCase();

    if (!state || !county) {
      skippedCount++;
      continue;
    }

    const key = `${state}-${county}`;
    const seatId = seatMap.get(key);

    if (seatId) {
      // Determine if current (no end_date or end_date is in future)
      const endDate = data.term_end ? new Date(data.term_end) : null;
      const isCurrent = !endDate || endDate > new Date();

      // Update the document
      const procRef = doc(db, 'prosecutors', procDoc.id);
      batch.update(procRef, {
        seat_id: seatId,
        is_current: isCurrent,
        // Optional: Clean up redundant data if strictly relational
        // state: undefined, 
        // county: undefined 
      });
      
      updatedCount++;
    } else {
      console.warn(`⚠️ No seat found for ${data.name} (${data.county}, ${data.state})`);
      skippedCount++;
    }
  }

  if (updatedCount > 0) {
    console.log('💾 Committing changes to Firestore...');
    await batch.commit();
    console.log(`✅ Successfully linked ${updatedCount} prosecutors to seats.`);
  } else {
    console.log('ℹ️ No updates needed.');
  }

  console.log(`📊 Summary: ${updatedCount} updated, ${skippedCount} skipped, ${errorCount} errors.`);
}

linkProsecutorsToSeats().catch(console.error);
