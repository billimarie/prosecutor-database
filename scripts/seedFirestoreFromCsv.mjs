import 'dotenv/config';
import fs from "node:fs";
import crypto from "node:crypto";
import process from "node:process";

import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--csv" && argv[i + 1]) args.csv = argv[i + 1];
    if (token === "--collection" && argv[i + 1]) args.collection = argv[i + 1];
  }
  return args;
}

// Simple CSV parser with support for quoted fields.
// Expects RFC4180-ish CSV exports (commas + quotes).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }

    if (char === "\r") {
      i += 1;
      continue; // handle CRLF
    }

    field += char;
    i += 1;
  }

  // last line (if not newline-terminated)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Remove any fully-empty trailing rows
  return rows.filter((r) => r.some((cell) => String(cell ?? "").trim().length > 0));
}

function normalizeRole(fieldRole) {
  const v = String(fieldRole ?? "").trim().toLowerCase();
  if (!v) return null;
  const map = {
    district_attorney: "District Attorney",
    assistant_district_attorney: "Assistant District Attorney",
    prosecutor: "Prosecutor",
    attorney_general: "Attorney General",
    deputy_ag: "Deputy AG",
    us_attorney: "US Attorney",
  };
  return map[v] ?? fieldRole;
}

function toBool(v) {
  const s = String(v ?? "").trim().toLowerCase();
  if (["true", "yes", "1", "y"].includes(s)) return true;
  if (["false", "no", "0", "n", ""].includes(s)) return false;
  return null;
}

const args = parseArgs(process.argv.slice(2));
if (!args.csv) {
  throw new Error('Missing required arg: "--csv path/to/file.csv"');
}

const collection = args.collection ?? "prosecutors";
const csvText = fs.readFileSync(args.csv, "utf8");
const table = parseCsv(csvText);

if (table.length < 2) {
  throw new Error("CSV appears to have no data rows.");
}

const headers = table[0].map((h) => String(h ?? "").trim().toLowerCase());
const rows = table.slice(1);

const roleKeys = ["field_role", "role"];
const nameKeys = ["title", "name", "prosecutor_name"];
const stateKeys = ["state", "jurisdiction_state"];
const countyKeys = ["county", "county_or_region", "jurisdiction_county"];
const officeKeys = ["office", "role", "field_role"];
const websiteKeys = ["website", "url", "web", "homepage"];
const emailKeys = ["email", "contact_email"];
const phoneKeys = ["phone", "contact_phone"];
const jurisdictionKeys = ["jurisdiction", "district", "circuit"];

const requiredEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];
for (const key of requiredEnvKeys) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
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

for (const r of rows) {
  const rowObj = {};
  for (let c = 0; c < headers.length; c++) {
    rowObj[headers[c]] = r[c];
  }

  const name =
    nameKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;

  if (!name) continue;

  const rawRole = officeKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0);
  const role = normalizeRole(rawRole ?? roleKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0));

  const state = stateKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;
  const county_or_region =
    countyKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;
  const website =
    websiteKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;
  const email = emailKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;
  const phone = phoneKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;
  const jurisdiction =
    jurisdictionKeys.map((k) => rowObj[k]).find((x) => String(x ?? "").trim().length > 0) ?? null;

  const id = crypto
    .createHash("sha1")
    .update([name, role ?? "", state ?? "", county_or_region ?? ""].join("|"))
    .digest("hex")
    .slice(0, 16);

  const docPayload = {
    id,
    name: String(name).trim(),
    office: role ?? "Prosecutor",
    role: role ?? "Prosecutor",
    state: state ? String(state).trim() : undefined,
    county_or_region: county_or_region ? String(county_or_region).trim() : undefined,
    jurisdiction: jurisdiction ? String(jurisdiction).trim() : undefined,
    website: website ? String(website).trim() : undefined,
    email: email ? String(email).trim() : undefined,
    phone: phone ? String(phone).trim() : undefined,
    small_town_focus: toBool(rowObj.small_town_focus) ?? undefined,
    campaign_theme: undefined,
    incarceration_signal: undefined,
    source_urls: undefined,
    notes:
      "Imported from spreadsheet. Campaign/incarceration indicators require verification before being used as evidence.",
    last_verified_at: new Date().toISOString(),
    updated_at: serverTimestamp(),
  };

  // Remove undefined fields to keep documents clean.
  Object.keys(docPayload).forEach((k) => {
    if (docPayload[k] === undefined) delete docPayload[k];
  });

  await setDoc(doc(db, collection, id), docPayload, { merge: true });
  upserted += 1;
}

console.log(`Spreadsheet seed complete. Upserted ${upserted} docs into ${collection}/`);

