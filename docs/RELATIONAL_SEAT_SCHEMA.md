# Relational Seat-Based Schema for Prosecutor Database

## Overview

This document describes the **relational database structure** that separates **seat metadata** (fixed information about the prosecutorial position) from **prosecutor data** (variable information about the humans who occupy the seat).

## Problem with Current Approach

Currently, all data is stored in a single `prosecutors` collection with flat documents. This creates issues:

1. **Data Duplication**: Seat-level information (jurisdiction boundaries, office type, county relationships) must be repeated for every prosecutor who held the seat
2. **Inconsistency Risk**: If jurisdiction boundaries change or are corrected, every historical record must be updated
3. **Query Inefficiency**: Cannot easily query "all prosecutors who held seat X" without filtering through duplicate data
4. **Trend Analysis Difficulty**: Hard to separate seat-level trends from individual prosecutor characteristics

## Solution: Two-Collection Relational Model

### Collection 1: `seats` (Fixed Position Data)

Stores information about the **prosecutorial position itself**, independent of who holds it:

```json
{
  "id": "ga-laurens-johnson-twiggs-treutlen",
  "state": "GA",
  "state_name": "Georgia",
  "county_or_region": "Laurens / Johnson / Twiggs / Treutlen",
  "jurisdiction": "Ocmulgee Judicial Circuit",
  "office_type": "District Attorney",
  "circuit_type": "multi-county",
  "counties_served": ["Laurens", "Johnson", "Twiggs", "Treutlen"],
  "fips_codes": ["13175", "13167", "13289", "13283"],
  "created_at": "1900-01-01T00:00:00.000Z", // When seat was established
  "last_boundary_change": "2020-01-01T00:00:00.000Z",
  "boundary_notes": "Circuit formed by merging four counties in 1900",
  "official_website": "https://ocmulgeeda.org",
  "office_address": "123 Main St, Dublin, GA 31021",
  "office_phone": "(555) 123-4567",
  "election_cycle": 4, // Years between elections
  "term_length": 4,
  "appointment_method": "elected", // elected, appointed, interim
  "source_urls": [
    "https://georgacourts.gov/circuits/ocmulgee"
  ],
  "last_verified_at": "2026-03-24T00:00:00.000Z"
}
```

### Collection 2: `prosecutors` (Human-Specific Data)

Stores information about **individuals who held/hold the seat**:

```json
{
  "id": "harold-mclendon-2024",
  "seat_id": "ga-laurens-johnson-twiggs-treutlen", // Foreign key to seats
  "name": "Harold McLendon",
  "is_current": true,
  "term_start": "2024-01-15T00:00:00.000Z",
  "term_end": null,
  "bio": "Former law enforcement officer with 20 years experience...",
  "education": [
    {
      "institution": "University of Georgia School of Law",
      "degree": "J.D.",
      "year": 2000
    },
    {
      "institution": "Georgia State University",
      "degree": "B.A. Criminal Justice",
      "year": 1995
    }
  ],
  "career_highlights": [
    "Chief Assistant DA, Ocmulgee Circuit (2010-2024)",
    "Sheriff's Deputy, Laurens County (2000-2010)"
  ],
  "political_party": "Republican",
  "campaign_theme": "Tough-on-crime rhetoric",
  "small_town_focus": true,
  "incarceration_signal": "Requires local jail trend verification from public data.",
  "relevant_cases": [
    {
      "title": "State v. Smith",
      "year": 2025,
      "description": "High-profile murder trial resulting in life sentence",
      "outcome": "Conviction",
      "source": "https://example.com/case"
    }
  ],
  "notes": "Starter lead only; not an adjudication of misconduct.",
  "source_urls": [
    "https://www.13wmaz.com/article/news/local/harold-mclendon-campaigned-tough-crime-district-attorney/93-65423929-a1cb-4a43-b067-1a776a8961ab"
  ],
  "last_verified_at": "2026-03-24T00:00:00.000Z"
}
```

## Key Relationships

### One-to-Many Relationship
- **One `seat`** → **Many `prosecutors`** (current + all previous)
- **Each `prosecutor`** → **One `seat`** (via `seat_id` foreign key)

### Temporal Constraints
- Only ONE prosecutor per seat can have `is_current: true` at any time
- `term_start` and `term_end` define the temporal occupancy
- No overlapping terms for the same seat (data validation required)

## Firestore Index Requirements

### For `seats` Collection
No special indexes needed beyond default (queries by state, county)

### For `prosecutors` Collection
Create these composite indexes:

