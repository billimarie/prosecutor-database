<img width="940" height="646" alt="{AED1A75A-2EFE-4A2A-9DBA-DBF890D07B98}" src="https://github.com/user-attachments/assets/ac2bc78e-5702-4d21-9ad7-03448fe642f2" />

# U.S. Prosecutor Database (Vue + Firebase)
> Updated for Agentic AI: March 24th, 2026

Modernized stack for accountability-focused prosecutor data:

- Frontend: `Vue 3` + `Vite`
- Data store: `Firebase Firestore`
- Hosting: `Netlify`
- Goal: source-backed prosecutor campaign + incarceration trend research

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create env file:
   - Copy `.env.example` to `.env`
   - Fill Firebase values from your Firebase project settings
3. Start local app:
   - `npm run dev`
4. Build production bundle:
   - `npm run build`

## Netlify Deployment

This repo includes `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback redirect to `index.html`

In Netlify, set environment variables for all `VITE_FIREBASE_*` keys.

## Data

- Firestore collection: `prosecutors`
- Local fallback seed: `src/data/fallbackProsecutors.js`
- Optional export script:
  - `npm run seed:local` writes `data/prosecutors.seed.json`

## Evidence and Safety Standard (AI written)

Records should avoid unverified accusations. Instead, track:

- what was said (campaign statements),
- what happened (charging/incarceration indicators),
- where the evidence came from (URL + retrieval date + quote).

See `DOCS.md` for schema and AI-agent scraping workflow.

## Contributors

**Interested in contributing to the web app?** You'll find dev notes in the [**DOCS.md**](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md).

<a href="https://github.com/billimarie" target="_blank"><img src="https://avatars1.githubusercontent.com/u/6895471?s=60&v=4" width="50px"></a> <a href="https://github.com/dbhatia247" target="_blank"><img src="https://avatars2.githubusercontent.com/u/28025453?s=60&v=4" width="50px"></a> <a href="https://github.com/maxxgl" target="_blank"><img src="https://avatars0.githubusercontent.com/u/20944914?s=60&v=4" width="50px"></a> <a href="https://github.com/taylor-brudos" target="_blank"><img src="https://avatars3.githubusercontent.com/u/39247698?s=60&v=4" width="50px"></a> <a href="https://github.com/ryanwardle" target="_blank"><img src="https://avatars2.githubusercontent.com/u/37915565?s=60&v=4" width="50px"></a> <a href="https://github.com/Thai56" target="_blank"><img src="https://avatars1.githubusercontent.com/u/16358617?s=60&v=4" width="50px"></a> <a href="https://github.com/wnorrad" target="_blank"><img src="https://avatars0.githubusercontent.com/u/29986200?s=60&v=4" width="50px"></a> <a href="https://github.com/rcalimlim" target="_blank"><img src="https://avatars0.githubusercontent.com/u/13503461?s=60&v=4" width="50px"></a> <a href="https://github.com/jeremyfiel" target="_blank"><img src="https://avatars3.githubusercontent.com/u/32110157?s=60&v=4" width="50px"></a> <a href="https://github.com/davidth4ever2" target="_blank"><img src="https://avatars3.githubusercontent.com/u/2314743?s=60&v=4" width="50px"></a> <a href="https://github.com/baconbones" target="_blank"><img src="https://avatars0.githubusercontent.com/u/40526815?s=60&v=4" width="50px"></a> <a href="https://github.com/MilesHamilton" target="_blank"><img src="https://avatars3.githubusercontent.com/u/46730797?s=60&v=4" width="50px"></a> <a href="https://github.com/Cybeeee" target="_blank"><img src="https://avatars1.githubusercontent.com/u/40544593?s=60&v=4" width="50px"></a> <a href="https://github.com/aminamos" target="_blank"><img src="https://avatars0.githubusercontent.com/u/26092352?s=120&v=4" width="50px"></a> <a href="https://github.com/VirtualVulture" target="_blank"><img src="https://avatars1.githubusercontent.com/u/17329142?s=88&v=4" width="50px"></a> <a href="https://github.com/emilyedalton" target="_blank"><img src="https://avatars2.githubusercontent.com/u/42655908?s=88&u=89b9dc741860701a302a79e1f69779caae643d0e&v=4" width="50px"></a> <a href="https://github.com/matthewgallo" target="_blank"><img src="https://avatars2.githubusercontent.com/u/10215203?s=88&u=342de932ab4cc7469eb92562d0e191dcdb6596ed&v=4" width="50px"></a> <a href="https://github.com/06b" target="_blank"><img src="https://avatars3.githubusercontent.com/u/1302542?s=460&u=2c6fda3da88e62ea04fb5baa7d2bd88a6f1794c1&v=4" width="50px" /></a> <a href="https://github.com/BlakeCampbells" target="_blank"><img src="https://avatars1.githubusercontent.com/u/6901655?s=460&u=a0e3506221f4ab5b27ba680d0fdeeeaa795b6fd9&v=4" width="50px" /></a> <a href="https://github.com/caseyryan22465" target="_blank"><img src="https://avatars3.githubusercontent.com/u/39289308?s=460&v=4" width="50px" /></a> <a href="https://github.com/a-s-ahmed" target="_blank"><img src="https://avatars1.githubusercontent.com/u/59892479?s=400&v=4" width="50px" /></a> <a href="https://github.com/hicks2evan" target="_blank"><img src="https://avatars1.githubusercontent.com/u/23247607?s=460&u=f431135eea1346df4155f63e3a026b68fd3e4f4c&v=4" width="50px" /></a> <a href="https://github.com/banjtheman" target="_blank"><img src="https://avatars1.githubusercontent.com/u/696254?s=400&u=488260c17dbe0bf857caa9f642c4b6d47b664df4&v=4" width="50px" /></a> <a href="https://github.com/mattkduran" target="_blank"><img src="https://avatars2.githubusercontent.com/u/19656092?s=460&v=4" width="50px" /></a> <a href="https://github.com/xingwang" target="_blank"><img src="https://avatars3.githubusercontent.com/u/744584?s=460&v=4" width="50px" /></a> <a href="https://github.com/baspalinckx" target="_blank"><img src="https://avatars2.githubusercontent.com/u/27728063?s=400&u=f1fc422bee245da952d88a98fe1ac9ec3eb60afb&v=4" width="50px" /></a> <a href="https://github.com/satanb4" target="_blank"><img src="https://avatars0.githubusercontent.com/u/26685910?s=400&u=54abb55fbc9d9c7c35e219a654d23eaa3d043495&v=4" width="50px" /></a> <a href="https://github.com/michaelknowles" target="_blank"><img src="https://avatars3.githubusercontent.com/u/738582?s=460&v=4" width="50px" /></a> <a href="https://github.com/treyarte" target="_blank"><img src="https://avatars1.githubusercontent.com/u/21246112?s=460&u=c695519d25c0c631ba1a2cac107e0a632b215c97&v=4" width="50px" /></a> <a href="https://github.com/puentejose" target="_blank"><img src="https://avatars3.githubusercontent.com/u/17868919?s=460&u=6318335f25f3da6024305a90031f8ba4fe45a262&v=4" width="50px" /></a> <a href="https://github.com/zoe7" target="_blank"><img src="https://avatars2.githubusercontent.com/u/3652786?s=460&u=97875938ea2cc0d27f32ee35760000a4d818be86&v=4" width="50px" /></a> <a href="https://github.com/fedGL/" target="_blank"><img src="https://avatars3.githubusercontent.com/u/30448072?s=460&u=30478d20849f916f8bdb3cd06d53e73be6f33cdd&v=4" width="50px" /></a> <a href="https://github.com/alain-pham" target="_blank"><img src="https://avatars3.githubusercontent.com/u/31744581?s=460&u=265c199f89be13bebfe6f9ddfbc735bf958db12a&v=4" width="50px" /></a> <a href="https://github.com/shariq1989" target="_blank"><img src="https://avatars3.githubusercontent.com/u/2559167?s=460&u=c5d43a563e79384f9715152aca7514221e9471b5&v=4" width="50px" /></a> <a href="https://github.com/anjanaMA" target="_blank"><img src="https://avatars1.githubusercontent.com/u/47097652?s=460&v=4" width="50px" /></a> <a href="https://github.com/blambert1080" target="_blank"><img src="https://avatars.githubusercontent.com/u/20506294" width="50px" /></a> <a href="https://github.com/ieshiawm" target="_blank"><img src="https://avatars.githubusercontent.com/u/20235726" width="50px" /></a> <a href="https://github.com/dmtrek14" target="_blank"><img src="https://avatars.githubusercontent.com/u/3666105" width="50px" /></a> <a href="https://github.com/jeelpatel17" target="_blank"><img src="https://avatars.githubusercontent.com/u/61663153" width="50px" /></a> <a href="https://github.com/ryanmcf10" target="_blank"><img src="https://avatars.githubusercontent.com/u/6777834" width="50px" /></a>

## License

The USPD is an open-source community project built to house data about current and previous US Prosecutors (copyright (c) 2017 - 2020 Billimarie Lubiano Robinson). It is licensed under **GNU GPLv3**. This means you are able to use, modify, & distribute USPD as long as the following conditions are met:
- Acknowledge the original source (this repository & its contributors)
- Apply the same license & copyright usage
- Make public any changes, updates, or improvements upon USPD
