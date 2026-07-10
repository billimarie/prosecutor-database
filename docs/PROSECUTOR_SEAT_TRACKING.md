# Prosecutor Seat Tracking - Database Schema Update

## Overview

This document describes the updated database structure for tracking current and previous prosecutors for each seat (county/region) in the U.S. Prosecutor Database.

## Problem Statement

Previously, the database only tracked current prosecutors with a simple `previous` field that was insufficient for maintaining a relational history of all prosecutors who occupied a specific seat. This made it impossible to view the complete history of a prosecutor's office in a single view.

## Solution: Seat-Based Tracking

The solution introduces a **seat-based tracking system** where each prosecutor record is linked to a specific "seat" (defined by state + county/region), allowing us to track both current and historical occupants of that seat.

## Database Schema Changes

### New Fields for Prosecutor Records

Each prosecutor document in the `prosecutors` collection should now include these additional fields:

```json
{
  "id": "ga-ocmulgee-harold-mclendon-2024",
  "name": "Harold McLendon",
  "office": "District Attorney",
  "jurisdiction": "Ocmulgee Judicial Circuit",
  "state": "GA",
  "county_or_region": "Laurens / Johnson / Twiggs / Treutlen",
  
  // NEW FIELDS FOR SEAT TRACKING
  "seat_id": "ga-laurens-johnson-twiggs-treutlen",
  "is_current": true,
  "start_date": "2024-01-15T00:00:00.000Z",
  "end_date": null,
  
  // EXISTING FIELDS
  "small_town_focus": true,
  "campaign_theme": "Tough-on-crime rhetoric",
  "incarceration_signal": "Requires local jail trend verification from public data.",
  "source_urls": [
    "https://www.13wmaz.com/article/news/local/harold-mclendon-campaigned-tough-crime-district-attorney/93-65423929-a1cb-4a43-b067-1a676a8961ab"
  ],
  "notes": "Starter lead only; not an adjudication of misconduct.",
  "last_verified_at": "2026-03-24T00:00:00.000Z"
}
```

### Field Descriptions

#### `seat_id` (String, Required)
A unique identifier for each prosecutor seat, generated from the state and county/region. Format: `{state}-{normalized-county-region}`

**Generation Algorithm:**
1. Convert state to lowercase
2. Convert county_or_region to lowercase
3. Replace slashes (`/`) with hyphens
4. Replace spaces with hyphens
5. Remove all non-alphanumeric characters (except hyphens)

**Examples:**
- State: `GA`, County: `Laurens / Johnson / Twiggs / Treutlen` → `ga-laurens-johnson-twiggs-treutlen`
- State: `PA`, County: `Lebanon County` → `pa-lebanon-county`
- State: `MS`, County: `DeSoto County` → `ms-desoto-county`

#### `is_current` (Boolean, Required)
Indicates whether this prosecutor currently holds the seat.
- `true`: Current officeholder
- `false` or `null`: Former officeholder

**Important:** Only ONE prosecutor per seat should have `is_current: true` at any time.

#### `start_date` (ISO 8601 Date String, Recommended)
When the prosecutor began their term in this seat. Use the election date, appointment date, or swearing-in date.

Format: `"YYYY-MM-DDTHH:mm:ss.sssZ"`

#### `end_date` (ISO 8601 Date String, Optional)
When the prosecutor left office. Should be `null` for current prosecutors.

Format: `"YYYY-MM-DDTHH:mm:ss.sssZ"`

## Firestore Index Requirements

To support efficient queries by `seat_id`, you need to create a composite index in Firestore:

**Index Configuration:**
- Collection: `prosecutors`
- Fields: 
  - `seat_id` (Ascending)
  - `is_current` (Ascending)

**How to Create:**
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Add Index"
3. Configure as above
4. Wait for index to build (may take several minutes)

Alternatively, when you first query with `where("seat_id", "==", ...)` in your app, Firestore will provide a direct link to create the required index.

## Migration Strategy

### Phase 1: Backfill Existing Records

For existing prosecutor records, run a migration script to:

1. Generate `seat_id` from existing `state` and `county_or_region` fields
2. Set `is_current: true` for all existing records (they are assumed current until proven otherwise)
3. Leave `start_date` and `end_date` as `null` initially

Example migration script (Node.js):

```javascript
import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { generateSeatId } from "./src/services/prosecutors.js";

const db = getFirestore(app);

const prosecutorsToUpdate = [
  "ga-ocmulgee-harold-mclendon-2024",
  "pa-lebanon-michael-light-2025",
  "ms-desoto-matthew-barton-2022"
];

for (const id of prosecutorsToUpdate) {
  const snap = await getDoc(doc(db, "prosecutors", id));
  if (snap.exists()) {
    const data = snap.data();
    const seatId = generateSeatId(data.state, data.county_or_region);
    
    await updateDoc(doc(db, "prosecutors", id), {
      seat_id: seatId,
      is_current: true,
      updated_at: new Date().toISOString()
    });
    
    console.log(`Updated ${id} with seat_id: ${seatId}`);
  }
}
```

### Phase 2: Add Historical Prosecutors

For each seat, research and add previous prosecutors as separate documents:

