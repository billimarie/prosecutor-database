<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { fetchProsecutors } from "../services/prosecutors";
import { useSeoMeta } from "../composables/useSeoMeta";

const loading = ref(true);
const prosecutors = ref([]);

// --- filter state ---
const search     = ref("");
const roleFilter = ref("All");
const stateFilter = ref("All");

// Apply static SEO for the home / listing page.
const origin =
  typeof window !== "undefined" && window.location && window.location.origin
    ? window.location.origin
    : "https://us-prosecutor-database.netlify.app";

useSeoMeta({
  title: "U.S. Prosecutor Database | Prosecutorial Accountability",
  description:
    "Open-source civic database tracking local, state, and federal U.S. prosecutors across all 50 states " +
    "— election messaging, charging trends, and mass incarceration indicators.",
  ogUrl: origin + "/",
});

onMounted(async () => {
  prosecutors.value = await fetchProsecutors();
  loading.value = false;
});

// Derive unique sorted role & state lists from data
const roles = computed(() => {
  const set = new Set(prosecutors.value.map(p => p.role).filter(Boolean));
  return ["All", ...Array.from(set).sort()];
});

const states = computed(() => {
  const set = new Set(prosecutors.value.map(p => p.state).filter(Boolean));
  return ["All", ...Array.from(set).sort()];
});

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return prosecutors.value.filter(p => {
    const matchRole  = roleFilter.value  === "All" || p.role  === roleFilter.value;
    const matchState = stateFilter.value === "All" || p.state === stateFilter.value;
    const matchSearch = !q ||
      p.name?.toLowerCase().includes(q) ||
      p.jurisdiction?.toLowerCase().includes(q) ||
      p.office?.toLowerCase().includes(q);
    return matchRole && matchState && matchSearch;
  });
});

function resetFilters() {
  search.value = "";
  roleFilter.value = "All";
  stateFilter.value = "All";
}

// Role → badge color key
const roleColor = {
  "U.S. Attorney":    "badge-federal",
  "District Attorney":"badge-district",
  "Attorney General": "badge-ag",
};
function badgeClass(role) {
  return roleColor[role] || "badge-other";
}
</script>

<template>
  <div class="db-shell">

    <!-- ── HEADER ── -->
    <header class="db-header">
      <div class="header-inner">
        <div class="header-eyebrow">CIVIC ACCOUNTABILITY PROJECT</div>
        <h1 class="header-title">U.S. Prosecutor<br>Database</h1>
        <p class="header-sub">
          Tracking local, state & federal prosecutors across all 50 states.
          Prosecutorial oversight starts here.
        </p>
        <div class="header-stat">
          <span class="stat-num" v-if="!loading">{{ prosecutors.length.toLocaleString() }}</span>
          <span class="stat-num" v-else>—</span>
          <span class="stat-label">records indexed</span>
        </div>
      </div>
    </header>

    <!-- ── FILTER BAR ── -->
    <div class="filter-bar">
      <div class="filter-inner">

        <div class="filter-group filter-search">
          <label class="filter-label" for="search">SEARCH</label>
          <input
            id="search"
            v-model="search"
            class="filter-input"
            type="text"
            placeholder="Name, office, jurisdiction…"
            autocomplete="off"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label" for="role">ROLE</label>
          <select id="role" v-model="roleFilter" class="filter-select">
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label" for="state">STATE</label>
          <select id="state" v-model="stateFilter" class="filter-select">
            <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <button class="filter-reset" @click="resetFilters" title="Clear filters">
          ✕ Reset
        </button>

      </div>

      <div class="filter-count" v-if="!loading">
        Showing <strong>{{ filtered.length }}</strong> of {{ prosecutors.length }} records
      </div>
    </div>

    <!-- ── MAIN ── -->
    <main class="db-main">

      <p class="loading-msg" v-if="loading">Loading records…</p>

      <p class="empty-msg" v-else-if="filtered.length === 0">
        No records match your filters.
        <button class="link-btn" @click="resetFilters">Clear filters</button>
      </p>

      <div v-else class="card-grid">
        <RouterLink
          v-for="p in filtered"
          :key="p.id"
          :to="{ name: 'prosecutor', params: { id: p.id } }"
          class="card"
        >
          <div class="card-top">
            <span :class="['badge', badgeClass(p.role)]">{{ p.role || "Unknown" }}</span>
            <span class="card-state">{{ p.state }}</span>
          </div>

          <h2 class="card-name">{{ p.name }}</h2>

          <div class="card-detail">
            <span class="card-detail-label">JURISDICTION</span>
            <span class="card-detail-val">{{ p.jurisdiction || p.county_or_region || "—" }}</span>
          </div>

          <div class="card-detail" v-if="p.office">
            <span class="card-detail-label">OFFICE</span>
            <span class="card-detail-val">{{ p.office }}</span>
          </div>

          <div class="card-footer">
            <span class="card-id">{{ p.id }}</span>
            <span class="card-arrow">→</span>
          </div>
        </RouterLink>
      </div>

    </main>

  </div>
