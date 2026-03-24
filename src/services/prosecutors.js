import Papa from "papaparse";

const CSV_URL = "/data/normalized/prosecutors.normalized.csv";

let _cache = null;

async function loadAll() {
  if (_cache) return _cache;

  const response = await fetch(CSV_URL);
  const text = await response.text();

  const { data } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  _cache = data;
  return _cache;
}

export async function fetchProsecutors() {
  return loadAll();
}

export async function fetchProsecutorById(id) {
  const all = await loadAll();
  return all.find((p) => p.id === id) ?? null;
}