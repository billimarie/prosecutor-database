# Seat Import Guide

This guide explains how to import seat metadata into your US Prosecutor Database using the relational model.

## What is a "Seat"?

A **seat** represents the prosecutorial position itself, independent of who holds it. Think of it as the "office" rather than the "person."

### Example:
- **Seat**: Ocmulgee Judicial Circuit District Attorney (fixed position)
- **Prosecutors**: Harold McLendon (2024-present), Previous DA (2020-2024), etc. (people who held the seat)

## Why Separate Seats from Prosecutors?

1. **Avoids Duplication**: Jurisdiction boundaries, office type, and contact info stored once
2. **Enables Trend Analysis**: Track changes across multiple prosecutors for the same seat
3. **Data Integrity**: Update boundary changes once, applies to all prosecutors
4. **Historical Tracking**: Easy to add previous prosecutors without duplicating seat data

## Import Process

### Step 1: Prepare Your CSV

Use the `seat-import-template.csv` file with these required columns:

```csv
seat_id,state,county_or_region,jurisdiction,office_type
ga-laurens-johnson-twiggs-treutlen,GA,Laurens / Johnson / Twiggs / Treutlen,Ocmulgee Judicial Circuit,District Attorney
```

### Step 2: Generate Seat IDs

If you leave `seat_id` empty, it will be auto-generated:

```javascript
// Algorithm:
state.toLowerCase() + '-' + county_or_region.toLowerCase()
  .replace(/\s*\/\s*/g, '-')  // slashes → hyphens
  .replace(/\s+/g, '-')       // spaces → hyphens
  .replace(/[^a-z0-9-]/g, '') // remove special chars

// Examples:
"GA" + "Laurens / Johnson / Twiggs / Treutlen" 
  → "ga-laurens-johnson-twiggs-treutlen"

"PA" + "Lebanon County" 
  → "pa-lebanon-county"
```

### Step 3: Import via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database
3. Click **"Start collection"**
4. Name it: `seats`
5. Click **"Import data"**
6. Upload your CSV file
7. Map column types:
   - `seat_id`: String
   - `state`: String
   - `county_or_region`: String
   - `jurisdiction`: String
   - `election_cycle`: Number
   - `term_length`: Number
   - etc.

### Step 4: Import via Script (Alternative)

```bash
npm run seed:firestore:csv -- --collection=seats --file=path/to/seats.csv
```

## After Importing Seats

Once seats are imported, you can import prosecutors using `prosecutor-bulk-import-template.csv`. Each prosecutor record must include:

```csv
name,seat_id,is_current,term_start,term_end
"Harold McLendon",ga-laurens-johnson-twiggs-treutlen,true,2024-01-15,
"Previous DA",ga-laurens-johnson-twiggs-treutlen,false,2020-01-15,2024-01-14
```

## Validation Queries

After importing, verify your data:

### Check for duplicate seat_ids:
```javascript
// In Firebase Console → Firestore → Run query
Collection: seats
Where: seat_id (any value)
// Manually verify no duplicates
```

### Count seats per state:
```javascript
// Use this in your app:
import { fetchSeatsByState } from "./services/seats";
const gaSeats = await fetchSeatsByState("GA");
console.log(`Georgia has ${gaSeats.length} seats`);
```

## Common Issues

### Issue: Multiple current prosecutors for one seat
**Solution**: Only ONE prosecutor per seat should have `is_current: true`

```javascript
import { validateCurrentProsecutorUniqueness } from "./services/seats";
const validation = await validateCurrentProsecutorUniqueness("ga-laurens-johnson-twiggs-treutlen");
if (!validation.valid) {
  console.error(`Found ${validation.currentCount} current prosecutors!`);
}
```

### Issue: Missing seat_id in prosecutor records
**Solution**: Run migration script to backfill:

```bash
npm run migrate:relational-seats
```

### Issue: Boundary changes over time
**Solution**: Document in `boundary_notes` field:

```csv
boundary_notes
"Circuit expanded to include Treutlen County in 1995"
```

## Next Steps

After successful import:

1. ✅ Import prosecutors linked to seats
2. ✅ Add historical prosecutors for each seat
3. ✅ Create Firestore indexes for efficient queries
4. ✅ Update frontend to display seat-based views
5. ✅ Implement trend analysis across prosecutors

## Example: Complete Workflow

```javascript
import { 
  fetchSeatWithProsecutors, 
  analyzeSeatTrends 
} from "./services/seats";

// Get complete seat data
const seatData = await fetchSeatWithProsecutors("ga-laurens-johnson-twiggs-treutlen");

console.log(seatData.seat.jurisdiction);        // "Ocmulgee Judicial Circuit"
console.log(seatData.current.name);             // "Harold McLendon"
console.log(seatData.previous.length);          // Number of previous DAs

// Analyze trends
const trends = await analyzeSeatTrends("ga-laurens-johnson-twiggs-treutlen");
console.log(trends.totalProsecutors);           // Total tracked
console.log(trends.averageTermLength);          // Average years served
console.log(trends.partyChanges);               // Political transitions
```

---

**See Also**:
- `RELATIONAL_SEAT_SCHEMA.md` - Full schema documentation
- `prosecutor-bulk-import-template.csv` - Prosecutor import template
- `../src/services/seats.js` - Service functions

**Last Updated**: March 24, 2026
