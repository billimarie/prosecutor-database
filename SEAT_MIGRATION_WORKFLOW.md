# Seat-Based Migration Workflow

## Problem
The migration script skipped all records because your Firestore database is empty. The scripts expect data to already exist in Firestore.

## Solution: Two-Step Process

### Step 1: Seed the Database
First, load your prosecutor data from the seed file into Firestore:

```bash
npm run seed:firestore
```

This will:
- Read `public/data/prosecutors.seed.json`
- Create documents in the `prosecutors` collection
- Preserve all existing fields (name, state, county, etc.)

### Step 2: Run Relational Seat Migration
After seeding, run the relational migration:

```bash
npm run migrate:relational-seats
```

This will:
- Scan all prosecutors in Firestore
- Extract unique seat information (state + county combinations)
- **Automatically create** entries in the new `seats` collection
- Link each prosecutor to their corresponding seat via `seat_id`
- Add missing fields like `term_start`, `is_current`, etc.

## Why This Works

You **don't need to manually create seat entries**. The migration script:

1. **Auto-discovers seats** by analyzing existing prosecutor records
2. **Generates seat_id** from state and county (e.g., `ga-laurens-johnson-twiggs-treutlen`)
3. **Creates seat documents** with metadata like:
   - `state`, `county_or_region`, `jurisdiction`
   - `office_type`, `circuit_type`, `counties_served`
   - `election_cycle`, `term_length`, `appointment_method`
4. **Links prosecutors** to their seats automatically

## Example Flow

```bash
# 1. Configure Firebase credentials
cp .env.example .env
# Edit .env with your Firebase project credentials

# 2. Seed initial data
npm run seed:firestore
# Output: ✓ Seeded Harold McLendon (ga-ocmulgee-harold-mclendon-2024)
#         ✓ Seeded Michael Light II (pa-lebanon-michael-light-2025)
#         ...
#         ✅ Seed complete. Upserted 3 prosecutor records.

# 3. Create relational structure
npm run migrate:relational-seats
# Output: Found 3 prosecutor records
#         Identified 3 unique seats
#         Created seat: ga-laurens-johnson-twiggs-treutlen
#         Created seat: pa-lebanon-county
#         ...
#         ✅ Migration complete! Created: 3 seats
```

## Adding Historical Prosecutors

Once the structure is in place, add previous prosecutors for each seat:

1. Use the CSV template: `public/data/import-templates/prosecutor-bulk-import-template.csv`
2. Set `is_current: false` for historical records
3. Include `term_start` and `term_end` dates
4. Use the same `seat_id` as the current prosecutor

Example CSV row for a previous prosecutor:
```csv
id,name,state,county_or_region,seat_id,is_current,term_start,term_end,office
ga-ocmulgee-previous-district-attorney,John Smith,GA,"Laurens / Johnson / Twiggs / Treutlen",ga-laurens-johnson-twiggs-treutlen,false,2016-01-01,2024-01-01,District Attorney
```

## Querying Trends

With the relational structure, you can now query:

```javascript
// Get all prosecutors for a seat (current + historical)
const seatProsecutors = await fetchProsecutorsBySeatId('ga-laurens-johnson-twiggs-treutlen');

// Returns:
{
  seat: { /* seat metadata */ },
  current: { /* current prosecutor */ },
  previous: [ /* array of past prosecutors */ ]
}
```

This enables tracking prosecutorial trends across different humans who occupied the same seat over time.
