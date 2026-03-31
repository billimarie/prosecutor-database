import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

let _cache = null;

async function fetchFromFirestore() {
  if (_cache) return _cache;
  console.log("Fetching prosecutors from Firestore...");
  const snap = await getDocs(collection(db, "prosecutors"));
  _cache = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return _cache;
}

export async function fetchProsecutors() {
  return fetchFromFirestore();
}

export async function fetchProsecutorById(id) {
  // Always try to fetch its own doc first for freshness if desired
  // Or just use the cache. For consistency with old logic, using specific doc.
  const snap = await getDoc(doc(db, "prosecutors", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}