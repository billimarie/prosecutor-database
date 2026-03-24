import Papa from "papaparse";

const CSV_URLS = [
  "/data/normalized/prosecutors.normalized.csv",
  "/data/normalized/us-attorneys.normalized.csv",
];

let _cache = null;

async function loadAll() {
  if (_cache) return _cache;
  const texts = await Promise.all(CSV_URLS.map(u => fetch(u).then(r => r.text())));
  _cache = texts.flatMap(text => Papa.parse(text, { header: true, skipEmptyLines: true }).data);
  return _cache;
}

export async function fetchProsecutors() {
  return loadAll();
}

export async function fetchProsecutorById(id) {
  const all = await loadAll();
  return all.find((p) => p.id === id) ?? null;
}