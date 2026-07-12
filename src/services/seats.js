import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, query, where, orderBy, runTransaction } from "firebase/firestore";

/**
 * Fetch a seat by its ID
 * @param {string} seatId - The seat identifier
 * @returns {Promise<Object|null>}
 */
export async function fetchSeatById(seatId) {
  try {
    const snap = await getDoc(doc(db, "seats", seatId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("Failed to fetch seat:", error);
    return null;
  }
}

/**
 * Fetch all seats for a given state
 * @param {string} state - State abbreviation (e.g., "GA")
 * @returns {Promise<Array>}
 */
export async function fetchSeatsByState(state) {
  try {
    const q = query(
      collection(db, "seats"),
      where("state", "==", state.toUpperCase())
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Failed to fetch seats by state:", error);
    return [];
  }
}

/**
 * Fetch all prosecutors for a given seat (current and previous)
 * @param {string} seatId - The seat identifier
 * @returns {Promise<{current: Object|null, previous: Array}>}
 */
export async function fetchProsecutorsBySeatId(seatId) {
  try {
    const q = query(
      collection(db, "prosecutors"),
      where("seat_id", "==", seatId)
    );
    const snap = await getDocs(q);
    
    if (snap.empty) {
      return { current: null, previous: [] };
    }
    
    const prosecutors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Separate current and previous
    const current = prosecutors.find(p => p.is_current === true) || null;
    const previous = prosecutors
      .filter(p => p.is_current !== true)
      .sort((a, b) => {
        // Sort by term_end descending (most recent first)
        const dateA = a.term_end || a.term_start || '';
        const dateB = b.term_end || b.term_start || '';
        return dateB.localeCompare(dateA);
      });
    
    return { current, previous };
  } catch (error) {
    console.error("Failed to fetch prosecutors for seat:", error);
    return { current: null, previous: [] };
  }
}

/**
 * Fetch complete seat data with all prosecutors
 * @param {string} seatId - The seat identifier
 * @returns {Promise<{seat: Object|null, current: Object|null, previous: Array}>}
 */
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

/**
 * Create or update a seat document
 * @param {string} seatId - The seat identifier
 * @param {Object} seatData - Seat metadata
 * @returns {Promise<void>}
 */
export async function upsertSeat(seatId, seatData) {
  try {
    const seatRef = doc(db, "seats", seatId);
    const existing = await getDoc(seatRef);
    
    if (existing.exists()) {
      await updateDoc(seatRef, {
        ...seatData,
        updated_at: new Date().toISOString()
      });
    } else {
      await setDoc(seatRef, {
        ...seatData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    console.log(`Seat ${seatId} saved successfully`);
  } catch (error) {
    console.error("Failed to save seat:", error);
    throw error;
  }
}

/**
 * Add a new prosecutor to a seat
 * @param {string} seatId - The seat identifier
 * @param {Object} prosecutorData - Prosecutor data (without seat_id)
 * @returns {Promise<string>} - The new prosecutor document ID
 */
export async function addProsecutorToSeat(seatId, prosecutorData) {
  try {
    const prosecutorRef = doc(collection(db, "prosecutors"));
    await setDoc(prosecutorRef, {
      ...prosecutorData,
      seat_id: seatId,
      created_at: new Date().toISOString()
    });
    
    console.log(`Prosecutor added to seat ${seatId}: ${prosecutorRef.id}`);
    return prosecutorRef.id;
  } catch (error) {
    console.error("Failed to add prosecutor:", error);
    throw error;
  }
}

/**
 * Transition prosecutor - mark current as previous and add new current
 * Uses Firestore transaction to ensure data integrity
 * @param {string} seatId - The seat identifier
 * @param {string} outgoingProsecutorId - ID of prosecutor leaving office
 * @param {Object} newProsecutorData - Data for incoming prosecutor
 * @returns {Promise<{outgoingId: string, incomingId: string}>}
 */
export async function transitionProsecutor(seatId, outgoingProsecutorId, newProsecutorData) {
  const db = getFirestore();
  const outgoingRef = doc(db, "prosecutors", outgoingProsecutorId);
  
  try {
    const result = await runTransaction(db, async (transaction) => {
      // Verify outgoing prosecutor exists and is current
      const outgoingSnap = await transaction.get(outgoingRef);
      if (!outgoingSnap.exists()) {
        throw new Error("Outgoing prosecutor not found");
      }
      
      const outgoingData = outgoingSnap.data();
      if (outgoingData.seat_id !== seatId) {
        throw new Error("Outgoing prosecutor does not belong to this seat");
      }
      
      if (outgoingData.is_current !== true) {
        throw new Error("Outgoing prosecutor is not marked as current");
      }
      
      // Mark outgoing as not current
      transaction.update(outgoingRef, {
        is_current: false,
        term_end: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      // Create new prosecutor document
      const newRef = doc(collection(db, "prosecutors"));
      transaction.set(newRef, {
        ...newProsecutorData,
        seat_id: seatId,
        is_current: true,
        term_start: new Date().toISOString(),
        term_end: null,
        created_at: new Date().toISOString()
      });
      
      return { outgoingId: outgoingProsecutorId, incomingId: newRef.id };
    });
    
    console.log(`Prosecutor transition completed for seat ${seatId}`);
    return result;
  } catch (error) {
    console.error("Failed to transition prosecutor:", error);
    throw error;
  }
}

/**
 * Validate that only one prosecutor per seat is marked as current
 * @param {string} seatId - The seat identifier
 * @returns {Promise<{valid: boolean, currentCount: number, currentIds: Array}>}
 */
export async function validateCurrentProsecutorUniqueness(seatId) {
  try {
    const q = query(
      collection(db, "prosecutors"),
      where("seat_id", "==", seatId),
      where("is_current", "==", true)
    );
    const snap = await getDocs(q);
    const currentProsecutors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return {
      valid: currentProsecutors.length <= 1,
      currentCount: currentProsecutors.length,
      currentIds: currentProsecutors.map(p => p.id)
    };
  } catch (error) {
    console.error("Validation failed:", error);
    return { valid: false, currentCount: -1, currentIds: [], error: error.message };
  }
}

/**
 * Get chronological history of prosecutors for a seat
 * @param {string} seatId - The seat identifier
 * @returns {Promise<Array>} - Sorted by term_start ascending
 */
export async function getSeatHistoryChronological(seatId) {
  try {
    const q = query(
      collection(db, "prosecutors"),
      where("seat_id", "==", seatId),
      orderBy("term_start", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Failed to fetch seat history:", error);
    return [];
  }
}

/**
 * Analyze trends across multiple prosecutors for a seat
 * @param {string} seatId - The seat identifier
 * @returns {Promise<Object>}
 */
export async function analyzeSeatTrends(seatId) {
  const { current, previous } = await fetchProsecutorsBySeatId(seatId);
  const allProsecutors = [...previous, ...(current ? [current] : [])];
  
  if (allProsecutors.length === 0) {
    return {
      totalProsecutors: 0,
      averageTermLength: null,
      partyChanges: 0,
      campaignThemes: [],
      incarcerationSignals: []
    };
  }
  
  // Calculate average term length
  const termsWithEnd = allProsecutors.filter(p => p.term_start && p.term_end);
  const averageTermLength = termsWithEnd.length > 0
    ? termsWithEnd.reduce((sum, p) => {
        const start = new Date(p.term_start).getTime();
        const end = new Date(p.term_end).getTime();
        return sum + (end - start);
      }, 0) / termsWithEnd.length / (1000 * 60 * 60 * 24 * 365.25) // Convert to years
    : null;
  
  // Count party changes
  let partyChanges = 0;
  const sortedByTime = allProsecutors.sort((a, b) => {
    const dateA = a.term_start || '';
    const dateB = b.term_start || '';
    return dateA.localeCompare(dateB);
  });
  
  for (let i = 1; i < sortedByTime.length; i++) {
    if (sortedByTime[i].political_party && 
        sortedByTime[i-1].political_party &&
        sortedByTime[i].political_party !== sortedByTime[i-1].political_party) {
      partyChanges++;
    }
  }
  
  return {
    totalProsecutors: allProsecutors.length,
    averageTermLength: averageTermLength ? parseFloat(averageTermLength.toFixed(2)) : null,
    partyChanges,
    campaignThemes: allProsecutors.map(p => p.campaign_theme).filter(Boolean),
    incarcerationSignals: allProsecutors.map(p => p.incarceration_signal).filter(Boolean)
  };
}

// Re-export generateSeatId from prosecutors service for convenience
export { generateSeatId } from "./prosecutors.js";
