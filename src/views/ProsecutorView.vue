<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { fetchProsecutorById } from "../services/prosecutors";
import { useSeoMeta } from "../composables/useSeoMeta";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const prosecutor = ref(null);
const error = ref(null);

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

// Apply dynamic SEO meta once prosecutor data is loaded.
watch(prosecutor, (p) => {
  if (!p) return;
  const name  = p.name || "Unknown Prosecutor";
  const role  = p.role || p.office || "Prosecutor";
  const state = p.state || "";
  const juris = p.jurisdiction || p.county_or_region || "";
  const locParts = [juris, state].filter(Boolean).join(", ");
  const title = `${name} | U.S. Prosecutor Database`;
  const desc  = [
    `${name} is a ${role}${locParts ? " in " + locParts : ""}.`,
    p.campaign_theme ? `Campaign theme: ${p.campaign_theme}.` : null,
    p.notes          ? p.notes.slice(0, 120)                   : null,
    "U.S. Prosecutor Database tracks prosecutorial accountability across all 50 states.",
  ].filter(Boolean).join(" ");

  useSeoMeta({
    title,
    description: desc,
    ogUrl: `https://us-prosecutor-database.netlify.app/prosecutor/` + p.id,
  });
}, { immediate: true });
</script>

<template>
  <main class="container">
    <RouterLink :to="{ name: 'home' }" class="back-link">← Back to all prosecutors</RouterLink>

    <p v-if="loading">Loading record...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <article v-else class="profile panel">
      <header class="profile-header">
        <h1>{{ prosecutor.name }}</h1>
        <p class="profile-meta">{{ prosecutor.role }} &middot; {{ prosecutor.office }}</p>
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

      <section v-if="prosecutor.notes" class="profile-section">
        <h2>Notes</h2>
        <p class="hint">{{ prosecutor.notes }}</p>
      </section>
    </article>
  </main>
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

.profile-meta {
  color: #666;
  font-size: 0.95rem;
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
</style>
