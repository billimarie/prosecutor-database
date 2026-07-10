import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";

let _cache = null;

// Local data fallback
let _localData = null;

async function fetchFromLocalData() {
  if (_localData) return _localData;
  
  try {
    console.log("Loading local data as fallback...");
    
    // Try combined file first, then fallback to seed
    let response = await fetch("/data/all-prosecutors.json");
    if (!response.ok) {
      response = await fetch("/data/prosecutors.seed.json");
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    _localData = await response.json();
    console.log(`Loaded ${_localData.length} records from local data`);
    return _localData;
  } catch (error) {
    console.error("Failed to load local data:", error);
    return [];
  }
}

async function fetchFromFirestore() {
  if (_cache) return _cache;
  
  try {
    console.log("Fetching prosecutors from Firestore...");
    const snap = await getDocs(collection(db, "prosecutors"));
    _cache = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Loaded ${_cache.length} records from Firestore`);
    return _cache;
  } catch (error) {
    console.error("Firestore fetch failed, falling back to local data:", error);
    return fetchFromLocalData();
  }
}

export async function fetchProsecutors() {
  // Try Firestore first, fallback to local data
  const data = await fetchFromFirestore();
  
  // If Firestore returned nothing, try local data
  if (!data || data.length === 0) {
    console.log("No data from Firestore, loading local data...");
    return fetchFromLocalData();
  }
  
  return data;
}

export async function fetchProsecutorById(id) {
  // Try Firestore first
  try {
    const snap = await getDoc(doc(db, "prosecutors", id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.error("Firestore fetch failed for ID:", id);
  }
  
  // Fallback to local data
  const localData = await fetchFromLocalData();
  return localData.find(p => p.id === id) || null;
}

/**
 * Generate a seat_id from state and county_or_region
 * This creates a unique identifier for each prosecutor seat
 */
export function generateSeatId(state, countyOrRegion) {
  if (!state || !countyOrRegion) return null;
  // Normalize: lowercase, replace spaces/slashes with hyphens, remove special chars
  const normalizedCounty = countyOrRegion
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${state.toLowerCase()}-${normalizedCounty}`;
}

/**
 * Fetch all prosecutors for a given seat (current and previous)
 * @param {string} seatId - The seat identifier (state-county_region)
 * @returns {Promise<{current: Object|null, previous: Array}>}
 */
export async function fetchProsecutorsBySeatId(seatId) {
  const result = { current: null, previous: [] };
  
  // Try Firestore first
  try {
    const q = query(collection(db, "prosecutors"), where("seat_id", "==", seatId));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const prosecutors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Separate current and previous prosecutors
      for (const prosecutor of prosecutors) {
        if (prosecutor.is_current === true) {
          // If multiple are marked current, use the most recently verified
          if (!result.current || 
              (prosecutor.last_verified_at && (!result.current.last_verified_at || 
               prosecutor.last_verified_at > result.current.last_verified_at))) {
            result.current = prosecutor;
          }
        } else {
          result.previous.push(prosecutor);
        }
      }
      
      // Sort previous prosecutors by end date or last verified (most recent first)
      result.previous.sort((a, b) => {
        const dateA = a.end_date || a.last_verified_at || '';
        const dateB = b.end_date || b.last_verified_at || '';
        return dateB.localeCompare(dateA);
      });
      
      console.log(`Loaded ${prosecutors.length} prosecutors for seat ${seatId}`);
      return result;
    }
  } catch (error) {
    console.error("Firestore fetch failed for seat:", seatId, error);
  }
  
  // Fallback to local data
  const localData = await fetchFromLocalData();
  const seatProsecutors = localData.filter(p => {
    const pSeatId = p.seat_id || generateSeatId(p.state, p.county_or_region);
    return pSeatId === seatId;
  });
  
  for (const prosecutor of seatProsecutors) {
    if (prosecutor.is_current === true) {
      if (!result.current || 
          (prosecutor.last_verified_at && (!result.current.last_verified_at || 
           prosecutor.last_verified_at > result.current.last_verified_at))) {
        result.current = prosecutor;
      }
    } else {
      result.previous.push(prosecutor);
    }
  }
  
  result.previous.sort((a, b) => {
    const dateA = a.end_date || a.last_verified_at || '';
    const dateB = b.end_date || b.last_verified_at || '';
    return dateB.localeCompare(dateA);
  });
  
  return result;
}

/**
 * Fetch current and previous prosecutors for a specific prosecutor's seat
 * @param {string} prosecutorId - The ID of a prosecutor record
 * @returns {Promise<{current: Object|null, previous: Array}>}
 */
export async function fetchCurrentAndPreviousForProsecutor(prosecutorId) {
  // First, get the prosecutor to determine their seat
  const prosecutor = await fetchProsecutorById(prosecutorId);
  if (!prosecutor) return { current: null, previous: [] };
  
  // Generate seat_id if not present
  const seatId = prosecutor.seat_id || generateSeatId(prosecutor.state, prosecutor.county_or_region);
  if (!seatId) return { current: prosecutor, previous: [] };
  
  // Fetch all prosecutors for this seat
  return fetchProsecutorsBySeatId(seatId);
}
