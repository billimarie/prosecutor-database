<script setup>
import { onMounted, ref } from "vue";
import { fetchProsecutors } from "./services/prosecutors";

const loading = ref(true);
const prosecutors = ref([]);

onMounted(async () => {
  prosecutors.value = await fetchProsecutors();
  loading.value = false;
});
</script>

<template>
  <main class="container">
    <header class="header">
      <h1>U.S. Prosecutor Accountability Database</h1>
      <p>
        Source-backed civic data project tracking prosecutor campaign messaging,
        incarceration indicators, and historical context.
      </p>
    </header>

    <section class="panel">
      <h2>Research Leads</h2>
      <p class="hint">
        Agentic AI note: This list is evidence-first and non-defamatory by design. Every claim
        must be tied to a public source.
      </p>
      <p v-if="loading">Loading records...</p>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Office</th>
              <th>Jurisdiction</th>
              <th>Campaign Theme</th>
              <th>Small-Town Focus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prosecutor in prosecutors" :key="prosecutor.id">
              <td>{{ prosecutor.name }}</td>
              <td>{{ prosecutor.office }}</td>
              <td>{{ prosecutor.jurisdiction }}, {{ prosecutor.state }}</td>
              <td>{{ prosecutor.campaign_theme }}</td>
              <td>{{ prosecutor.small_town_focus ? "Yes" : "No" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
