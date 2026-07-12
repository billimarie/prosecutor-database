<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { fetchSeatById, fetchProsecutorsBySeatId } from "../services/seats";
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

const router = useRouter();
const loading = ref(true);
const seat = ref(null);
const prosecutors = ref({ current: null, previous: [] });
const error = ref(null);

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// Calculate term length
const calculateTermLength = (startDate, endDate) => {
  if (!startDate) return 'Unknown';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let totalMonths = years * 12 + months;
  if (totalMonths < 0) totalMonths = 0;
  
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  
  if (y > 0 && m > 0) return `${y}y ${m}m`;
  if (y > 0) return `${y}y`;
  if (m > 0) return `${m}m`;
  return '< 1m';
};

// Aggregate trends across all prosecutors for this seat
const seatTrends = computed(() => {
  if (!seat.value || !seat.value.state) return [];
  
  // Get FIPS codes for the seat's jurisdiction
  // This would need to be enhanced based on your actual data structure
  return stateAverages[seat.value.state] || [];
});

// Current prosecutor trends
const currentProsecutorTrends = computed(() => {
  if (!prosecutors.value.current) return [];
  
  // This would need FIPS mapping based on the seat's jurisdiction
  // For now, returning empty - you can enhance this with actual data
  return [];
});

// Calculate aggregate statistics across all prosecutors
const aggregateStats = computed(() => {
  const all = [prosecutors.value.current, ...prosecutors.value.previous].filter(Boolean);
  if (all.length === 0) return null;
  
  const totalTerms = all.length;
  const avgTermLength = all.reduce((acc, p) => {
    const start = p.term_start || p.start_date;
    const end = p.term_end || p.end_date;
    if (!start) return acc;
    
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    return acc + (months > 0 ? months : 0);
  }, 0) / totalTerms;
  
  return {
    totalProsecutors: totalTerms,
    averageTermLength: `${Math.round(avgTermLength / 12 * 10) / 10} years`,
    dataPoints: all.filter(p => p.relevant_cases && p.relevant_cases.length > 0).length,
  };
});

onMounted(async () => {
  try {
    // Fetch seat information
    seat.value = await fetchSeatById(props.id);
    if (!seat.value) {
      error.value = "Seat record not found.";
    } else {
      // Fetch all prosecutors for this seat
      prosecutors.value = await fetchProsecutorsBySeatId(props.id);
      
      // If no seat found but prosecutors exist, create seat info from prosecutor data
      if (!seat.value && prosecutors.value.current) {
        const p = prosecutors.value.current;
        seat.value = {
          id: props.id,
          state: p.state,
          county_or_region: p.county_or_region,
          jurisdiction: p.jurisdiction,
          fips_codes: p.fips_codes,
        };
      }
    }
  } catch (e) {
    console.error("Error loading seat data:", e);
    error.value = "Failed to load seat record. Please try again.";
  } finally {
    loading.value = false;
  }
});

const navigateToProsecutor = (prosecutorId) => {
  router.push({ name: 'prosecutor', params: { id: prosecutorId } });
};
</script>

