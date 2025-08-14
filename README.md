# U.S. Prosecutor Database
> Last Updated: August 14th, 2025

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

## Looking For Maintainer
The U.S. Prosecutor Database is looking for its next maintainer. If you have a vision of how to create a public, searchable database, ledger, or chain which everyday users can interact with through a simple UI/UX front-end, please submit a PR and we'll make sure this project lives on through your contributions.

---

## Setting Up

To run the app locally on your machine:

1. install `node` & `npm` ([see official docs](https://www.npmjs.com/get-npm))
2. install `meteor` via terminal: `npm install -g meteor` ([see official docs]([https://www.meteor.com/install](https://v2-docs.meteor.com/install.html#installation)))
3. `npm install`
4. `meteor run` & open `http://localhost:3000/` in your browser

### Adding Data to your local environment

To play around with data:

1. in a new (simultaneous) terminal tab: `meteor mongo`
2. verify that the `show collections` command produces the `Attorneys` collection
3. insert a new document using the `api` folder .js files as a base. Make sure it contains the `name`, `state`, & `role`--otherwise it won't work. Example: `db.Attorneys.insertOne({"id": "ag-01","state": "Alabama","name": "Steve Marshall","role": "Attorney General"})`
4. check on the app in your browser; it should automatically refresh

### JSON Schema
I've asked ChatGPT to enhance our old JSON schema:

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "US Prosecutor Database Schema",
  "description": "Enhanced schema for storing prosecutor profiles, policies, metrics, campaign statements, provenance, and privacy info for the US Prosecutor Database.",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z]{2}-[a-z0-9\\-]+-[0-9]{4}$",
      "description": "Unique ID: state (2-letter), jurisdiction slug, year (e.g., ca-los-angeles-2025)"
    },
    "prosecutor": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "role": { "type": "string", "enum": ["District Attorney", "Assistant District Attorney", "State Attorney General", "Deputy AG", "US Attorney"] },
        "jurisdiction": {
          "type": "object",
          "properties": {
            "state": { "type": "string", "minLength": 2, "maxLength": 2 },
            "county": { "type": "string" },
            "city": { "type": "string" }
          },
          "required": ["state"]
        },
        "party_affiliation": { "type": "string", "enum": ["Democrat", "Republican", "Independent", "Nonpartisan", "Other", "Unknown"] },
        "demographics": {
          "type": "object",
          "properties": {
            "gender": { "type": "string", "enum": ["Male", "Female", "Nonbinary", "Other", "Unknown"] },
            "race_ethnicity": { "type": "string" },
            "dob": { "type": "string", "format": "date" }
          }
        },
        "contact": {
          "type": "object",
          "properties": {
            "phone": { "type": "string" },
            "email": { "type": "string", "format": "email" },
            "website": { "type": "string", "format": "uri" },
            "mailing_address": { "type": "string" }
          }
        },
        "term_start": { "type": "string", "format": "date" },
        "term_end": { "type": "string", "format": "date" },
        "photo_url": { "type": "string", "format": "uri" }
      },
      "required": ["name", "role", "jurisdiction"]
    },
    "policies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "topic": { "type": "string", "description": "Policy category (e.g., 'discovery', 'bail', 'diversion')" },
          "description": { "type": "string" },
          "url": { "type": "string", "format": "uri" },
          "effective_date": { "type": "string", "format": "date" },
          "last_updated": { "type": "string", "format": "date" }
        },
        "required": ["topic", "url"]
      }
    },
    "metrics": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "description": "Metric identifier (e.g., 'diversion_rate', 'discovery_timeliness')" },
          "name": { "type": "string" },
          "value": { "type": "number" },
          "unit": { "type": "string", "description": "Unit of measurement (%, days, ratio, etc.)" },
          "period": { "type": "string", "description": "Reporting period (e.g., 2025Q2, 2024-01)" },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "evidence": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "url": { "type": "string", "format": "uri" },
                "quote": { "type": "string" },
                "quote_hash": { "type": "string" }
              }
            }
          },
          "caveats": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["id", "value", "period"]
      }
    },
    "campaign_statements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": { "type": "string", "format": "date" },
          "url": { "type": "string", "format": "uri" },
          "statement": { "type": "string" },
          "themes": { "type": "array", "items": { "type": "string" }, "description": "Tags for major policy stances (e.g., 'increase_incarceration', 'expand_diversion')" }
        },
        "required": ["date", "statement"]
      }
    },
    "provenance": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": { "type": "string", "description": "Field path in dot notation" },
          "source_url": { "type": "string", "format": "uri" },
          "retrieved_at": { "type": "string", "format": "date-time" },
          "text_span_hash": { "type": "string" },
          "model_confidence": { "type": "number", "minimum": 0, "maximum": 1 }
        },
        "required": ["field", "source_url", "retrieved_at"]
      }
    },
    "privacy": {
      "type": "object",
      "properties": {
        "pii_redaction": { "type": "boolean" },
        "dp_noise_epsilon": { "type": "number", "description": "Differential privacy parameter if noise is added" }
      }
    },
    "last_updated": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "prosecutor", "last_updated"]
}

