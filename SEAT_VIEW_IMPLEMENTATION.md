# Seat-Based Prosecutor Tracking - Implementation Guide

## Overview

Your US Prosecutor Database now tracks **seats** (prosecutorial positions) rather than just individual prosecutors. This allows you to:

- Track multiple people through the same seat over time
- Analyze prosecutorial trends across different occupants
- Maintain historical records without duplicating seat data
- View complete seat history in a dedicated timeline view

## Data Structure

### Collections

#### 1. `seats` Collection
Static position metadata - one document per jurisdiction.

```javascript
{
  id: "seat_us_ca_southern",  // Document ID
  state: "CA",
  county_or_region: "Southern District",
  jurisdiction: "Southern District of California",
  fips_codes: ["06037", "06059", "06065"],  // Optional
  notes: "Federal district covering Southern California",
  created_at: "2024-01-15T00:00:00.000Z"
}
```

#### 2. `prosecutors` Collection
Individual officeholders linked to seats via `seat_id`.

```javascript
{
  id: "prosecutor_123",  // Document ID
  seat_id: "seat_us_ca_southern",  // Reference to seats collection
  name: "Current Prosecutor",
  is_current: true,  // Boolean: only ONE per seat should be true
  term_start: "2021-01-20T00:00:00.000Z",
  term_end: null,  // null if current
  role: "U.S. Attorney",
  office: "United States Attorney's Office",
  bio: "...",
  education: "...",
  career_highlights: [...],
  relevant_cases: [...],
  // ... other fields
}
```

### Key Relationships

- **One-to-Many**: One `seat` → Many `prosecutors` (current + historical)
- **Link Field**: `prosecutors.seat_id` references `seats.id`
- **Current Flag**: Only ONE prosecutor per seat should have `is_current: true`

## Frontend Views

### 1. Seat View (`/seat/:id`)

**File**: `src/views/SeatView.vue`

Displays complete seat history with:
- Aggregate statistics (total prosecutors, average term length)
- Current prosecutor highlight card
- Timeline of previous prosecutors
- Incarceration trends for the jurisdiction
- Navigation to individual prosecutor profiles

**Features**:
- Visual timeline with markers
- Term duration calculations
- Click-through to individual profiles
- Responsive card design

### 2. Prosecutor View (`/prosecutor/:id`)

**File**: `src/views/ProsecutorView.vue`

Updated to include:
- Link to seat history page ("→ View Seat History")
- Displays individual prosecutor details
- Shows previous prosecutors for context

## Services

### `src/services/seats.js`

Key functions:

```javascript
// Fetch seat by ID
fetchSeatById(seatId)

// Fetch all prosecutors for a seat
fetchProsecutorsBySeatId(seatId)
// Returns: { current: {...}, previous: [...] }

// Get complete seat data with prosecutors
fetchSeatWithProsecutors(seatId)

// Add prosecutor to seat
addProsecutorToSeat(seatId, prosecutorData)

// Transition prosecutor (atomic operation)
transitionProsecutor(seatId, outgoingId, newData)

// Validate only one current prosecutor
validateCurrentProsecutorUniqueness(seatId)

// Analyze trends across prosecutors
analyzeSeatTrends(seatId)
```

### `src/services/prosecutors.js`

Existing functions enhanced with seat support:

```javascript
// Generate seat_id from state/county
generateSeatId(state, countyOrRegion)

// Fetch prosecutors by seat
fetchProsecutorsBySeatId(seatId)

// Get current + previous for a specific prosecutor
fetchCurrentAndPreviousForProsecutor(prosecutorId)
```

## Router Configuration

**File**: `src/router/index.js`

New route added:
```javascript
{
  path: "/seat/:id",
  name: "seat",
  component: SeatView,
  props: true,
}
```

## Usage Examples

### Adding Prosecutors to Your Existing Seat

You have `seat_us_ca_southern` in Firestore. Add prosecutors like this:

#### Option 1: Firebase Console (Manual)

1. Go to Firebase Console → Firestore
2. Create document in `prosecutors` collection
3. Set fields:
   ```
   seat_id: "seat_us_ca_southern"
   name: "John Doe"
   is_current: true
   term_start: "2021-01-20"
   role: "U.S. Attorney"
   // ... other fields
   ```

#### Option 2: Programmatic (Using Service)

```javascript
import { addProsecutorToSeat } from './services/seats';

await addProsecutorToSeat('seat_us_ca_southern', {
  name: 'Jane Smith',
  is_current: true,
  term_start: new Date().toISOString(),
  role: 'U.S. Attorney',
  bio: '...',
  education: '...',
  // ... other fields
});
```

