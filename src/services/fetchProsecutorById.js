// ─────────────────────────────────────────────────────────────────────────────
// ADD this function to your existing src/services/prosecutors.js
//
// It assumes your Firestore collection is named "prosecutors" and that
// each document's ID matches the id field in your CSV (e.g. "ak-8e9dad1f990667ef").
//
// Adjust the import path to firebase.js and the collection name if they differ.
// ─────────────────────────────────────────────────────────────────────────────

import { db } from "../firebase";                    // your existing firebase init
import { doc, getDoc } from "firebase/firestore";

export async function fetchProsecutorById(id) {
  const snap = await getDoc(doc(db, "prosecutors", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ─────────────────────────────────────────────────────────────────────────────
// ALTERNATIVE: if your data is loaded from the CSV (not Firestore),
// filter from the full list instead:
// ─────────────────────────────────────────────────────────────────────────────

// export async function fetchProsecutorById(id) {
//   const all = await fetchProsecutors();   // re-uses your existing function
//   return all.find((p) => p.id === id) ?? null;
// }