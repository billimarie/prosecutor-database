<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { fetchProsecutors } from "../services/prosecutors";
import AppFooter from "../components/AppFooter.vue";
import { getOutlierStatus } from "../utils/outlier";

const loading = ref(true);
const prosecutors = ref([]);

// --- filter state ---
const search     = ref("");
const selectedRoles = ref([]);
const selectedStates = ref([]);
const selectedParties = ref([]);
const selectedRaces = ref([]);
const ageRange = ref([18, 80]);
const filtersOpen = ref(false);
const openSections = ref({ role: true, party: true, race: false, age: true, state: false });

const roleOptions = [
  "Attorney General",
  "County Attorney",
  "District Attorney",
  "State Attorney",
  "State Attorney General",
  "U.S. Attorney",
  "US Attorney",
];

const stateOptions = [
  "AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY",
];

const partyOptions = ["Democrat", "Republican", "Other"];
const raceOptions = ["American Indian or Alaska Native", "Asian", "Black or African American", "Hispanic or Latino", "Native Hawaiian or Other Pacific Islander", "White", "Other"];

onMounted(async () => {
  prosecutors.value = await fetchProsecutors();
  loading.value = false;
});

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return prosecutors.value.filter(p => {
    const role = p.role || p.office || "";
    const party = p.political_party || p.party || "";
    const race = p.race_ethnicity || p.race || p.ethnicity || "";
    const age = Number(p.age);
    const normalizedRole = role.replace(/\./g, "").toLowerCase();
    const matchRole = selectedRoles.value.length === 0 || selectedRoles.value.some(value => {
      const normalizedValue = value.replace(/\./g, "").toLowerCase();
      return normalizedRole === normalizedValue || normalizedRole.startsWith(`${normalizedValue} `);
    });
    const matchState = selectedStates.value.length === 0 || selectedStates.value.includes(p.state);
    const matchParty = selectedParties.value.length === 0 || selectedParties.value.some(value => value === party || (value === "Other" && party && !partyOptions.slice(0, 2).includes(party)));
    const matchRace = selectedRaces.value.length === 0 || selectedRaces.value.some(value => value === race || (value === "Other" && race && !raceOptions.slice(0, -1).includes(race)));
    const matchAge = !Number.isFinite(age) || (age >= ageRange.value[0] && age <= ageRange.value[1]);
    const matchSearch = !q ||
      p.name?.toLowerCase().includes(q) ||
      p.jurisdiction?.toLowerCase().includes(q) ||
      p.office?.toLowerCase().includes(q);
    return matchRole && matchState && matchParty && matchRace && matchAge && matchSearch;
  });
});

function resetFilters() {
  search.value = "";
  selectedRoles.value = [];
  selectedStates.value = [];
  selectedParties.value = [];
  selectedRaces.value = [];
  ageRange.value = [18, 80];
}

