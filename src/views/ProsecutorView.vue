<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { fetchProsecutorById } from "../services/prosecutors";
import AppFooter from "../components/AppFooter.vue";
import TrendsChart from "../components/TrendsChart.vue";
import trendsData from "../data/incarcerationTrends.json";
import stateAverages from "../data/stateAverages.json";
import { getOutlierStatus } from "../utils/outlier";
import * as d3 from "d3";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const prosecutor = ref(null);
const error = ref(null);

// Computed property to check if relevant cases exist
const hasRelevantCases = computed(() => {
  return prosecutor.value?.relevant_cases && prosecutor.value.relevant_cases.length > 0;
});

// FIPS Mapping for initial fallback data
const fipsMap = {
  "ga-ocmulgee-harold-mclendon-2024": ["13175", "13167", "13289", "13283"],
  "pa-lebanon-michael-light-2025":    ["42075"],
  "ms-desoto-matthew-barton-2022":    ["28033"],
};

const prosecutorTrends = computed(() => {
  if (!prosecutor.value) return [];
  const fipsList = fipsMap[prosecutor.value.id] || [];
  
  const data = fipsList.map(fips => trendsData[fips] || []).flat();
  if (!data.length) return [];

  const yearly = d3.groups(data, d => d.year).map(([year, values]) => ({
    year,
    jail: d3.mean(values, v => v.jail),
    prison: d3.mean(values, v => v.prison),
  }));

  return yearly.sort((a, b) => a.year - b.year);
});

const stateTrends = computed(() => {
  if (!prosecutor.value || !prosecutor.value.state) return [];
  return stateAverages[prosecutor.value.state] || [];
});

const outlierStatus = computed(() => {
  return getOutlierStatus(prosecutor.value);
});

onMounted(async () => {
  try {
    prosecutor.value = await fetchProsecutorById(props.id);
    if (!prosecutor.value) error.value = "Prosecutor record not found.";
  } catch (e) {
    error.value = "Failed to load record. Please try again.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="container">
    <RouterLink :to="{ name: 'home' }" class="back-link">← Back to all prosecutors</RouterLink>

    <p v-if="loading">Loading record...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <article v-else class="profile panel">
      <header class="profile-header">
        <div v-if="prosecutor.featured_image" class="featured-image-container">
          <img 
            :src="prosecutor.featured_image" 
            :alt="`${prosecutor.name} - Featured Image`"
            class="featured-image"
          />
          <p v-if="prosecutor.image_caption" class="image-caption">{{ prosecutor.image_caption }}</p>
        </div>
        <div class="header-with-badge">
          <h1>{{ prosecutor.name }}</h1>
          <span v-if="outlierStatus" :class="['badge', `badge-${outlierStatus.type}`]">
            {{ outlierStatus.label }}
          </span>
        </div>
        <p class="profile-meta">{{ prosecutor.role }} · {{ prosecutor.office }}</p>
      </header>

      <section class="profile-section">
        <h2>Jurisdiction</h2>
        <dl>
          <dt>State</dt>
          <dd>{{ prosecutor.state || "—" }}</dd>

          <dt>County / Region</dt>
          <dd>{{ prosecutor.county_or_region || "—" }}</dd>

          <dt>Jurisdiction</dt>
          <dd>{{ prosecutor.jurisdiction || "—" }}</dd>
        </dl>
      </section>

      <!-- Relevant Cases Section -->
      <section v-if="hasRelevantCases" class="profile-section">
        <h2>Relevant Cases</h2>
        <div class="cases-list">
          <div
            v-for="(caseItem, index) in prosecutor.relevant_cases"
            :key="index"
            class="case-card"
          >
            <div class="case-header">
              <h3 class="case-title">{{ caseItem.title }}</h3>
              <span v-if="caseItem.year" class="case-year">{{ caseItem.year }}</span>
            </div>
            <p v-if="caseItem.description" class="case-description">{{ caseItem.description }}</p>
            <div v-if="caseItem.outcome" class="case-outcome">
              <strong>Outcome:</strong> {{ caseItem.outcome }}
            </div>
            <div v-if="caseItem.source" class="case-source">
              <a :href="caseItem.source" target="_blank" rel="noopener" class="case-link">
                View Source
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="profile-section">
        <h2>Contact</h2>
        <dl>
          <dt>Website</dt>
          <dd>
            <a v-if="prosecutor.website" :href="prosecutor.website" target="_blank" rel="noopener">
              {{ prosecutor.website }}
            </a>
            <span v-else>—</span>
          </dd>

          <dt>Email</dt>
          <dd>
            <a v-if="prosecutor.email" :href="`mailto:${prosecutor.email}`">
              {{ prosecutor.email }}
            </a>
            <span v-else>—</span>
          </dd>

          <dt>Phone</dt>
          <dd>{{ prosecutor.phone || "—" }}</dd>
        </dl>
      </section>

      <section v-if="prosecutor.campaign_theme" class="profile-section">
        <h2>Campaign</h2>
        <dl>
          <dt>Theme</dt>
          <dd>{{ prosecutor.campaign_theme }}</dd>

          <dt>Small-Town Focus</dt>
          <dd>{{ prosecutor.small_town_focus ? "Yes" : "No" }}</dd>
        </dl>
      </section>

      <!-- Incarceration Trends Section -->
      <section v-if="prosecutorTrends.length" class="profile-section">
        <h2>Incarceration Trends (2002–2022)</h2>
        <div class="chart-wrapper">
          <TrendsChart :data="prosecutorTrends" :state-data="stateTrends" />
          <p class="chart-caption">
            Incarceration rate per 100,000 residents for {{ prosecutor.jurisdiction }}. 
            Dashed line represents state-wide average for {{ prosecutor.state }}.
          </p>
        </div>
      </section>

      <section v-if="prosecutor.notes" class="profile-section">
        <h2>Notes</h2>
        <p class="hint">{{ prosecutor.notes }}</p>
      </section>
    </article>
  </main>
  <AppFooter />
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.profile-header {
  margin-bottom: 1.5rem;
}

.header-with-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-high {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #f87171;
}
.badge-low {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #4ade80;
}

.profile-meta {
  color: #666;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-section h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.25rem;
}

dl {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 0.4rem 1rem;
}

dt {
  font-weight: 600;
  color: #555;
}

dd {
  margin: 0;
}

.error {
  color: #c00;
}

.featured-image-container {
  margin-bottom: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.featured-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.image-caption {
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
  padding: 0.5rem 1rem;
  margin: 0;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.cases-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.case-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.case-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.case-year {
  font-size: 0.8rem;
  color: #888;
  background: #eee;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  white-space: nowrap;
}

.case-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  margin: 0.5rem 0;
}

.case-outcome {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

.case-source {
  margin-top: 0.5rem;
}

.case-link {
  font-size: 0.85rem;
  color: #0066cc;
  text-decoration: none;
}

.chart-wrapper {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #181c25;
  border: 1px solid #2e3447;
  border-radius: 4px;
}

.chart-caption {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  color: #7a8099;
  margin-top: 1rem;
  line-height: 1.5;
  text-align: center;
}
</style>