</template>

<style scoped>
/* ── TOKENS ── */
.db-shell {
  --ink:       #0d0f14;
  --ink-mid:   #181c25;
  --ink-light: #242938;
  --border:    #2e3447;
  --amber:     #f0a500;
  --amber-dim: #a06d00;
  --text:      #e8eaf0;
  --muted:     #7a8099;
  --federal:   #3a7bd5;
  --district:  #c0392b;
  --ag:        #27ae60;
  --other:     #8e44ad;

  font-family: "Georgia", "Times New Roman", serif;
  background: var(--ink);
  color: var(--text);
  min-height: 100vh;
}

/* ── HEADER ── */
.db-header {
  background: var(--ink);
  border-bottom: 2px solid var(--amber);
  padding: 3.5rem 2rem 2.5rem;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.header-eyebrow {
  font-family: "Courier New", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: var(--amber);
  margin-bottom: 0.75rem;
}
.header-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 1rem;
}
.header-sub {
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 0 1.5rem;
}
.header-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.stat-num {
  font-family: "Courier New", monospace;
  font-size: 2rem;
  color: var(--amber);
  font-weight: 700;
}
.stat-label {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── FILTER BAR ── */
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--ink-mid);
  border-bottom: 1px solid var(--border);
  padding: 1rem 2rem;
}
.filter-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.filter-search { flex: 1; min-width: 200px; }
.filter-label {
  font-family: "Courier New", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  color: var(--amber);
}
.filter-input,
.filter-select {
  background: var(--ink-light);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-family: "Georgia", serif;
  border-radius: 2px;
  outline: none;
  transition: border-color 0.15s;
}
.filter-input:focus,
.filter-select:focus {
  border-color: var(--amber);
}
.filter-select { cursor: pointer; }
.filter-reset {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 2px;
  transition: color 0.15s, border-color 0.15s;
  align-self: flex-end;
}
.filter-reset:hover { color: var(--amber); border-color: var(--amber); }
.filter-count {
  max-width: 1200px;
  margin: 0.6rem auto 0;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: var(--muted);
}
.filter-count strong { color: var(--text); }

/* ── MAIN ── */
.db-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.loading-msg,
.empty-msg {
  color: var(--muted);
  font-style: italic;
  text-align: center;
  padding: 4rem 0;
}
.link-btn {
  background: none;
  border: none;
  color: var(--amber);
  cursor: pointer;
  font-style: normal;
  text-decoration: underline;
  font-size: inherit;
}

/* ── CARD GRID ── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}
.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.4rem 1.5rem;
  background: var(--ink-mid);
  text-decoration: none;
  color: var(--text);
  transition: background 0.15s;
  cursor: pointer;
}
.card:hover {
  background: var(--ink-light);
}
.card:hover .card-name {
  color: var(--amber);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}
.badge {
  font-family: "Courier New", monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
}
.badge-federal  { background: rgba(58,123,213,0.2);  color: #6fa8ef; border: 1px solid rgba(58,123,213,0.4); }
.badge-district { background: rgba(192,57,43,0.2);   color: #e07060; border: 1px solid rgba(192,57,43,0.4); }
.badge-ag       { background: rgba(39,174,96,0.2);   color: #5dca86; border: 1px solid rgba(39,174,96,0.4); }
.badge-other    { background: rgba(142,68,173,0.2);  color: #b07cd6; border: 1px solid rgba(142,68,173,0.4); }

.card-state {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: 0.08em;
}
.card-name {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
  color: var(--text);
  transition: color 0.15s;
}
.card-detail {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.card-detail-label {
  font-family: "Courier New", monospace;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--amber-dim);
}
.card-detail-val {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.35;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}
.card-id {
  font-family: "Courier New", monospace;
  font-size: 0.6rem;
  color: var(--border);
  letter-spacing: 0.05em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}
.card-arrow {
  color: var(--amber);
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
}
.card:hover .card-arrow {
  opacity: 1;
  transform: translateX(3px);
}

/* ── RESPONSIVE ── */
@media (max-width: 600px) {
  .db-header { padding: 2rem 1rem 1.5rem; }
  .filter-bar { padding: 0.75rem 1rem; }
  .db-main    { padding: 1rem; }
  .card-grid  { grid-template-columns: 1fr; }
}
</style>