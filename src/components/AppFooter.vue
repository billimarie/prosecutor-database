<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        
        <!-- About / Credits -->
        <div class="footer-section">
          <h4 class="footer-heading">USPD</h4>
          <p class="footer-text">
            <strong>The United States Prosecutor Database</strong><br>
            Copyright &copy; 2017 - {{ currentYear }} U.S. Prosecutor Database
          </p>
          <p class="footer-text muted">
            Independent, open-source prosecutor oversight database. 
            Licensed under GNU GPLv3.
          </p>
        </div>

        <!-- Contribute -->
        <div class="footer-section">
          <h4 class="footer-heading">CONTRIBUTE</h4>
          <p class="footer-text">
            Help us gather data for all District & State Attorneys. 
            <a href="https://github.com/billimarie/prosecutor-database" target="_blank" rel="noopener">Follow the instructions</a> on our repo to start contributing.
          </p>
        </div>

        <!-- Navigation -->
        <div class="footer-section">
          <h4 class="footer-heading">RESOURCES</h4>
          <ul class="footer-links">
            <li><router-link :to="{ name: 'home' }">Home</router-link></li>
            <li><router-link :to="{ name: 'home' }">Attorney General</router-link></li>
            <li><router-link :to="{ name: 'home' }">U.S. Attorney</router-link></li>
            <li><router-link :to="{ name: 'home' }">District Attorney</router-link></li>
          </ul>
        </div>

        <!-- Menu -->
        <div class="footer-section">
          <h4 class="footer-heading">CONNECT</h4>
          <ul class="footer-links">
            <li><router-link :to="{ name: 'home' }">Home</router-link></li>
            <li><router-link :to="{ name: 'about' }">About & Glossary</router-link></li>
            <li><a href="https://github.com/billimarie/prosecutor-database" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="https://twitter.com/USProsecutorDB" target="_blank" rel="noopener">@USProsecutorDB</a></li>
            <li><a href="#" rel="noopener">Mailing List</a></li>
          </ul>
        </div>

      </div>
      
      <div class="footer-bottom">
        <p>Built with Vue 3, Vite, and Firebase.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--ink-mid, #181c25);
  border-top: 1px solid var(--border, #2e3447);
  padding: 4rem 2rem;
  color: var(--text, #e8eaf0);
  margin-top: 4rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-heading {
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--amber, #f0a500);
  margin: 0 0 1.25rem;
  text-transform: uppercase;
}

.footer-text {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1rem;
}

.footer-text.muted {
  color: var(--muted, #7a8099);
  font-size: 0.8rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--muted, #7a8099);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: var(--amber, #f0a500);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--border, #2e3447);
  text-align: center;
  font-family: "Courier New", monospace;
  font-size: 0.7rem;
  color: var(--border, #2e3447);
}

@media (max-width: 600px) {
  .app-footer { padding: 3rem 1.5rem; }
  .footer-grid { gap: 2rem; }
}
</style>
