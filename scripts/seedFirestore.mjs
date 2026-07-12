import 'dotenv/config';
import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import fs from "node:fs";

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

// Load data from seed file
let prosecutors;
try {
  prosecutors = JSON.parse(fs.readFileSync('./public/data/prosecutors.seed.json', 'utf8'));
} catch (error) {
  console.error('Error reading seed file:', error.message);
  process.exit(1);
}

if (!prosecutors || prosecutors.length === 0) {
  console.error('No prosecutor data found to seed.');
  process.exit(1);
}

console.log(`Found ${prosecutors.length} prosecutor records to seed\n`);

let upserted = 0;
let errors = 0;

try {
  for (const prosecutor of prosecutors) {
    const { id, ...rest } = prosecutor;
    
    if (!id) {
      console.log(`⚠ Skipping record: missing id field`);
      continue;
    }
    
    await setDoc(doc(db, "prosecutors", id), {
      ...rest,
      last_verified_at: new Date().toISOString(),
      updated_at: serverTimestamp(),
      created_at: new Date().toISOString()
    });
    
    console.log(`✓ Seeded ${prosecutor.name} (${id})`);
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

console.log(`\n✅ Seed complete. Upserted ${upserted} prosecutor records.`);
console.log('\nNext step: Run `npm run migrate:relational-seats` to create seat structure');
