import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import { app } from "../src/firebase.js";
import { generateSeatId } from "../src/services/prosecutors.js";

const db = getFirestore(app);

/**
 * Migration script to create seats collection from existing prosecutor data
 * This extracts unique seat metadata and creates seat documents
 */
async function migrateToRelationalSeats() {
  console.log("Starting migration to relational seat schema...");
  
  try {
    // Fetch all prosecutors
    const snap = await getDocs(collection(db, "prosecutors"));
    const prosecutors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`Found ${prosecutors.length} prosecutor records`);
    
    // Group by seat_id (or generate from state/county)
    const seatMap = new Map();
    
    for (const prosecutor of prosecutors) {
      const seatId = prosecutor.seat_id || generateSeatId(prosecutor.state, prosecutor.county_or_region);
      
      if (!seatId) {
        console.warn(`Skipping prosecutor ${prosecutor.id}: cannot generate seat_id`);
        continue;
      }
      
      if (!seatMap.has(seatId)) {
        seatMap.set(seatId, {
          seatId,
          state: prosecutor.state,
          county_or_region: prosecutor.county_or_region,
          jurisdiction: prosecutor.jurisdiction,
          office_type: prosecutor.office,
          prosecutors: []
        });
      }
      
      seatMap.get(seatId).prosecutors.push(prosecutor);
    }
    
    console.log(`Identified ${seatMap.size} unique seats`);
    
    // Create seat documents
    let created = 0;
    let updated = 0;
    
    for (const [seatId, seatData] of seatMap.entries()) {
      const seatRef = doc(db, "seats", seatId);
      const existing = await getDocs(query(collection(db, "seats"), where("__name__", "==", seatId)));
      
      const seatDocument = {
        id: seatId,
        state: seatData.state,
        state_name: getStateName(seatData.state),
        county_or_region: seatData.county_or_region,
        jurisdiction: seatData.jurisdiction,
        office_type: seatData.office_type || "District Attorney",
        circuit_type: seatData.county_or_region.includes("/") ? "multi-county" : "single-county",
        counties_served: seatData.county_or_region.split("/").map(c => c.trim().replace(" County", "")),
        election_cycle: 4,
        term_length: 4,
        appointment_method: "elected",
        last_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (existing.empty) {
        await setDoc(seatRef, {
          ...seatDocument,
          created_at: new Date().toISOString()
        });
        created++;
        console.log(`Created seat: ${seatId}`);
      } else {
        await setDoc(seatRef, {
          ...seatDocument,
          updated_at: new Date().toISOString()
        }, { merge: true });
        updated++;
        console.log(`Updated seat: ${seatId}`);
      }
      
      // Update prosecutor records with seat_id if missing
      for (const prosecutor of seatData.prosecutors) {
        if (!prosecutor.seat_id) {
          const prosecutorRef = doc(db, "prosecutors", prosecutor.id);
          await setDoc(prosecutorRef, {
            seat_id: seatId,
            updated_at: new Date().toISOString()
          }, { merge: true });
          console.log(`  - Added seat_id to prosecutor: ${prosecutor.id}`);
        }
        
        // Ensure term_start exists (use start_date or estimate)
        if (!prosecutor.term_start && prosecutor.start_date) {
          const prosecutorRef = doc(db, "prosecutors", prosecutor.id);
          await setDoc(prosecutorRef, {
            term_start: prosecutor.start_date,
            updated_at: new Date().toISOString()
          }, { merge: true });
        }
      }
    }
    
    console.log("\n✅ Migration complete!");
    console.log(`   Created: ${created} seats`);
    console.log(`   Updated: ${updated} seats`);
    console.log(`   Total seats: ${seatMap.size}`);
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

/**
 * Simple state abbreviation to name mapping
 * Extend as needed
 */
function getStateName(state) {
  const stateNames = {
    "GA": "Georgia",
    "PA": "Pennsylvania",
    "MS": "Mississippi",
    "CA": "California",
    "TX": "Texas",
    "FL": "Florida",
    "AK": "Alaska"
  };
  return stateNames[state] || state;
}

// Run migration
migrateToRelationalSeats()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
