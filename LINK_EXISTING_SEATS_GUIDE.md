# Link Existing Prosecutors to Existing Seats

Since you **already have the `seats` collection populated**, you don't need to run the full migration scripts that create seats from scratch. Instead, use this targeted script to link your existing prosecutors to your existing seats.

## 🚀 Quick Start

Run this single command to link everything:

```bash
npm run link:existing-seats
```

## 🔍 What This Script Does

1. **Reads your `seats` collection** - Fetches all existing seat documents
2. **Creates a lookup map** - Maps `state-county` combinations to seat IDs
3. **Scans `prosecutors` collection** - Finds all prosecutor records
4. **Links them together** - Updates each prosecutor with:
   - `seat_id`: The ID of the matching seat document
   - `is_current`: Automatically determined based on `term_end` date

## 📋 Requirements

- ✅ `seats` collection exists and contains documents with `state` and `county` fields
- ✅ `prosecutors` collection exists with `state`, `county`, and optionally `term_end` fields

## 🔧 How Matching Works

The script matches prosecutors to seats using a simple key:
```javascript
const key = `${state.toLowerCase()}-${county.toLowerCase()}`;
```

**Example:**
- Seat: `{ state: "GA", county: "Laurens" }` → ID: `seat_123`
- Prosecutor: `{ state: "ga", county: "laurens", name: "John Doe" }`
- Result: Prosecutor gets `seat_id: "seat_123"`

## ⚙️ Automatic `is_current` Detection

The script intelligently sets the `is_current` flag:
- **`true`**: If `term_end` is missing OR is in the future
- **`false`**: If `term_end` is in the past

## 📊 Output

You'll see a summary like:
```
🔍 Fetching existing seats...
✅ Found 50 unique seats to match against.
🔍 Fetching existing prosecutors...
🔄 Processing 120 prosecutors...
💾 Committing changes to Firestore...
✅ Successfully linked 115 prosecutors to seats.
📊 Summary: 115 updated, 5 skipped, 0 errors.
```

## ⚠️ Troubleshooting

### "No seats found in 'seats' collection"
Make sure you've actually populated the `seats` collection first. Check Firebase Console → Firestore → `seats`.

### "Skipping X: Missing county/state"
Some prosecutor records are missing required `state` or `county` fields. You'll need to manually fix these records.

### "No seat found for [Name]"
The `state-county` combination in the prosecutor record doesn't match any seat. This could be due to:
- Typos (e.g., "Los Angeles" vs "los angeles")
- Multi-county districts not properly handled
- Missing seat records

## 🔄 Next Steps After Linking

Once linked, you can query by seat to see all current and historical prosecutors:

```javascript
// Get all prosecutors for a specific seat
const seatId = 'your-seat-id';
const current = await db.collection('prosecutors')
  .where('seat_id', '==', seatId)
  .where('is_current', '==', true)
  .get();

const history = await db.collection('prosecutors')
  .where('seat_id', '==', seatId)
  .orderBy('term_start', 'desc')
  .get();
```

## 🛠️ Manual Adjustments

If the automatic matching misses some records, you can manually update them in Firebase Console:

1. Go to Firestore → `prosecutors` → [Document]
2. Add/Edit field: `seat_id` (string) → paste the seat document ID
3. Add/Edit field: `is_current` (boolean) → set appropriately
