# Relational Seat-Based Schema - Implementation Summary

## Overview

Your US Prosecutor Database has been reconfigured to use a **relational model** that separates:
- **`seats` collection**: Fixed information about prosecutorial positions (the "office")
- **`prosecutors` collection**: Variable information about individuals who hold/held the seat (the "person")

This enables tracking prosecutorial trends across time as different people occupy the same seat.

## What Changed

### 1. New Collection: `seats`

Stores position-level metadata that doesn't change when prosecutors change:

```json
{
  "id": "ga-laurens-johnson-twiggs-treutlen",
  "state": "GA",
  "county_or_region": "Laurens / Johnson / Twiggs / Treutlen",
  "jurisdiction": "Ocmulgee Judicial Circuit",
  "office_type": "District Attorney",
  "circuit_type": "multi-county",
  "counties_served": ["Laurens", "Johnson", "Twiggs", "Treutlen"],
  "election_cycle": 4,
  "term_length": 4,
  "appointment_method": "elected"
}
```

### 2. Updated Collection: `prosecutors`

Now includes `seat_id` foreign key and person-specific data:

```json
{
  "id": "harold-mclendon-2024",
  "seat_id": "ga-laurens-johnson-twiggs-treutlen",
  "name": "Harold McLendon",
  "is_current": true,
  "term_start": "2024-01-15T00:00:00.000Z",
  "term_end": null,
  "bio": "Former law enforcement officer...",
  "education": [...],
  "career_highlights": [...],
  "political_party": "Republican",
  "campaign_theme": "Tough-on-crime rhetoric"
}
```

## Files Created/Modified

### Documentation
- ✅ `docs/RELATIONAL_SEAT_SCHEMA.md` - Complete schema documentation
- ✅ `docs/IMPLEMENTATION_SUMMARY.md` - This file
- ✅ `public/data/import-templates/SEAT_IMPORT_GUIDE.md` - Seat import instructions

### Templates
- ✅ `public/data/import-templates/seat-import-template.csv` - CSV template for seats
- ✅ `public/data/import-templates/prosecutor-bulk-import-template.csv` - Updated with seat_id

### Services
- ✅ `src/services/seats.js` - New service for seat operations
  - `fetchSeatById()`
  - `fetchSeatsByState()`
  - `fetchProsecutorsBySeatId()`
  - `fetchSeatWithProsecutors()`
  - `upsertSeat()`
  - `addProsecutorToSeat()`
  - `transitionProsecutor()` - Atomic transaction for prosecutor changes
  - `validateCurrentProsecutorUniqueness()`
  - `getSeatHistoryChronological()`
  - `analyzeSeatTrends()` - Trend analysis across prosecutors

### Scripts
- ✅ `scripts/migrateToRelationalSeats.mjs` - Migration script
- ✅ `package.json` - Added `migrate:relational-seats` command

## Relationship Model

```
┌─────────────────┐         ┌──────────────────┐
│     seats       │         │   prosecutors    │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄────────│ seat_id (FK)     │
│ state           │    1:N  │ name             │
│ county_or_region│         │ is_current       │
│ jurisdiction    │         │ term_start       │
│ office_type     │         │ term_end         │
│ ...             │         │ bio              │
└─────────────────┘         │ education        │
                            │ career_highlights│
                            │ political_party  │
                            │ campaign_theme   │
                            │ ...              │
                            └──────────────────┘
```

## Migration Steps

### Step 1: Create Seats Collection

Run the migration script to extract seat data from existing prosecutors:

```bash
npm run migrate:relational-seats
```

This will:
- Identify unique seats from existing prosecutor records
- Create `seats` documents with normalized metadata
- Add `seat_id` to all prosecutor records
- Set `term_start` from existing `start_date` fields

### Step 2: Create Firestore Indexes

In Firebase Console → Firestore → Indexes, create:

**For `prosecutors` collection:**
1. Fields: `seat_id` (Ascending), `is_current` (Ascending)
2. Fields: `seat_id` (Ascending), `term_start` (Descending)

### Step 3: Import Historical Prosecutors

Use the updated CSV template to add previous prosecutors:

```csv
seat_id,name,is_current,term_start,term_end,bio,...
ga-laurens-johnson-twiggs-treutlen,"Previous DA",false,2020-01-15,2024-01-14,"Bio here",...
```

## Usage Examples

### Get Complete Seat History

