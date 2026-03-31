<script setup>
import { RouterLink } from "vue-router";
import AppFooter from "../components/AppFooter.vue";
</script>

<template>
  <div class="db-shell">
    <!-- ── HEADER ── -->
    <header class="db-header">
      <div class="header-inner">
        <div class="header-nav">
          <RouterLink :to="{ name: 'home' }" class="nav-link">← Database Home</RouterLink>
        </div>
        <div class="header-eyebrow">MISSION & HISTORY</div>
        <h1 class="header-title">About the U.S.<br>Prosecutor Database</h1>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="db-main">
      <article class="prose">
        
        <section class="section">
          <p class="lead">
            <strong>The United States Prosecutor Database</strong> is a growing community-led project dedicated 
            to tracking the attorneys who represent the government—and, ultimately, work for the people.
          </p>
          <p>
            In 46 states, prosecutors are elected—and <strong>85% run without opposition</strong>. 
            Because they are less visible than legislators or police, their outsized role in mass incarceration 
            has historically been overlooked. This project is a direct response to that gap.
          </p>
        </section>

        <section class="section">
          <h2>The Goal</h2>
          <p>
            Ending mass incarceration starts with <strong>Prosecutorial Oversight</strong>. 
            Our goal is to inspire mindful engagement from the public regarding prosecutor oversight, 
            elections, and cases. We believe that by demystifying the power of local, state, and federal 
            prosecutors, we can help people vote based on data rather than campaign slogans.
          </p>
        </section>

        <section class="section quote-section">
          <blockquote class="blockquote">
            "The probability that a prosecutor would file felony charges against an arrestee basically 
            <strong>doubled</strong>... and that change pushed prison populations up even as crime dropped."
            <cite>— John Pfaff, Author of <em>Locked In</em></cite>
          </blockquote>
        </section>

        <section class="section">
          <h2>Why Prosecutors?</h2>
          <ul class="stats-list">
            <li>
              <span class="stat-value">97%</span>
              <span class="stat-desc">of incarcerated people are held in <strong>state prisons</strong>—not private facilities.</span>
            </li>
            <li>
              <span class="stat-value">95%</span>
              <span class="stat-desc">of cases end in plea bargains negotiated behind closed doors.</span>
            </li>
            <li>
              <span class="stat-value">2x</span>
              <span class="stat-desc">The increased probability of filing felony charges since the 1990s, despite falling crime rates.</span>
            </li>
          </ul>
        </section>

        <section class="section">
          <h2>Our History</h2>
          <p>
            This project grew out of <strong>CLASP</strong> (the Community Legal & Advocacy Services Project), 
            a nonprofit prisoners' rights initiative. It was inspired by the legendary Angela Davis's 
            <em>Arbitrary Justice: The Power of the American Prosecutor</em>.
          </p>
          <p>
            What began as a small effort to compile basic information about officeholders quickly revealed 
            a severe lack of public datasets. Volunteers stepped in, manual data mining began, and the 
            project eventually grew into an open-source collective effort on GitHub.
          </p>
          <p>
            We are committed to transparency and public oversight, especially given the legal protections 
            that often shield prosecutors from accountability (e.g., the Federal Tort Claims Act). 
            By making this information accessible, we hope to empower voters and advocates alike.
          </p>
          <p>
            The U.S. Prosecutor Database is a work in progress, and we welcome contributions from anyone interested in 
            helping to expand and improve it. If you have data, insights, or ideas to share, please reach out or check out our <a href="https://github.com/billimarie/prosecutor-database">GitHub repository</a>.
          </p>
        </section>

        <section class="section glossary-section">
          <h2>Glossary</h2>
          <dl class="glossary-list">
            <div>
              <dt>Nolle Prosequi</dt>
              <dd>A formal notice by a prosecutor that they are dropping a case or certain charges ("be unwilling to pursue").</dd>
            </div>
            <div>
              <dt>Federal Tort Claims Act (FTCA)</dt>
              <dd>A statute that often shields prosecutors from civil lawsuits for misconduct, making transparency and public oversight all the more critical.</dd>
            </div>
          </dl>
        </section>

      </article>
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
  
  font-family: "Georgia", serif;
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
  max-width: 800px;
  margin: 0 auto;
}
.header-nav {
  margin-bottom: 2rem;
}
.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: "Courier New", monospace;
  transition: color 0.15s;
}
.nav-link:hover {
  color: var(--amber);
}
.header-eyebrow {
  font-family: "Courier New", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: var(--amber);
  margin-bottom: 1rem;
}
.header-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

/* ── MAIN ── */
.db-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.prose section {
  margin-bottom: 4rem;
}

.prose h2 {
  font-family: "Courier New", monospace;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}

.prose p {
  line-height: 1.7;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #cfd4df;
}

.lead {
  font-size: 1.3rem !important;
  color: var(--text) !important;
}

/* ── QUOTE ── */
.quote-section {
  padding: 2rem 0;
  border-left: 4px solid var(--amber);
  padding-left: 2rem;
}
.blockquote {
  margin: 0;
  font-style: italic;
  font-size: 1.4rem;
  line-height: 1.5;
  color: var(--text);
}
.blockquote cite {
  display: block;
  margin-top: 1rem;
  font-style: normal;
  font-size: 0.9rem;
  font-family: "Courier New", monospace;
  color: var(--muted);
}

/* ── STATS ── */
.stats-list {
  list-style: none;
  padding: 0;
}
.stats-list li {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--ink-mid);
  border: 1px solid var(--border);
}
.stat-value {
  font-family: "Courier New", monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--amber);
  line-height: 1;
}
.stat-desc {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--muted);
}

/* ── GLOSSARY ── */
.glossary-list dt {
  font-family: "Courier New", monospace;
  font-weight: 700;
  color: var(--amber);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.glossary-list dd {
  margin: 0 0 2rem 0;
  line-height: 1.6;
  color: var(--muted);
}

@media (max-width: 600px) {
  .db-main { padding: 2rem 1.5rem; }
  .stats-list li { flex-direction: column; gap: 0.5rem; }
  .stat-value { font-size: 2rem; }
}
</style>