```
You'll notice the following has been added:

- metrics[] for justice-forward measures with evidence and confidence levels.
- policies[] to store topic-tagged policy statements with effective dates.
- campaign_statements[] to track rhetoric vs. practice.
- provenance[] to record exactly where and when each data point came from (critical for AI-assisted ingestion).
- privacy controls to indicate whether PII was redacted or differential privacy applied.
- Stronger validation patterns for IDs, enums, and date formats to avoid messy data.

---

## Production

TBD

---

## Important Links
- **View the live web app** (coming soon)
- **[Read the Docs](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md)** (GitHub README.md)
- **[View the Docs](https://billimarie.github.io/prosecutor-database/)** (website)
- **[What do Prosecutors have to do with Police Brutality?](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md#0-history-why-prosecutors)**
- **[Our History](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md#1-overview)**

---

## Community

### Maintainers
> Would you like to help maintain this project? Email me (link in profile).

<a href="https://github.com/billimarie" target="_blank"><img src="https://avatars1.githubusercontent.com/u/6895471?s=60&v=4" width="50px"></a>

### Contributors

**Interested in contributing to the web app?** You'll find dev notes in the [**DOCS.md**](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md). Our stack is: Node.js, Meteor.js, MongoDB, Heroku.

**We also need help with documentation for the GitHub page**: https://billimarie.github.io/prosecutor-database. You can use the [DOCS.md](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md) & the [Hacktoberfest Issue](https://github.com/billimarie/prosecutor-database/issues/80) as references to update our outdated GitHub page.

<a href="https://github.com/billimarie" target="_blank"><img src="https://avatars1.githubusercontent.com/u/6895471?s=60&v=4" width="50px"></a> <a href="https://github.com/dbhatia247" target="_blank"><img src="https://avatars2.githubusercontent.com/u/28025453?s=60&v=4" width="50px"></a> <a href="https://github.com/maxxgl" target="_blank"><img src="https://avatars0.githubusercontent.com/u/20944914?s=60&v=4" width="50px"></a> <a href="https://github.com/taylor-brudos" target="_blank"><img src="https://avatars3.githubusercontent.com/u/39247698?s=60&v=4" width="50px"></a> <a href="https://github.com/ryanwardle" target="_blank"><img src="https://avatars2.githubusercontent.com/u/37915565?s=60&v=4" width="50px"></a> <a href="https://github.com/Thai56" target="_blank"><img src="https://avatars1.githubusercontent.com/u/16358617?s=60&v=4" width="50px"></a> <a href="https://github.com/wnorrad" target="_blank"><img src="https://avatars0.githubusercontent.com/u/29986200?s=60&v=4" width="50px"></a> <a href="https://github.com/rcalimlim" target="_blank"><img src="https://avatars0.githubusercontent.com/u/13503461?s=60&v=4" width="50px"></a> <a href="https://github.com/jeremyfiel" target="_blank"><img src="https://avatars3.githubusercontent.com/u/32110157?s=60&v=4" width="50px"></a> <a href="https://github.com/davidth4ever2" target="_blank"><img src="https://avatars3.githubusercontent.com/u/2314743?s=60&v=4" width="50px"></a> <a href="https://github.com/baconbones" target="_blank"><img src="https://avatars0.githubusercontent.com/u/40526815?s=60&v=4" width="50px"></a> <a href="https://github.com/MilesHamilton" target="_blank"><img src="https://avatars3.githubusercontent.com/u/46730797?s=60&v=4" width="50px"></a> <a href="https://github.com/Cybeeee" target="_blank"><img src="https://avatars1.githubusercontent.com/u/40544593?s=60&v=4" width="50px"></a> <a href="https://github.com/aminamos" target="_blank"><img src="https://avatars0.githubusercontent.com/u/26092352?s=120&v=4" width="50px"></a> <a href="https://github.com/VirtualVulture" target="_blank"><img src="https://avatars1.githubusercontent.com/u/17329142?s=88&v=4" width="50px"></a> <a href="https://github.com/emilyedalton" target="_blank"><img src="https://avatars2.githubusercontent.com/u/42655908?s=88&u=89b9dc741860701a302a79e1f69779caae643d0e&v=4" width="50px"></a> <a href="https://github.com/matthewgallo" target="_blank"><img src="https://avatars2.githubusercontent.com/u/10215203?s=88&u=342de932ab4cc7469eb92562d0e191dcdb6596ed&v=4" width="50px"></a> <a href="https://github.com/06b" target="_blank"><img src="https://avatars3.githubusercontent.com/u/1302542?s=460&u=2c6fda3da88e62ea04fb5baa7d2bd88a6f1794c1&v=4" width="50px" /></a> <a href="https://github.com/BlakeCampbells" target="_blank"><img src="https://avatars1.githubusercontent.com/u/6901655?s=460&u=a0e3506221f4ab5b27ba680d0fdeeeaa795b6fd9&v=4" width="50px" /></a> <a href="https://github.com/caseyryan22465" target="_blank"><img src="https://avatars3.githubusercontent.com/u/39289308?s=460&v=4" width="50px" /></a> <a href="https://github.com/a-s-ahmed" target="_blank"><img src="https://avatars1.githubusercontent.com/u/59892479?s=400&v=4" width="50px" /></a> <a href="https://github.com/hicks2evan" target="_blank"><img src="https://avatars1.githubusercontent.com/u/23247607?s=460&u=f431135eea1346df4155f63e3a026b68fd3e4f4c&v=4" width="50px" /></a> <a href="https://github.com/banjtheman" target="_blank"><img src="https://avatars1.githubusercontent.com/u/696254?s=400&u=488260c17dbe0bf857caa9f642c4b6d47b664df4&v=4" width="50px" /></a> <a href="https://github.com/mattkduran" target="_blank"><img src="https://avatars2.githubusercontent.com/u/19656092?s=460&v=4" width="50px" /></a> <a href="https://github.com/xingwang" target="_blank"><img src="https://avatars3.githubusercontent.com/u/744584?s=460&v=4" width="50px" /></a> <a href="https://github.com/baspalinckx" target="_blank"><img src="https://avatars2.githubusercontent.com/u/27728063?s=400&u=f1fc422bee245da952d88a98fe1ac9ec3eb60afb&v=4" width="50px" /></a> <a href="https://github.com/satanb4" target="_blank"><img src="https://avatars0.githubusercontent.com/u/26685910?s=400&u=54abb55fbc9d9c7c35e219a654d23eaa3d043495&v=4" width="50px" /></a> <a href="https://github.com/michaelknowles" target="_blank"><img src="https://avatars3.githubusercontent.com/u/738582?s=460&v=4" width="50px" /></a> <a href="https://github.com/treyarte" target="_blank"><img src="https://avatars1.githubusercontent.com/u/21246112?s=460&u=c695519d25c0c631ba1a2cac107e0a632b215c97&v=4" width="50px" /></a> <a href="https://github.com/puentejose" target="_blank"><img src="https://avatars3.githubusercontent.com/u/17868919?s=460&u=6318335f25f3da6024305a90031f8ba4fe45a262&v=4" width="50px" /></a> <a href="https://github.com/zoe7" target="_blank"><img src="https://avatars2.githubusercontent.com/u/3652786?s=460&u=97875938ea2cc0d27f32ee35760000a4d818be86&v=4" width="50px" /></a> <a href="https://github.com/fedGL/" target="_blank"><img src="https://avatars3.githubusercontent.com/u/30448072?s=460&u=30478d20849f916f8bdb3cd06d53e73be6f33cdd&v=4" width="50px" /></a> <a href="https://github.com/alain-pham" target="_blank"><img src="https://avatars3.githubusercontent.com/u/31744581?s=460&u=265c199f89be13bebfe6f9ddfbc735bf958db12a&v=4" width="50px" /></a> <a href="https://github.com/shariq1989" target="_blank"><img src="https://avatars3.githubusercontent.com/u/2559167?s=460&u=c5d43a563e79384f9715152aca7514221e9471b5&v=4" width="50px" /></a> <a href="https://github.com/dmtrek14" target="_blank"><img src="https://avatars0.githubusercontent.com/u/3666105?s=460&u=dbe14b51f09cb0c25fc92374c4c36b86ab5b4b0f&v=4" width="50px" /></a> <a href="https://github.com/anjanaMA" target="_blank"><img src="https://avatars1.githubusercontent.com/u/47097652?s=460&v=4" width="50px" /></a> <a href="https://github.com/dmtrek14" target="_blank"><img src="https://avatars0.githubusercontent.com/u/3666105?s=460&u=dbe14b51f09cb0c25fc92374c4c36b86ab5b4b0f&v=4" width="50px" /></a> <a href="https://github.com/anjanaMA" target="_blank"><img src="https://avatars1.githubusercontent.com/u/47097652?s=460&v=4" width="50px" /></a> <a href="https://github.com/ryanmcf10" target="_blank"><img src="https://avatars0.githubusercontent.com/u/6777834?s=400&u=efe83478f475d34d89d6c96b1dca0d746be2656c&v=4" width="50px" /></a> <a href="https://github.com/ieshiawm" target="_blank"><img src="https://avatars.githubusercontent.com/u/20235726" width="50px" /></a>

---

## Post-Carceral

**Post-Carceral** is a digital community group of volunteers working on civic tech projects (like the US Prosecutor Database) in service of working toward a post-carceral ("beyond prison") world.

### Stay Updated

- [Sign up for our mailing list](http://eepurl.com/dqPQdL).
- You can also find USPD updates on our Twitter: [@USProsecutorDB](https://twitter.com/USProsecutorDB).
- To get involved in a remote Sunday session, follow [@postcarceral](https://twitter.com/postcarceral). This is our general prisoners' rights group responsible for housing the USPD project.

### Volunteer

You don't have to be a developer or a prisoners' rights activist to join. We're looking for all types of people with all types of interests & expertise to collaborate with.

**Datathons**: On Sundays, we hang out remotely and discuss recent prosecutor news, primary results, & campaigns. We also brainstorm new ways to collect data (considering the strange logic of the prosecutorial system, especially as it differs between localities & regions). If you'd like to join, send me an email.

[Back to Top](#us-prosecutor-database)

---

## License

The USPD is an open-source community project built to house data about current and previous US Prosecutors (copyright (c) 2017 - 2020 Billimarie Lubiano Robinson). It is licensed under **GNU GPLv3**. This means you are able to use, modify, & distribute USPD as long as the following conditions are met:
- Acknowledge the original source (this repository & its contributors)
- Apply the same license & copyright usage
- Make public any changes, updates, or improvements upon USPD

For more information, please view the [LICENSE.md](/.github/license.md) file.

[Back to Top](#us-prosecutor-database)
