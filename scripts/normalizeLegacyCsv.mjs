import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CSV_DIR = path.join(ROOT, "data", "csv");
const OUT_DIR = path.join(ROOT, "data", "normalized");

const STATE_BY_FILE = {
  az: "AZ",
  ca: "CA",
  co: "CO",
  fl: "FL",
  la: "LA",
  ms: "MS",
  nj: "NJ",
  ny: "NY",
  oh: "OH",
  ri: "RI",
  wi: "WI",
};

const STATE_ABBR = {
  alabama: "AL",
  alaska: "AK",
  "american samoa": "AS",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  "district of columbia": "DC",
  florida: "FL",
  georgia: "GA",
  guam: "GU",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  "northern mariana islands": "MP",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "puerto rico": "PR",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  "virgin islands": "VI",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

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
      continue;
    }

    field += char;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((v) => String(v ?? "").trim().length > 0));
}

function normalizeRole(v) {
  const raw = String(v ?? "").trim();
  const key = raw.toLowerCase().replace(/\s+/g, "_");
  const map = {
    district_attorney: "District Attorney",
    district_attorneys: "District Attorney",
    district_attorneys_office: "District Attorney",
    district_attorney_office: "District Attorney",
    attorney_general: "Attorney General",
    us_attorney: "US Attorney",
    prosecutor: "Prosecutor",
  };
  if (map[key]) return map[key];
  if (/^district attorneys?$/i.test(raw)) return "District Attorney";
  return raw ? raw : "District Attorney";
}

function cleanName(v) {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .replace(/^"+|"+$/g, "")
    .trim();
}

function cleanText(v) {
  return String(v ?? "")
    .replace(/\s+/g, " ")
    .replace(/[ ]+,/g, ",")
    .trim();
}

function normalizeState(value) {
  const raw = cleanText(value);
  if (!raw) return "";
  if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();
  const mapped = STATE_ABBR[raw.toLowerCase()];
  return mapped ?? raw;
}

function isLikelyHeaderName(name) {
  const n = String(name ?? "").trim().toLowerCase();
  if (!n) return true;
  const blocked = new Set([
    "district attorney",
    "district attorneys",
    "municipal attorney",
    "attorney general",
    "us attorney",
  ]);
  if (blocked.has(n)) return true;
  if (/^district attorney[, ]*$/.test(n)) return true;
  return false;
}