#### Option 3: CSV Import

Use the template at `public/data/import-templates/prosecutor-bulk-import-template.csv`:

```csv
seat_id,name,is_current,term_start,term_end,role,bio,education
seat_us_ca_southern,Jane Doe,true,2021-01-20,,U.S. Attorney,Bio here,Law School
seat_us_ca_southern,John Previous,false,2017-01-20,2021-01-19,U.S. Attorney,Old bio,Old school
```

### Viewing Seat History

Navigate to: `/seat/seat_us_ca_southern`

This shows:
- Current prosecutor (Jane Doe)
- All previous prosecutors in timeline
- Aggregate statistics
- Link to individual profiles

### Transitioning Prosecutors

When a prosecutor leaves office:

```javascript
import { transitionProsecutor } from './services/seats';

await transitionProsecutor(
  'seat_us_ca_southern',
  'outgoing_prosecutor_id',
  {
    name: 'New Prosecutor',
    role: 'U.S. Attorney',
    bio: '...',
    // Don't set is_current or term_start - handled automatically
  }
);
```

This atomically:
1. Marks outgoing as `is_current: false`
2. Sets their `term_end` date
3. Creates new prosecutor with `is_current: true`
4. Sets new `term_start` date

## Best Practices

### 1. Maintain Data Integrity

```javascript
// Always validate before adding
const validation = await validateCurrentProsecutorUniqueness(seatId);
if (!validation.valid) {
  console.error(`Multiple current prosecutors: ${validation.currentIds}`);
}
```

### 2. Use Transactions for Updates

The `transitionProsecutor()` function uses Firestore transactions to ensure atomicity.

### 3. Consistent ID Generation

Use the provided `generateSeatId()` function for consistency:

```javascript
import { generateSeatId } from './services/prosecutors';

const seatId = generateSeatId('CA', 'Southern District');
// Returns: "ca-southern-district"
```

### 4. Date Formats

Always use ISO 8601 format:
```javascript
new Date().toISOString()  // "2024-01-15T12:00:00.000Z"
```

## Migration from Old Structure

If you have existing prosecutors without `seat_id`:

1. **Auto-generate seat_id** for each record:
   ```javascript
   import { generateSeatId } from './services/prosecutors';
   
   const seatId = generateSeatId(prosecutor.state, prosecutor.county_or_region);
   ```

2. **Create seat documents** for unique combinations

3. **Update prosecutor records** with `seat_id` field

4. **Set `is_current` flags** appropriately

## Query Examples

### Get All Seats in a State

```javascript
import { fetchSeatsByState } from './services/seats';

const caSeats = await fetchSeatsByState('CA');
```

### Get Complete Seat History

```javascript
import { fetchSeatWithProsecutors } from './services/seats';

const seatData = await fetchSeatWithProsecutors('seat_us_ca_southern');
console.log(seatData.seat);        // Seat metadata
console.log(seatData.current);     // Current prosecutor
console.log(seatData.previous);    // Array of previous prosecutors
```

### Analyze Trends

```javascript
import { analyzeSeatTrends } from './services/seats';

const trends = await analyzeSeatTrends('seat_us_ca_southern');
console.log(trends.totalProsecutors);    // Number of prosecutors
console.log(trends.averageTermLength);   // Average term in years
console.log(trends.partyChanges);        // Party switches
console.log(trends.campaignThemes);      // All campaign themes
```

## Testing Locally

1. Start development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   - Seat view: `http://localhost:5173/seat/seat_us_ca_southern`
   - Prosecutor view: `http://localhost:5173/prosecutor/[id]`

3. Verify:
   - Seat statistics display correctly
   - Timeline shows all prosecutors
   - Click-through navigation works
   - Responsive design on mobile

## Next Steps

1. **Add Historical Data**: Import previous prosecutors for each seat
2. **Enhance Analytics**: Build trend analysis dashboards
3. **Admin Interface**: Create UI for managing seats and transitions
4. **Search & Filter**: Add seat-based search functionality
5. **Export Features**: Generate reports by seat or jurisdiction

## Support Files

- **SeatView.vue**: Main seat timeline view
- **seats.js**: Seat service functions
- **router/index.js**: Route configuration
- **ProsecutorView.vue**: Updated with seat links
- **SEAT_SETUP_GUIDE.md**: Detailed setup instructions
- **MIGRATION_TO_SEAT_TRACKING.md**: Migration guide

---

**Key Insight**: The database now tracks the **seat** (the prosecutorial position) as the primary entity, with individual prosecutors as temporal occupants. This enables powerful longitudinal analysis of prosecutorial behavior and outcomes independent of who currently holds office.