<template>
  <main class="container">
    <RouterLink :to="{ name: 'home' }" class="back-link">← Back to all prosecutors</RouterLink>

    <p v-if="loading">Loading seat record...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <article v-else class="seat-profile panel">
      <!-- Seat Header -->
      <header class="seat-header">
        <div class="seat-badge">
          <span class="badge badge-seat">SEAT</span>
        </div>
        <h1>{{ seat?.jurisdiction || `${seat?.county_or_region}, ${seat?.state}` }}</h1>
        <p class="seat-meta">
          {{ seat?.state }} · {{ seat?.county_or_region }}
          <span v-if="seat?.fips_codes && seat.fips_codes.length > 0" class="fips-info">
            · FIPS: {{ seat.fips_codes.join(', ') }}
          </span>
        </p>
      </header>

      <!-- Aggregate Statistics -->
      <section v-if="aggregateStats" class="profile-section stats-section">
        <h2>Seat Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ aggregateStats.totalProsecutors }}</div>
            <div class="stat-label">Total Prosecutors</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ aggregateStats.averageTermLength }}</div>
            <div class="stat-label">Avg. Term Length</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ aggregateStats.dataPoints }}</div>
            <div class="stat-label">With Case Data</div>
          </div>
        </div>
      </section>

      <!-- Current Prosecutor -->
      <section v-if="prosecutors.current" class="profile-section current-section">
        <h2>Current Prosecutor</h2>
        <div class="prosecutor-card highlight-card" @click="navigateToProsecutor(prosecutors.current.id)">
          <div class="prosecutor-header">
            <div class="current-badge">CURRENT</div>
            <h3 class="prosecutor-name">{{ prosecutors.current.name }}</h3>
          </div>
          <p class="prosecutor-meta">{{ prosecutors.current.role }} · {{ prosecutors.current.office }}</p>
          
          <div class="term-info">
            <div class="term-dates">
              <span class="label">Term Start:</span>
              <span class="value">{{ formatDate(prosecutors.current.term_start || prosecutors.current.start_date) }}</span>
            </div>
            <div class="term-length">
              <span class="label">Duration:</span>
              <span class="value">{{ calculateTermLength(prosecutors.current.term_start || prosecutors.current.start_date, null) }}</span>
            </div>
          </div>

          <div v-if="prosecutors.current.campaign_theme" class="campaign-theme">
            <strong>Campaign Theme:</strong> {{ prosecutors.current.campaign_theme }}
          </div>

          <button class="view-profile-btn">View Full Profile →</button>
        </div>
      </section>

      <!-- Previous Prosecutors Timeline -->
      <section v-if="prosecutors.previous && prosecutors.previous.length > 0" class="profile-section timeline-section">
        <h2>Previous Prosecutors</h2>
        <div class="timeline">
          <div
            v-for="(prev, index) in prosecutors.previous"
            :key="index"
            class="timeline-item"
            @click="navigateToProsecutor(prev.id)"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content prosecutor-card">
              <div class="prosecutor-header">
                <h3 class="prosecutor-name">{{ prev.name }}</h3>
                <span class="term-end-date">{{ formatDate(prev.term_end || prev.end_date) }}</span>
              </div>
              <p class="prosecutor-meta">{{ prev.role }} · {{ prev.office }}</p>
              
              <div class="term-info">
                <div class="term-dates">
                  <span class="label">Term:</span>
                  <span class="value">
                    {{ formatDate(prev.term_start || prev.start_date) }} — {{ formatDate(prev.term_end || prev.end_date) }}
                  </span>
                </div>
                <div class="term-length">
                  <span class="label">Duration:</span>
                  <span class="value">
                    {{ calculateTermLength(prev.term_start || prev.start_date, prev.term_end || prev.end_date) }}
                  </span>
                </div>
              </div>

              <div v-if="prev.notes" class="prev-notes">
                {{ prev.notes }}
              </div>

              <div v-if="prev.relevant_cases && prev.relevant_cases.length > 0" class="cases-preview">
                <strong>Cases:</strong> {{ prev.relevant_cases.length }} recorded
              </div>

              <button class="view-profile-btn">View Profile →</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Incarceration Trends Section -->
      <section v-if="seatTrends.length" class="profile-section">
        <h2>Incarceration Trends (2002–2022)</h2>
        <div class="chart-wrapper">
          <TrendsChart :data="seatTrends" :state-data="seatTrends" />
          <p class="chart-caption">
            Incarceration rate per 100,000 residents for {{ seat?.jurisdiction }}. 
            Data represents jurisdictional trends across all prosecutors.
          </p>
        </div>
      </section>

      <!-- Notes Section -->
      <section v-if="seat?.notes" class="profile-section">
        <h2>Seat Notes</h2>
        <p class="hint">{{ seat.notes }}</p>
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

.seat-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.seat-badge {
  margin-bottom: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-seat {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.seat-header h1 {
  font-size: 2rem;
  margin: 0.5rem 0;
  color: #1a1a1a;
}

.seat-meta {
  color: #666;
  font-size: 1rem;
}

.fips-info {
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  color: #888;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Profile Sections */
.profile-section {
  margin-bottom: 2.5rem;
}

.profile-section h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

/* Prosecutor Cards */
.prosecutor-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.prosecutor-card:hover {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.highlight-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: #3b82f6;
}

.prosecutor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.current-badge {
  background: #dcfce7;
  color: #166534;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prosecutor-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.prosecutor-meta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.term-info {
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.term-dates, .term-length {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.term-dates:last-child, .term-length:last-child {
  margin-bottom: 0;
}

.label {
  color: #888;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
}

.campaign-theme {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.prev-notes {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: white;
  border-left: 3px solid #ddd;
  border-radius: 0 4px 4px 0;
}

.cases-preview {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.view-profile-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.view-profile-btn:hover {
  background: #5568d3;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ddd;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.timeline-marker {
  position: absolute;
  left: -1.65rem;
  top: 1.5rem;
  width: 1rem;
  height: 1rem;
  background: white;
  border: 3px solid #667eea;
  border-radius: 50%;
  z-index: 1;
}

.timeline-item:hover .timeline-marker {
  background: #667eea;
}

.term-end-date {
  font-size: 0.8rem;
  color: #888;
  background: #eee;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  white-space: nowrap;
}

/* Chart */
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

.error {
  color: #c00;
  font-size: 1.1rem;
  padding: 1rem;
  background: #fee;
  border-radius: 4px;
}

.hint {
  color: #666;
  font-style: italic;
  line-height: 1.6;
}
</style>