```javascript
// Example: Adding a previous prosecutor
await setDoc(doc(db, "prosecutors", "ga-laurens-johnson-twiggs-treutlen-previous-1"), {
  name: "Previous Prosecutor Name",
  office: "District Attorney",
  jurisdiction: "Ocmulgee Judicial Circuit",
  state: "GA",
  county_or_region": "Laurens / Johnson / Twiggs / Treutlen",
  seat_id: "ga-laurens-johnson-twiggs-treutlen",
  is_current: false,
  start_date: "2020-01-15T00:00:00.000Z",
  end_date: "2024-01-14T00:00:00.000Z",
  notes: "Served two terms before losing re-election.",
  source_urls: ["https://example.org/source"],
  last_verified_at: new Date().toISOString()
});
```

### Phase 3: Data Entry Workflow

When adding new prosecutor records:

1. **Determine the seat**: Check if a prosecutor already exists for this county/region
2. **Generate seat_id**: Use the `generateSeatId()` function
3. **Mark previous officeholder**: If replacing a current prosecutor, update their record:
   ```javascript
   await updateDoc(doc(db, "prosecutors", existingId), {
     is_current: false,
     end_date: new Date().toISOString()
   });
   ```
4. **Add new prosecutor**: Create new record with `is_current: true` and appropriate `start_date`

## Frontend Implementation

### Service Functions

The `src/services/prosecutors.js` file includes new functions:

#### `generateSeatId(state, countyOrRegion)`
Generates a normalized seat identifier from state and county/region.

#### `fetchProsecutorsBySeatId(seatId)`
Fetches all prosecutors (current and previous) for a given seat.

Returns:
```javascript
{
  current: { /* current prosecutor object */ },
  previous: [ /* array of previous prosecutor objects */ ]
}
```

#### `fetchCurrentAndPreviousForProsecutor(prosecutorId)`
Convenience function that fetches the seat data for a specific prosecutor ID.

### Vue Component Usage

Example from `ProsecutorView.vue`:

```vue
<script setup>
import { onMounted, ref } from "vue";
import { fetchCurrentAndPreviousForProsecutor } from "../services/prosecutors";

const props = defineProps({ id: String });
const seatData = ref(null);

onMounted(async () => {
  seatData.value = await fetchCurrentAndPreviousForProsecutor(props.id);
});
</script>

<template>
  <section v-if="seatData && seatData.previous.length > 0">
    <h2>Previous Prosecutors</h2>
    <div v-for="prev in seatData.previous" :key="prev.id">
      <h3>{{ prev.name }}</h3>
      <p>{{ prev.office }} · {{ prev.jurisdiction }}</p>
      <span v-if="prev.end_date">{{ formatDate(prev.end_date) }}</span>
    </div>
  </section>
</template>
```

## Best Practices

### Data Quality

1. **Always verify current status**: Before marking a new prosecutor as current, verify the previous officeholder's status
2. **Use reliable sources**: Election results, official appointments, news coverage
3. **Document transitions**: Add notes explaining how/why a prosecutor left office
4. **Maintain chronological order**: Previous prosecutors are sorted by `end_date` (most recent first)

### Edge Cases

1. **Interim/Appointed Prosecutors**: Mark with `is_current: false` if they served temporarily, or `true` if currently serving
2. **Multi-County Circuits**: Use the full circuit name in `county_or_region` (e.g., "Laurens / Johnson / Twiggs / Treutlen")
3. **Name Changes**: If a county changed names, use the current name in `county_or_region` but note the change in `notes`
4. **Unknown Start/End Dates**: Leave as `null` rather than guessing; add note about missing information

### Query Optimization

1. **Use seat_id for filtering**: Always query by `seat_id` rather than combining state + county
2. **Cache seat data**: The service layer caches results to minimize Firestore reads
3. **Limit previous prosecutors**: Consider pagination if a seat has many previous prosecutors (10+ years of history)

## Testing

### Manual Testing Checklist

- [ ] Verify seat_id generation matches expected format
- [ ] Confirm current prosecutor displays correctly
- [ ] Confirm previous prosecutors display in reverse chronological order
- [ ] Test with seats that have no previous prosecutors
- [ ] Test with seats that have multiple previous prosecutors
- [ ] Verify Firestore index is working (no permission errors)

### Automated Testing

Add unit tests for:

```javascript
import { generateSeatId } from "../services/prosecutors";

describe('generateSeatId', () => {
  test('handles multi-county circuits', () => {
    expect(generateSeatId('GA', 'Laurens / Johnson / Twiggs / Treutlen'))
      .toBe('ga-laurens-johnson-twiggs-treutlen');
  });
  
  test('handles single counties', () => {
    expect(generateSeatId('PA', 'Lebanon County'))
      .toBe('pa-lebanon-county');
  });
  
  test('returns null for missing data', () => {
    expect(generateSeatId(null, 'County')).toBeNull();
    expect(generateSeatId('GA', null)).toBeNull();
  });
});
```

## Future Enhancements

Potential improvements for future iterations:

1. **Separate Collection**: Move historical prosecutors to a `prosecutor_history` subcollection
2. **Election Cycles**: Track election years and term lengths
3. **Party Affiliation**: Add political party for electoral analysis
4. **Appointment Method**: Distinguish between elected, appointed, interim
5. **Succession Chain**: Explicitly link successor/predecessor relationships

## Support

For questions or issues with this schema update:

- Review the code in `src/services/prosecutors.js`
- Check the implementation in `src/views/ProsecutorView.vue`
- Refer to Firestore documentation for index management
- Consult DOCS.md for general project guidelines

---

**Last Updated**: March 24, 2026  
**Version**: 1.0