function lines(body) {
  return String(body ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function firstUrl(bodyLines) {
  const joined = bodyLines.join("\n");
  const matches = joined.match(/https?:\/\/[^\s)"]+/gi) ?? [];
  const useful = matches.find((u) => !/google\.com\/search\?/i.test(u));
  return useful ?? matches[0] ?? null;
}

function firstEmail(bodyLines) {
  const joined = bodyLines.join("\n");
  const m = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0] : null;
}

function firstPhone(bodyLines) {
  const joined = bodyLines.join(" ");
  const m = joined.match(/(?:\+?1[\s.-]*)?\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}/);
  return m ? m[0] : null;
}

function inferCountyOrRegion(bodyLines) {
  for (const ln of bodyLines) {
    if (/county|parish|judicial district|district/i.test(ln) && ln.length < 120) {
      return ln;
    }
  }
  return null;
}

function inferAttorneyGeneralState(bodyLines) {
  const blacklist = new Set(["attorney general", "republican", "democrat", "independent"]);
  for (const ln of bodyLines) {
    const candidate = ln.trim();
    if (!candidate) continue;
    if (candidate.length > 40) continue;
    if (blacklist.has(candidate.toLowerCase())) continue;
    if (/https?:\/\//i.test(candidate)) continue;
    if (/^\(?\d{3}\)?/.test(candidate)) continue;
    if (/fax|elected/i.test(candidate)) continue;
    return candidate;
  }
  return null;
}

function hasInternalNote(bodyLines) {
  return bodyLines.some((ln) => /internal note/i.test(ln));
}

function stableId({ name, role, state, county_or_region }) {
  const raw = [name, role, state ?? "", county_or_region ?? ""].join("|");
  const short = crypto.createHash("sha1").update(raw).digest("hex").slice(0, 16);
  const statePart = (state ?? "us").toLowerCase();
  return `${statePart}-${short}`;
}

function toCsv(rows, headers) {
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const out = [headers.join(",")];
  for (const row of rows) {
    out.push(headers.map((h) => esc(row[h])).join(","));
  }
  return `${out.join("\n")}\n`;
}

function isPriorityIssue(issue) {
  return [
    "missing_state_mapping",
    "internal_note_detected",
    "duplicate_source_file_content",
  ].includes(issue.type);
}

async function run() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = (await fs.readdir(CSV_DIR))
    .filter((f) => f.toLowerCase().endsWith(".csv"))
    .sort();

  const normalized = [];
  const issues = [];
  const sourceStats = [];

  const fileHashes = [];
  const duplicateFileMap = new Map();
  for (const file of files) {
    const filePath = path.join(CSV_DIR, file);
    const text = await fs.readFile(filePath, "utf8");
    const hash = crypto.createHash("sha1").update(text).digest("hex");
    const duplicateOf = fileHashes.find((f) => f.hash === hash);
    if (duplicateOf) duplicateFileMap.set(file, duplicateOf.file);
    fileHashes.push({ file, hash });
    if (duplicateOf) {
      sourceStats.push({
        source_file: file,
        columns: "SKIPPED_DUPLICATE_FILE",
        data_rows: 0,
      });
      continue;
    }
    const rows = parseCsv(text);
    if (rows.length < 2) continue;

    const headers = rows[0].map((h) => String(h ?? "").trim());
    const dataRows = rows.slice(1);
    const fileKey = path.basename(file, ".csv").toLowerCase();
    const state = STATE_BY_FILE[fileKey] ?? null;

    let rowCount = 0;
    for (const row of dataRows) {
      const rowObj = {};
      for (let i = 0; i < headers.length; i++) {
        rowObj[headers[i]] = row[i];
      }

      const name = cleanName(rowObj.title ?? rowObj.name ?? "");
      if (!name || isLikelyHeaderName(name)) continue;

      const isAttorneyGeneralFile = fileKey === "attorney-general";
      const role = isAttorneyGeneralFile
        ? "Attorney General"
        : normalizeRole(rowObj.field_role ?? rowObj.role);
      const bodyLines = lines(rowObj.body ?? "");
      const website = firstUrl(bodyLines);
      const email = firstEmail(bodyLines);
      const phone = firstPhone(bodyLines);
      const county_or_region = cleanText(
        rowObj.county ?? rowObj.county_or_region ?? inferCountyOrRegion(bodyLines) ?? "",
      );

      const inferredAgState = isAttorneyGeneralFile ? inferAttorneyGeneralState(bodyLines) : null;
      const normalizedState = normalizeState(inferredAgState ?? state ?? "");
      const item = {
        id: stableId({ name, role, state: normalizedState, county_or_region }),
        name,
        office: role,
        role,
        state: normalizedState,
        county_or_region: county_or_region || "",
        jurisdiction: "",
        website: website ?? "",
        email: email ?? "",
        phone: phone ?? "",
        source_file: file,
        source_row_number: rowCount + 2,
        notes: "Imported from legacy manual CSV. Verify campaign/incarceration evidence before publication.",
      };

      normalized.push(item);
      rowCount += 1;

      if (!normalizedState) {
        issues.push({
          severity: "warning",
          type: "missing_state_mapping",
          source_file: file,
          row_number: item.source_row_number,
          name: item.name,
          detail: "Filename is not mapped to a US state abbreviation.",
        });
      }
      if (!item.website) {
        issues.push({
          severity: "info",
          type: "missing_website",
          source_file: file,
          row_number: item.source_row_number,
          name: item.name,
          detail: "No URL found in body field.",
        });
      }
      if (hasInternalNote(bodyLines)) {
        issues.push({
          severity: "warning",
          type: "internal_note_detected",
          source_file: file,
          row_number: item.source_row_number,
          name: item.name,
          detail: "Internal note text detected in legacy row.",
        });
      }
    }

    sourceStats.push({
      source_file: file,
      columns: headers.join(", "),
      data_rows: rowCount,
    });
  }

  for (const [file, original] of duplicateFileMap.entries()) {
    issues.push({
      severity: "warning",
      type: "duplicate_source_file_content",
      source_file: file,
      row_number: "",
      name: "",
      detail: `File contents are identical to ${original}.`,
    });
  }

  const dedupMap = new Map();
  for (const row of normalized) {
    const k = `${row.name.toLowerCase()}|${row.state}|${row.county_or_region.toLowerCase()}`;
    if (!dedupMap.has(k)) {
      dedupMap.set(k, row);
      continue;
    }

    const existing = dedupMap.get(k);
    // Keep row with richer contact footprint.
    const score = (r) => Number(Boolean(r.website)) + Number(Boolean(r.email)) + Number(Boolean(r.phone));
    if (score(row) > score(existing)) dedupMap.set(k, row);
  }

  const deduped = Array.from(dedupMap.values()).sort((a, b) =>
    `${a.state}|${a.name}`.localeCompare(`${b.state}|${b.name}`),
  );

  const headers = [
    "id",
    "name",
    "office",
    "role",
    "state",
    "county_or_region",
    "jurisdiction",
    "website",
    "email",
    "phone",
    "source_file",
    "source_row_number",
    "notes",
  ];

  await fs.writeFile(path.join(OUT_DIR, "prosecutors.normalized.json"), `${JSON.stringify(deduped, null, 2)}\n`);
  await fs.writeFile(path.join(OUT_DIR, "prosecutors.normalized.csv"), toCsv(deduped, headers));
  await fs.writeFile(path.join(OUT_DIR, "normalization.issues.json"), `${JSON.stringify(issues, null, 2)}\n`);
  await fs.writeFile(path.join(OUT_DIR, "normalization.summary.json"), `${JSON.stringify(sourceStats, null, 2)}\n`);

  const priorityIssues = issues.filter(isPriorityIssue);
  const priorityHeaders = ["severity", "type", "source_file", "row_number", "name", "detail"];
  await fs.writeFile(path.join(OUT_DIR, "review-priority.csv"), toCsv(priorityIssues, priorityHeaders));

  console.log(`Normalized rows: ${normalized.length}`);
  console.log(`Deduped rows: ${deduped.length}`);
  console.log(`Issues logged: ${issues.length}`);
  console.log(`Priority review rows: ${priorityIssues.length}`);
  console.log(`Wrote: data/normalized/prosecutors.normalized.json`);
  console.log(`Wrote: data/normalized/prosecutors.normalized.csv`);
  console.log(`Wrote: data/normalized/normalization.issues.json`);
  console.log(`Wrote: data/normalized/normalization.summary.json`);
  console.log(`Wrote: data/normalized/review-priority.csv`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
