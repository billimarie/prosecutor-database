/**
 * useSeoMeta.js - Vue 3 composable for dynamic SEO metadata management.
 * Resolves issue #135: [FEATURE] SEO
 * https://github.com/billimarie/prosecutor-database/issues/135
 */

function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return 'https://us-prosecutor-database.netlify.app';
}

function getDefaultImage() {
  return getBaseUrl() + '/og-image.svg';
}

/**
 * Updates document.title and key meta/link tags in document.head.
 * @param {object} options
 * @param {string}  options.title          Page title.
 * @param {string}  options.description    Meta description.
 * @param {string} [options.ogTitle]       og:title override.
 * @param {string} [options.ogDescription] og:description override.
 * @param {string} [options.ogUrl]         Canonical URL.
 * @param {string} [options.ogImage]       Social share image.
 */
export function useSeoMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage = getDefaultImage(),
} = {}) {
  if (title) document.title = title;

  function setMeta(selector, attrPair, value) {
    if (value == null || value === '') return;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const eqIdx = attrPair.indexOf('=');
      const attrName = attrPair.slice(0, eqIdx).trim();
      const attrValue = attrPair.slice(eqIdx + 1).replace(/"/g, '').trim();
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function setLink(rel, href) {
    if (!href) return;
    let el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  setMeta('meta[name="description"]',       'name="description"',       description);
  setMeta('meta[property="og:title"]',       'property="og:title"',       ogTitle || title);
  setMeta('meta[property="og:description"]', 'property="og:description"', ogDescription || description);
  setMeta('meta[property="og:url"]',         'property="og:url"',         ogUrl);
  setMeta('meta[property="og:image"]',       'property="og:image"',       ogImage);
  setMeta('meta[name="twitter:title"]',       'name="twitter:title"',       ogTitle || title);
  setMeta('meta[name="twitter:description"]', 'name="twitter:description"', ogDescription || description);
  setMeta('meta[name="twitter:image"]',       'name="twitter:image"',       ogImage);
  setLink('canonical', ogUrl || getBaseUrl() + '/');
}