1. **Seat Lookup Index**
   - Fields: `seat_id` (Ascending), `is_current` (Ascending)
   - Purpose: Fetch current + previous prosecutors for a seat

2. **Current Prosecutors Index**
   - Fields: `is_current` (Ascending), `seat_id` (Ascending)
   - Purpose: List all current prosecutors across all seats

3. **Historical Timeline Index**
   - Fields: `seat_id` (Ascending), `term_start` (Descending)
   - Purpose: Chronological history of seat occupancy

## Migration Strategy

### Phase 1: Extract Seat Data from Existing Records

For each unique `state` + `county_or_region` combination in existing prosecutor records:

1. Create a new `seats` document with normalized seat metadata
2. Generate consistent `seat_id` using the algorithm below

### Phase 2: Update Prosecutor Records

For each existing prosecutor record:

1. Add `seat_id` foreign key reference
2. Remove duplicated seat-level fields (optional, for storage efficiency)
3. Ensure `term_start` is set (use `start_date` or estimate from context)
4. Validate only one current prosecutor per seat

### Phase 3: Enrich Historical Data

Add previous prosecutors as new documents in `prosecutors` collection, all referencing the same `seat_id`

## Seat ID Generation Algorithm

```javascript
/**
 * Generate a unique seat_id from state and county/region
 * Format: {state}-{normalized-county-region}
 */
export function generateSeatId(state, countyOrRegion) {
  if (!state || !countyOrRegion) return null;
  
  const normalizedCounty = countyOrRegion
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')  // Replace slashes with hyphens
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
  
  return `${state.toLowerCase()}-${normalizedCounty}`;
}

// Examples:
generateSeatId("GA", "Laurens / Johnson / Twiggs / Treutlen") 
  // → "ga-laurens-johnson-twiggs-treutlen"

generateSeatId("PA", "Lebanon County") 
  // → "pa-lebanon-county"

generateSeatId("MS", "DeSoto County") 
  // → "ms-desoto-county"
```

## Query Patterns

### Get Current Prosecutor + Seat Info

```javascript
import { doc, getDoc, getFirestore } from "firebase/firestore";

async function getCurrentProsecutorWithSeat(seatId) {
  const db = getFirestore();
  
  // Fetch seat metadata
  const seatSnap = await getDoc(doc(db, "seats", seatId));
  const seat = seatSnap.exists() ? seatSnap.data() : null;
  
  // Fetch current prosecutor
  const q = query(
    collection(db, "prosecutors"),
    where("seat_id", "==", seatId),
    where("is_current", "==", true)
  );
  const snap = await getDocs(q);
  const current = snap.empty ? null : snap.docs[0].data();
  
  return { seat, current };
}
```

### Get Complete Seat History

```javascript
async function getSeatHistory(seatId) {
  const db = getFirestore();
  
  // Fetch seat metadata
  const seatSnap = await getDoc(doc(db, "seats", seatId));
  const seat = seatSnap.exists() ? seatSnap.data() : null;
  
  // Fetch all prosecutors (current + previous)
  const q = query(
    collection(db, "prosecutors"),
    where("seat_id", "==", seatId),
    orderBy("term_start", "desc")
  );
  const snap = await getDocs(q);
  const prosecutors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return {
    seat,
    current: prosecutors.find(p => p.is_current === true),
    previous: prosecutors.filter(p => p.is_current !== true)
  };
}
```

### Track Prosecutorial Trends Across Time

```javascript
async function analyzeSeatTrends(seatId) {
  const history = await getSeatHistory(seatId);
  
  // Analyze trends across multiple prosecutors
  const trends = {
    totalProsecutors: history.previous.length + (history.current ? 1 : 0),
    averageTermLength: calculateAverageTerm(history.prosecutors),
    partyChanges: countPartyChanges(history.prosecutors),
    campaignThemes: history.prosecutors.map(p => p.campaign_theme),
    incarcerationSignals: history.prosecutors.map(p => p.incarceration_signal)
  };
  
  return trends;
}
```

## Frontend Integration

### Updated Service Functions

