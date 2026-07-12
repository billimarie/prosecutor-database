# Seat-Based Migration Guide

## Overview
This guide walks you through migrating your existing prosecutor database to a seat-based tracking system.

## ⚠️ IMPORTANT: Database Must Have Data First

**The migration scripts will skip all records if your Firestore database is empty.** 

Follow the complete workflow in **`SEAT_MIGRATION_WORKFLOW.md`** which covers:
1. Seeding initial data from `prosecutors.seed.json`
2. Running the relational seat migration
3. Adding historical prosecutors

## Quick Start

```bash
# 1. Configure Firebase credentials
cp .env.example .env
# Edit .env with your Firebase project credentials

# 2. Seed the database with initial prosecutor data
npm run seed:firestore

# 3. Create relational seat structure (auto-creates seats collection)
npm run migrate:relational-seats
```

## Current State
Your database already has the infrastructure for seat-based tracking implemented:
- Service functions in `src/services/prosecutors.js`
- Frontend display in `ProsecutorView.vue`
- Documentation in `docs/PROSECUTOR_SEAT_TRACKING.md`
- Migration scripts in `scripts/`

## Migration Steps

### Step 1: Backfill Existing Records with seat_id

Run this migration script to add `seat_id` and `is_current` fields to existing records:

```javascript
// scripts/migrateToSeatTracking.mjs
import 'dotenv/config';
import fs from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc, getDoc } from "firebase/firestore";

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
  // Load existing data from seed file or Firestore
  const seedData = JSON.parse(fs.readFileSync('./public/data/prosecutors.seed.json', 'utf8'));
  
  let migrated = 0;
  for (const prosecutor of seedData) {
    const seatId = generateSeatId(prosecutor.state, prosecutor.county_or_region);
    if (!seatId) {
      console.log(`Skipping ${prosecutor.id}: missing state or county`);
      continue;
    }
    
    await updateDoc(doc(db, "prosecutors", prosecutor.id), {
      seat_id: seatId,
      is_current: true,
      updated_at: new Date().toISOString()
    });
    
    console.log(`✓ Migrated ${prosecutor.name} → seat: ${seatId}`);
    migrated++;
  }
  
  console.log(`\nMigration complete: ${migrated} records updated`);
}

migrateProsecutors().catch(console.error);
```

Run with:
```bash
node ./scripts/migrateToSeatTracking.mjs
```

### Step 2: Create Firestore Index

To query by `seat_id`, create a composite index:

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Add Index"
3. Configure:
   - Collection: `prosecutors`
   - Fields: 
     - `seat_id` (Ascending)
     - `is_current` (Ascending)

Or use the link provided when you first query with `where("seat_id", "==", ...)`

### Step 3: Add Historical Prosecutors

For each seat, research and add previous prosecutors:

```javascript
// Example: Adding previous prosecutor for GA Ocmulgee Circuit
await setDoc(doc(db, "prosecutors", "ga-laurens-johnson-twiggs-treutlen-prev-1"), {
  name: "Previous Prosecutor Name",
  office: "District Attorney",
  jurisdiction: "Ocmulgee Judicial Circuit",
  state: "GA",
  county_or_region: "Laurens / Johnson / Twiggs / Treutlen",
  seat_id: "ga-laurens-johnson-twiggs-treutlen",
  is_current: false,
  start_date: "2020-01-15T00:00:00.000Z",
  end_date: "2024-01-14T00:00:00.000Z",
  notes: "Served two terms before losing re-election.",
  source_urls: ["https://example.org/source"],
  last_verified_at: new Date().toISOString()
});
```

### Step 4: Update CSV Import Template

Update your CSV import template to include seat tracking fields:

```csv
id,name,office,jurisdiction,state,county_or_region,seat_id,is_current,start_date,end_date,small_town_focus,campaign_theme,incarceration_signal,source_urls,notes,last_verified_at
```

### Step 5: Update seedFirestoreFromCsv.mjs

Modify the import script to automatically generate `seat_id`:

```javascript
// Add after line 177 (after county_or_region assignment)
const seatId = generateSeatId(state, county_or_region);

// Add to docPayload (around line 191)
const docPayload = {
  id,
  name: String(name).trim(),
  // ... existing fields ...
  seat_id: seatId,
  is_current: toBool(rowObj.is_current) ?? true,
  start_date: rowObj.start_date ? new Date(rowObj.start_date).toISOString() : undefined,
  end_date: rowObj.end_date ? new Date(rowObj.end_date).toISOString() : null,
  // ... rest of fields ...
};

// Add generateSeatId function to the script
function generateSeatId(state, countyOrRegion) {
  if (!state || !countyOrRegion) return null;
  const normalizedCounty = countyOrRegion
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${state.toLowerCase()}-${normalizedCounty}`;
}
```

### Step 6: Data Entry Workflow

When adding new prosecutors:

1. **Check for existing seat**: Query by `seat_id` to see if seat exists
2. **Mark previous as inactive**: Update current prosecutor's record:
   ```javascript
   await updateDoc(doc(db, "prosecutors", existingId), {
     is_current: false,
     end_date: new Date().toISOString()
   });
   ```
3. **Add new prosecutor**: Create record with `is_current: true`

### Step 7: Verify Frontend Display

Navigate to any prosecutor page to verify:
- Current prosecutor displays correctly
- Previous prosecutors appear in reverse chronological order
- Seat-based trends can be analyzed across time

## Tracking Prosecutorial Trends

With seat-based tracking, you can now:

1. **Compare outcomes across different prosecutors** in the same seat
2. **Identify long-term patterns** in charging/incarceration rates
3. **Analyze impact of prosecutor changes** on local justice outcomes
4. **Track campaign promise vs. actual performance** by seat

Example analysis queries:
```javascript
// Get all prosecutors for a seat
const seatData = await fetchProsecutorsBySeatId('ga-laurens-johnson-twiggs-treutlen');

// Compare incarceration signals across time
const trends = seatData.previous.map(p => ({
  name: p.name,
  period: `${p.start_date} - ${p.end_date}`,
  signal: p.incarceration_signal
}));
```

## Best Practices

1. **Always verify current status** before marking new prosecutor as current
2. **Document transitions** with notes explaining how/why prosecutor left office
3. **Use reliable sources**: Election results, official appointments, news coverage
4. **Maintain one current per seat**: Only ONE prosecutor per seat should have `is_current: true`

## Future Enhancements

Consider adding:
- Party affiliation tracking
- Election cycle data
- Appointment method (elected vs. appointed)
- Succession chain relationships
- Aggregate statistics by seat

## Support

- Review `docs/PROSECUTOR_SEAT_TRACKING.md` for detailed schema documentation
- Check `src/services/prosecutors.js` for service layer implementation
- See `ProsecutorView.vue` for frontend examples
