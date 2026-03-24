# DOCS
> Last Updated: March 24, 2026

This document is optimized for contributors and AI agents that collect prosecutor accountability data.

## The U.S. Prosecutor Database exists because the data didn't.
 
This project grew out of CLASP (the Community Legal & Advocacy Services Project), a now-defunct nonprofit prisoners' rights initiative, and was inspired by Angela Davis's *[Arbitrary Justice: The Power of the American Prosecutor](https://www.amazon.com/Arbitrary-Justice-Power-American-Prosecutor/dp/0195384733)*.

What began as a small effort to compile basic information about current and former prosecutors quickly revealed a deeper problem: no comprehensive, public dataset existed. Volunteers stepped in. Manual data mining began. Eventually, contributors found the project on GitHub and the database grew into an open-source collective effort.
 
John Pfaff, author of *Locked In*, identifies the core reason prosecutors escape scrutiny: **there is no data on them.** Because prosecutors are less visible than legislators or police, advocates have historically overlooked their outsized role in mass incarceration. This project is a direct response to that gap.
 
### Why Prosecutors
 
A few statistics frame the urgency:
 
- 97% of incarcerated people are held in **state prisons** — not private facilities.
- In 46 states, prosecutors are **elected** — and 85% run **without opposition**.
- Since the 1990s, violent crime and arrests for violent crime have declined — yet felony cases filed in state courts have climbed sharply. As Pfaff documents, the probability of a prosecutor filing felony charges against an arrestee roughly doubled, driving prison populations up even as crime dropped.
- **95% of cases** end in plea bargains negotiated behind closed doors.
- Tens of thousands of new prosecutors were hired in the decades after crime stopped rising.
 
### The Goal
 
Ending mass incarceration starts with prosecutorial oversight.
 
This database is one attempt to demystify the power of local, state, and federal prosecutors — to surface the people making charging decisions that shape millions of lives. The goal is to give the public the information it needs to vote based on prosecutorial records rather than campaign slogans, and to help shift the tide toward a post-carceral world.

### Core Principles (AI written)

1. Favor small-town visibility: prioritize counties and circuits with limited oversight coverage.
2. Evidence-first: every non-trivial claim needs at least one source URL.
3. No defamation: do not label a person as "corrupt" without verified legal findings.
4. Track rhetoric vs outcomes: campaign statements should be compared to public justice metrics.

### Technical Stack

- Frontend: `Vue 3` + `Vite`
- Backend/data: `Firebase Firestore`
- Hosting: `Netlify`

Collection used by app:

- `prosecutors`

### Firestore Record Shape

Use this canonical JSON shape:

```json
{
  "id": "ga-ocmulgee-harold-mclendon-2024",
  "name": "Harold McLendon",
  "office": "District Attorney",
  "jurisdiction": "Ocmulgee Judicial Circuit",
  "state": "GA",
  "county_or_region": "Laurens / Johnson / Twiggs / Treutlen",
  "small_town_focus": true,
  "campaign_theme": "Tough-on-crime rhetoric",
  "incarceration_signal": "County jail rate trend increased between X and Y years.",
  "source_urls": [
    "https://example.org/source-1",
    "https://example.org/source-2"
  ],
  "notes": "Short caveats and context.",
  "last_verified_at": "2026-03-24T00:00:00.000Z"
}
```

### AI-Agent Collection Workflow

Use this workflow for each prosecutor entry:

1. Discover candidate officeholders/candidates
   - Start with local election pages, county prosecutor office pages, and local journalism.
2. Capture campaign language
   - Pull direct quotes or slogan text (include source URL).
3. Pull incarceration context
   - County-level trend references from sources like Vera Incarceration Trends and state dashboards.
4. Write neutral interpretation
   - Record observed mismatch risk, not moral conclusions.
5. Save with provenance
   - Include retrieval timestamp and at least one source URL per major field.

### Suggested Source Priority

Highest confidence to lowest:

1. Official county/state election records
2. Official prosecutor office statements
3. Reputable local/state journalism
4. Nonpartisan policy datasets (Vera, BJS, state criminal justice dashboards)
5. Campaign websites and social posts (usable but should be corroborated)

### Starter Research Leads (Small-Town Focus)

Initial lead records are in:

- `src/data/fallbackProsecutors.js`

Current example sources used:

- [13WMAZ campaign coverage](https://www.13wmaz.com/article/news/local/harold-mclendon-campaigned-tough-crime-district-attorney/93-65423929-a1cb-4a43-b067-1a676a8961ab)
- [Michael Light campaign site](https://www.michaellightfordistrictattorney.com/)
- [DeSoto Times election article](https://www.desototimes.com/elections/matthew-barton-announces-campaign-for-desoto-county-district-attorney/article_21d412c0-7b0e-11ed-b99b-2baf9fb1680c.html)
- [Vera Incarceration Trends](https://trends.vera.org/)

Treat these as leads requiring ongoing verification, not final adjudications.

### Local Development

1. `npm install`
2. Copy `.env.example` to `.env`
3. Fill Firebase values
4. `npm run dev`

Optional:

- `npm run seed:local` to export fallback leads into `data/prosecutors.seed.json`

### Seeding From Google Sheets CSV

Because Google Sheets access can be restricted from server-side tools, export the
desired tab as CSV and seed locally.

1. In Google Sheets: `File` -> `Download` -> `Comma-separated values (.csv)`
2. Put the file into `data/` (e.g. `data/uspd-basic-prosecutor-profile.csv`)
3. Run:
   - `npm run seed:firestore:csv -- --csv "data/uspd-basic-prosecutor-profile.csv" --collection prosecutors`

The importer will map common column names:

- `title` -> `name`
- `field_role` -> `role` (normalized where possible)
- `state` and `county`/`county_or_region` -> jurisdiction fields if present

Non-role fields are stored as placeholders because any campaign/incarceration interpretation must be verified with sources.

---
 
*"The probability that a prosecutor would file felony charges against an arrestee basically doubled — and that change pushed prison populations up even as crime dropped."*
— John Pfaff, *Locked In*