```javascript
// src/services/seats.js
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";

export async function fetchSeatById(seatId) {
  try {
    const snap = await getDoc(doc(db, "seats", seatId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("Failed to fetch seat:", error);
    return null;
  }
}

export async function fetchProsecutorsBySeatId(seatId) {
  try {
    const q = query(
      collection(db, "prosecutors"),
      where("seat_id", "==", seatId)
    );
    const snap = await getDocs(q);
    
    const prosecutors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return {
      current: prosecutors.find(p => p.is_current === true) || null,
      previous: prosecutors
        .filter(p => p.is_current !== true)
        .sort((a, b) => {
          const dateA = a.term_end || a.term_start || '';
          const dateB = b.term_end || b.term_start || '';
          return dateB.localeCompare(dateA);
        })
    };
  } catch (error) {
    console.error("Failed to fetch prosecutors for seat:", error);
    return { current: null, previous: [] };
  }
}

export async function fetchSeatWithProsecutors(seatId) {
  const [seat, prosecutors] = await Promise.all([
    fetchSeatById(seatId),
    fetchProsecutorsBySeatId(seatId)
  ]);
  
  return {
    seat,
    ...prosecutors
  };
}
```

### Vue Component Usage

```vue
<script setup>
import { onMounted, ref } from "vue";
import { fetchSeatWithProsecutors } from "../services/seats";

const props = defineProps({ seatId: String });
const seatData = ref(null);

onMounted(async () => {
  seatData.value = await fetchSeatWithProsecutors(props.seatId);
});
</script>

<template>
  <article v-if="seatData">
    <header>
      <h1>{{ seatData.seat.jurisdiction }}</h1>
      <p>{{ seatData.seat.county_or_region }}</p>
    </header>
    
    <section v-if="seatData.current">
      <h2>Current Prosecutor</h2>
      <ProsecutorCard :prosecutor="seatData.current" />
    </section>
    
    <section v-if="seatData.previous.length > 0">
      <h2>Previous Prosecutors ({{ seatData.previous.length }})</h2>
      <div v-for="prev in seatData.previous" :key="prev.id">
        <ProsecutorCard :prosecutor="prev" />
      </div>
    </section>
    
    <section>
      <h2>Seat Trends</h2>
      <p>Total prosecutors tracked: {{ seatData.previous.length + 1 }}</p>
      <p>First recorded: {{ formatDate(seatData.previous[seatData.previous.length - 1]?.term_start) }}</p>
    </section>
  </article>
</template>
```

## Best Practices

### Data Integrity

1. **Validate Uniqueness**: Ensure only one `is_current: true` per seat
2. **Prevent Overlaps**: Validate no overlapping `term_start`/`term_end` dates
3. **Maintain Referential Integrity**: When deleting a seat, cascade delete or reassign prosecutors
4. **Use Transactions**: When updating current prosecutor status, use Firestore transactions

### Example Transaction for Prosecutor Transition

```javascript
import { runTransaction, doc, updateDoc, addDoc, collection } from "firebase/firestore";

async function transitionProsecutor(seatId, outgoingId, newProsecutorData) {
  const db = getFirestore();
  const seatRef = doc(db, "seats", seatId);
  const outgoingRef = doc(db, "prosecutors", outgoingId);
  
  await runTransaction(db, async (transaction) => {
    // Mark outgoing as not current
    transaction.update(outgoingRef, {
      is_current: false,
      term_end: new Date().toISOString()
    });
    
    // Add new prosecutor
    const newRef = doc(collection(db, "prosecutors"));
    transaction.set(newRef, {
      ...newProsecutorData,
      seat_id: seatId,
      is_current: true,
      term_start: new Date().toISOString(),
      term_end: null
    });
  });
}
```

### Query Optimization

1. **Denormalize Selectively**: Store `state` and `county_or_region` on both collections for easier filtering
2. **Use Composite Indexes**: Create indexes for common query patterns
3. **Cache Seat Data**: Seat metadata rarely changes; cache aggressively
4. **Batch Operations**: Use batch writes when adding multiple historical prosecutors

## Advantages of Relational Model

1. **Single Source of Truth**: Seat metadata stored once, not duplicated
2. **Easy Trend Analysis**: Query all prosecutors for a seat to track changes over time
3. **Flexible History**: Add unlimited historical prosecutors without schema changes
4. **Data Consistency**: Update seat boundaries once, applies to all prosecutors
5. **Scalability**: Separate collections scale independently
6. **Clear Semantics**: Explicit separation of position vs. person

## Future Enhancements

1. **Subcollections**: Consider `prosecutors` as subcollection under `seats/{seatId}/prosecutors`
2. **Election Records**: Add `elections` collection linking candidates to seats
3. **Boundary Changes**: Track historical boundary changes in separate collection
4. **Audit Trail**: Add `updated_by` and version tracking for accountability

---

**Last Updated**: March 24, 2026  
**Version**: 2.0 (Relational Model)
