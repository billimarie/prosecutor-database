import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { fallbackProsecutors } from "../src/data/fallbackProsecutors.js";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`Seeding ${fallbackProsecutors.length} fallback records to Firestore...`);
  
  for (const p of fallbackProsecutors) {
    const { id, ...data } = p;
    // Ensure all required fields for Firestore are present or cleaned
    const payload = {
      ...data,
      updated_at: serverTimestamp(),
      last_verified_at: new Date().toISOString(),
    };

    // Remove any undefined fields
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    try {
      await setDoc(doc(db, "prosecutors", id), payload, { merge: true });
      console.log(`✅ Seeded: ${p.name} (${id})`);
    } catch (err) {
      console.error(`❌ Failed to seed ${p.name}:`, err.message);
    }
  }
  
  console.log("Seeding complete.");
  process.exit(0);
}

seed();
