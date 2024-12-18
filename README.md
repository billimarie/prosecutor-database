# U.S. Prosecutor Database
> Last Updated: December 14th, 2024

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

### JSON Structure

```
"name": "Rachael Rollins",
"role": "District Attorney",
"state": "Massachusetts",
"county": "Suffolk",
"party": "democrat",
"ageRange": "40-50",
"gender": "female",
"race": "black",
"appointed": "1601640275", // Unix Time Stamp: https://www.unixtimestamp.com/index.php
"headshot": "https://images.squarespace-cdn.com/content/v1/5c671e8e2727be4ad82ff1e9...",
"websites": {
  "url": "https://www.suffolkdistrictattorney.com/about-the-office/meet-district...",
  "wiki": "https://en.wikipedia.org/wiki/Rachael_Rollins",
  "facebook": "https://www.facebook.com/Rollins4DA",
  "twitter": "https://twitter.com/DARollins",
 },
"office": {
  "address": {
    "poBox": "",
    "courthouse": "Suffolk County District Attorney",
    "street": "1 Bulfinch Place",
    "city": "Boston",
    "zipcode": "02114",
    "phone": "(617) 619-4000"
  },
  "email": ""
},
"articles": [
  0: {
    "title": "Suffolk DA Rachael Rollins releases list of police officers with ‘ques...",
    "url": "https://www.boston.com/news/local-news/2020/09/26/rachael-rollins-rele...",
    "summary": "Suffolk County District Attorney Rachael Rollins Friday night released...",
    "featuredImage": "https://www.boston.com/wp-content/uploads/2020/06/CV3ZAWH2OJHFRFOWGSND..."
  }
 ]
```

Production: https://us-prosecutor-database.herokuapp.com/

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