function toggleSection(section) {
  openSections.value[section] = !openSections.value[section];
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

function outlierClass(prosecutor) {
  const status = getOutlierStatus(prosecutor);
  return status ? `outlier-${status.type}` : "";
}

function outlierLabel(prosecutor) {
  const status = getOutlierStatus(prosecutor);
  return status ? status.label : "";
}
</script>

<template>
  <div class="db-shell">

    <!-- ── HEADER ── -->
    <header class="db-header">
      <div class="header-inner">
        <nav class="header-secondary-nav">
          <RouterLink id="nav-about" :to="{ name: 'about' }" class="nav-secondary-link">About &amp; Glossary</RouterLink>
        </nav>
        <div class="header-eyebrow">CIVIC ACCOUNTABILITY PROJECT</div>
        <h1 class="header-title">U.S. Prosecutor<br>Database</h1>
        <p class="header-sub">
          Tracking local, state &amp; federal prosecutors across all 50 states.
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

        <button class="filter-trigger" type="button" :aria-expanded="filtersOpen" aria-controls="filter-panel" @click="filtersOpen = !filtersOpen">
          Filters <span aria-hidden="true">{{ filtersOpen ? "−" : "+" }}</span>
        </button>

        <button class="filter-reset" @click="resetFilters" title="Clear filters">Clear all</button>

      </div>

      <aside id="filter-panel" v-show="filtersOpen" class="filter-panel" aria-label="Filters">
        <div class="filter-panel-head"><button type="button" @click="resetFilters">Clear all</button></div>
        <section class="filter-section">
          <button type="button" class="filter-section-title" @click="toggleSection('role')" :aria-expanded="openSections.role">Role <span aria-hidden="true">{{ openSections.role ? "v" : ">" }}</span></button>
          <div v-show="openSections.role" class="filter-options"><label v-for="role in roleOptions" :key="role" class="check-option"><input v-model="selectedRoles" type="checkbox" :value="role"><span>{{ role }}</span></label></div>
        </section>
        <section class="filter-section">
          <button type="button" class="filter-section-title" @click="toggleSection('party')" :aria-expanded="openSections.party">Party affiliation <span aria-hidden="true">{{ openSections.party ? "v" : ">" }}</span></button>
          <div v-show="openSections.party" class="filter-options"><label v-for="party in partyOptions" :key="party" class="check-option"><input v-model="selectedParties" type="checkbox" :value="party"><span>{{ party }}</span></label></div>
        </section>
        <section class="filter-section">
          <button type="button" class="filter-section-title" @click="toggleSection('race')" :aria-expanded="openSections.race">Race / ethnicity <span aria-hidden="true">{{ openSections.race ? "v" : ">" }}</span></button>
          <div v-show="openSections.race" class="filter-options"><label v-for="race in raceOptions" :key="race" class="check-option"><input v-model="selectedRaces" type="checkbox" :value="race"><span>{{ race }}</span></label></div>
        </section>
        <section class="filter-section">
          <button type="button" class="filter-section-title" @click="toggleSection('age')" :aria-expanded="openSections.age">Age <span aria-hidden="true">{{ openSections.age ? "v" : ">" }}</span></button>
          <div v-show="openSections.age" class="age-options"><div class="age-values"><span>{{ ageRange[0] }}</span><span>{{ ageRange[1] }}</span></div><div class="age-sliders"><input v-model.number="ageRange[0]" type="range" min="18" max="80" :max="ageRange[1]" aria-label="Minimum age"><input v-model.number="ageRange[1]" type="range" min="18" max="80" :min="ageRange[0]" aria-label="Maximum age"></div></div>
        </section>
        <section class="filter-section">
          <button type="button" class="filter-section-title" @click="toggleSection('state')" :aria-expanded="openSections.state">State <span aria-hidden="true">{{ openSections.state ? "v" : ">" }}</span></button>
          <div v-show="openSections.state" class="state-options"><label v-for="state in stateOptions" :key="state" class="check-option"><input v-model="selectedStates" type="checkbox" :value="state"><span>{{ state }}</span></label></div>
        </section>
      </aside>

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
            <div class="card-badges">
              <span :class="['badge', badgeClass(p.role)]">{{ p.role || "Unknown" }}</span>
              <span v-if="outlierLabel(p)" :class="['badge', outlierClass(p)]">
                {{ outlierLabel(p) }}
              </span>
            </div>
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

    <AppFooter />

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

/* Secondary Nav */
.header-secondary-nav {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.nav-secondary-link {
  border: 2px solid var(--amber);
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 1rem;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.15s;
}
.nav-secondary-link:hover {
  color: var(--amber);
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
.filter-trigger {
  align-self: flex-end;
  background: var(--amber);
  border: 1px solid var(--amber);
  color: var(--ink);
  cursor: pointer;
  font-family: "Courier New", monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.55rem 0.85rem;
  text-transform: uppercase;
}
.filter-trigger span { margin-left: 0.4rem; }
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
.filter-panel {
  box-sizing: border-box;
  left: 58rem;
  margin: 0;
  position: absolute;
  top: calc(100% - 2rem);
  width: 280px;
  background: #f9f9f7;
  border: 1px solid #d7d7d2;
  color: #202124;
  font-family: Arial, sans-serif;
  max-height: min(72vh, 620px);
  overflow-y: auto;
  padding: 0 1.5rem;
}
.filter-panel-head {
  align-items: center;
  border-bottom: 1px solid #ddd;
  display: flex;
  font-size: 1.15rem;
  justify-content: space-between;
  padding: 0.7rem 0;
}
.filter-panel-head button {
  background: transparent;
  border: 1px solid #c9c9c5;
  border-radius: 2px;
  color: #777;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.3rem 0.55rem;
}
.filter-section { border-bottom: 1px solid #ddd; padding: 0.35rem 0; }
.filter-section-title {
  align-items: center;
  background: transparent;
  border: 0;
  color: #1f2023;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  justify-content: space-between;
  padding: 0.55rem 0;
  text-align: left;
  width: 100%;
}
.filter-options { display: grid; gap: 0.55rem; padding: 0.2rem 0 0.8rem; }
.check-option { align-items: center; color: #555; cursor: pointer; display: flex; font-size: 0.98rem; gap: 0.65rem; }
.check-option input { accent-color: #1677e8; height: 18px; margin: 0; width: 18px; }
.state-options { display: grid; gap: 0.55rem; grid-template-columns: 1fr; padding: 0.2rem 0 0.8rem; }
.age-options { padding: 0.2rem 0 0.8rem; }
.age-values { color: #777; display: flex; font-size: 0.85rem; justify-content: space-between; margin-bottom: 0.25rem; }
.age-sliders { display: grid; gap: 0.25rem; }
.age-sliders input { accent-color: #1677e8; cursor: pointer; margin: 0; width: 100%; }
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
.card-badges {
  display: flex;
  gap: 0.5rem;
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

.outlier-high {
  background: #991b1b;
  color: #fff;
  border: 1px solid #7f1d1d;
}

.outlier-low {
  background: #166534;
  color: #fff;
  border: 1px solid #14532d;
}

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
  .filter-panel { left: 0.75rem; max-width: calc(100vw - 1.5rem); padding: 0 1rem; }
}
</style>
