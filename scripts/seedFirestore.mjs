import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { fallbackProsecutors } from "../src/data/fallbackProsecutors.js";

const requiredEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

for (const key of requiredEnvKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

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

let upserted = 0;
try {
  for (const prosecutor of fallbackProsecutors) {
    const { id, ...rest } = prosecutor;
    await setDoc(doc(db, "prosecutors", id), {
      ...rest,
      last_verified_at: new Date().toISOString(),
      updated_at: serverTimestamp(),
    });
    upserted += 1;
  }
} catch (error) {
  if (error?.code === "permission-denied") {
    console.error(
      "Firestore denied writes. Temporarily allow writes for /prosecutors in Firestore Rules, run seed again, then lock rules back down.",
    );
  }
  throw error;
}

console.log(`Seed complete. Upserted ${upserted} prosecutor records.`);
