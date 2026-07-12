# Seat-Based Prosecutor Database: Complete Setup Guide

## 🎯 The Problem You Solved

You realized the database should track **prosecutorial seats** (positions) rather than just individual prosecutors. This enables:
- Tracking multiple prosecutors who held the same office over time
- Analyzing prosecutorial trends by seat/jurisdiction
- Comparing outcomes across different officeholders in the same position

## 🔧 What Was Implemented

### 1. Relational Data Structure
Your database now uses **two collections**:

#### `seats` Collection (Static Position Metadata)
```javascript
{
  id: "ga-laurens-johnson-twiggs-treutlen",
  state: "GA",
  state_name: "Georgia",
  county_or_region: "Laurens / Johnson / Twiggs / Treutlen",
  jurisdiction: "Ocmulgee Judicial Circuit",
  office_type: "District Attorney",
  circuit_type: "multi-county",
  counties_served: ["Laurens", "Johnson", "Twiggs", "Treutlen"],
  election_cycle: 4,
  term_length: 4,
  appointment_method: "elected"
}
```

#### `prosecutors` Collection (Individual Officeholders)
```javascript
{
  id: "ga-ocmulgee-harold-mclendon-2024",
  name: "Harold McLendon",
  seat_id: "ga-laurens-johnson-twiggs-treutlen",  // Links to seat
  is_current: true,
  start_date: "2024-01-15T00:00:00.000Z",
  end_date: null,
  // ... other biographical data
}
```

### 2. Automated Migration Scripts

**No manual seat creation needed!** The migration automatically:
- Scans existing prosecutor records
- Extracts unique state+county combinations
- Creates seat documents with metadata
- Links prosecutors to their seats

## 🚀 Quick Start (Empty Database)

### Step 1: Configure Firebase
```bash
cp .env.example .env
# Edit .env with your Firebase project credentials
```

### Step 2: Seed Initial Data
```bash
npm run seed:firestore
```
This loads data from `public/data/prosecutors.seed.json` into Firestore.

**Expected output:**
```
Found 3 prosecutor records to seed

✓ Seeded Harold McLendon (ga-ocmulgee-harold-mclendon-2024)
✓ Seeded Michael Light II (pa-lebanon-michael-light-2025)
✓ Seeded Matthew Barton (ms-desoto-matthew-barton-2022)

✅ Seed complete. Upserted 3 prosecutor records.
```

### Step 3: Create Relational Structure
```bash
npm run migrate:relational-seats
```
This auto-creates the `seats` collection and links everything.

**Expected output:**
```
Starting migration to relational seat schema...
Found 3 prosecutor records
Identified 3 unique seats
Created seat: ga-laurens-johnson-twiggs-treutlen
Created seat: pa-lebanon-county
Created seat: ms-desoto-county

✅ Migration complete!
   Created: 3 seats
```

## ➕ Adding Historical Prosecutors

Once the structure exists, add previous officeholders:

### Option A: CSV Import
Use the template at `public/data/import-templates/prosecutor-bulk-import-template.csv`:

```csv
id,name,state,county_or_region,seat_id,is_current,term_start,term_end,office
ga-ocmulgee-prev-da,Jane Smith,GA,"Laurens / Johnson / Twiggs / Treutlen",ga-laurens-johnson-twiggs-treutlen,false,2016-01-01,2024-01-01,District Attorney
```

Then run:
```bash
npm run seed:firestore:csv -- --csv ./path/to/your/file.csv
```

### Option B: Direct Firestore Entry
```javascript
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";

await setDoc(doc(db, "prosecutors", "ga-ocmulgee-prev-da"), {
  name: "Jane Smith",
  office: "District Attorney",
  jurisdiction: "Ocmulgee Judicial Circuit",
  state: "GA",
  county_or_region: "Laurens / Johnson / Twiggs / Treutlen",
  seat_id: "ga-laurens-johnson-twiggs-treutlen",  // Same as current
  is_current: false,  // Not current
  term_start: "2016-01-01T00:00:00.000Z",
  term_end: "2024-01-01T00:00:00.000Z",
  campaign_theme: "Law and order",
  incarceration_signal: "Increased felony filings by 40%",
  source_urls: ["https://example.org/source"],
  last_verified_at: new Date().toISOString()
});
```

## 📊 Querying for Trends

### Get All Prosecutors for a Seat
```javascript
import { fetchProsecutorsBySeatId } from "./src/services/prosecutors.js";

const result = await fetchProsecutorsBySeatId('ga-laurens-johnson-twiggs-treutlen');

// Returns:
{
  seat: { /* seat metadata */ },
  current: { /* current prosecutor record */ },
  previous: [ /* array of historical prosecutors */ ]
}
```

### Analyze Trends Across Time
```javascript
const { seat, current, previous } = result;

// Compare campaign themes over time
const allProsecutors = [current, ...previous];
const themes = allProsecutors.map(p => ({
  name: p.name,
  period: `${p.term_start?.substring(0,4)} - ${p.term_end ? p.term_end.substring(0,4) : 'present'}`,
  theme: p.campaign_theme,
  incarcerationSignal: p.incarceration_signal
}));

console.log(`Prosecutorial trends for ${seat.county_or_region}:`);
themes.forEach(t => console.log(`${t.name} (${t.period}): ${t.theme}`));
```

## 🗂️ File Reference

| File | Purpose |
|------|---------|
| `SEAT_MIGRATION_WORKFLOW.md` | Step-by-step migration guide |
| `MIGRATION_TO_SEAT_TRACKING.md` | Detailed migration documentation |
| `scripts/seedFirestore.mjs` | Seeds initial data from JSON |
| `scripts/migrateToRelationalSeats.mjs` | Auto-creates seats collection |
| `src/services/prosecutors.js` | Service functions for seat queries |
| `public/data/import-templates/` | CSV templates for bulk import |

## ✅ Key Commands

```bash
# Seed database from JSON
npm run seed:firestore

# Create relational seat structure
npm run migrate:relational-seats

# Import from CSV
npm run seed:firestore:csv -- --csv ./path/to/file.csv

# Legacy seat tracking migration (if needed)
npm run migrate:seat-tracking
```

## 🎓 Best Practices

1. **One current per seat**: Only ONE prosecutor per seat should have `is_current: true`
2. **Use consistent seat_id**: Always use the same `seat_id` for all prosecutors in the same position
3. **Document transitions**: Add notes explaining how/why prosecutors left office
4. **Verify sources**: Include source URLs for all major claims
5. **Track temporal data**: Always include `term_start` and `term_end` dates

## 🔍 Next Steps

1. **Run the migration** following the Quick Start above
2. **Create Firestore index** (Firebase Console → Firestore → Indexes):
   - Collection: `prosecutors`
   - Fields: `seat_id` (Ascending), `is_current` (Ascending)
3. **Add historical data** using CSV templates
4. **Update frontend** to display seat history (see `ProsecutorView.vue`)
5. **Build trend analysis** features using the relational queries

---

**You no longer need to manually create seat entries!** The `migrate:relational-seats` script does all the heavy lifting by analyzing your existing prosecutor data and automatically creating the proper relational structure.