```javascript
import { fetchSeatWithProsecutors } from "./services/seats";

const seatData = await fetchSeatWithProsecutors("ga-laurens-johnson-twiggs-treutlen");

console.log(seatData.seat.jurisdiction);      // "Ocmulgee Judicial Circuit"
console.log(seatData.current.name);           // "Harold McLendon"
console.log(seatData.previous.length);        // Number of previous DAs
console.log(seatData.previous[0].name);       // Most recent previous DA
```

### Analyze Trends Across Prosecutors

```javascript
import { analyzeSeatTrends } from "./services/seats";

const trends = await analyzeSeatTrends("ga-laurens-johnson-twiggs-treutlen");

console.log(trends.totalProsecutors);    // Total tracked
console.log(trends.averageTermLength);   // Average years served
console.log(trends.partyChanges);        // Political transitions
console.log(trends.campaignThemes);      // All campaign themes
```

### Transition Prosecutor (When Election/Appointment Occurs)

```javascript
import { transitionProsecutor } from "./services/seats";

await transitionProsecutor(
  "ga-laurens-johnson-twiggs-treutlen",
  "outgoing-prosecutor-id",
  {
    name: "New Prosecutor",
    bio: "...",
    political_party: "Party",
    campaign_theme: "Theme"
  }
);
// Automatically:
// - Marks outgoing as is_current: false with term_end date
// - Creates new record with is_current: true and term_start date
```

### Validate Data Integrity

```javascript
import { validateCurrentProsecutorUniqueness } from "./services/seats";

const validation = await validateCurrentProsecutorUniqueness("ga-laurens-johnson-twiggs-treutlen");

if (!validation.valid) {
  console.error(`Found ${validation.currentCount} current prosecutors!`);
  console.error("IDs:", validation.currentIds);
}
```

## Query Patterns

### List All Current Prosecutors in a State

```javascript
import { fetchSeatsByState, fetchProsecutorsBySeatId } from "./services/seats";

const seats = await fetchSeatsByState("GA");
const currentProsecutors = [];

for (const seat of seats) {
  const { current } = await fetchProsecutorsBySeatId(seat.id);
  if (current) currentProsecutors.push(current);
}
```

### Get Chronological History

```javascript
import { getSeatHistoryChronological } from "./services/seats";

const history = await getSeatHistoryChronological("ga-laurens-johnson-twiggs-treutlen");
// Returns prosecutors sorted by term_start ascending
```

## Benefits of This Model

1. **Single Source of Truth**: Seat metadata stored once, not duplicated across prosecutor records
2. **Easy Trend Analysis**: Query all prosecutors for a seat to track changes over time
3. **Data Integrity**: Update jurisdiction boundaries once, applies to all prosecutors
4. **Flexible History**: Add unlimited historical prosecutors without schema changes
5. **Clear Semantics**: Explicit separation of position vs. person
6. **Scalability**: Separate collections scale independently

## Next Steps

1. ✅ Run migration: `npm run migrate:relational-seats`
2. ✅ Create Firestore indexes (see Step 2 above)
3. ✅ Import historical prosecutors using the CSV template
4. ✅ Update frontend views to use new `seats.js` service functions
5. ✅ Implement seat-based trend visualizations
6. ✅ Add validation UI to prevent multiple current prosecutors

## Troubleshooting

### Multiple Current Prosecutors

If validation fails:
```javascript
// Find and fix manually in Firebase Console
// Only ONE prosecutor per seat should have is_current: true
```

### Missing seat_id

Run migration script or update manually:
```javascript
import { generateSeatId } from "./services/prosecutors";
const seatId = generateSeatId(state, county_or_region);
```

### Boundary Changes

Update the seat document:
```javascript
import { upsertSeat } from "./services/seats";

await upsertSeat("ga-laurens-johnson-twiggs-treutlen", {
  boundary_notes: "Circuit expanded in 2020",
  last_boundary_change: "2020-01-01"
});
```

## Additional Resources

- `docs/RELATIONAL_SEAT_SCHEMA.md` - Full schema documentation
- `docs/PROSECUTOR_SEAT_TRACKING.md` - Original seat tracking guide
- `public/data/import-templates/SEAT_IMPORT_GUIDE.md` - Import instructions
- `src/services/seats.js` - Service implementation

---

**Last Updated**: March 24, 2026  
**Version**: 2.0 (Relational Model)
