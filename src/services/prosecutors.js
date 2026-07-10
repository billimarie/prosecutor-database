import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

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
