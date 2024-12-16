# DOCS
> Last Updated: October 5th 2020

## Table of Contents
- [1. History: Why Prosecutors?](#1-history-why-prosecutors)
- [2. Overview](#2-overview)
- [3. Data Collection](#3-data-collection)
- [4-A. Web App Development](#4-a-web-app-development)
- [4-B. Adding Data to Your Local Environment](#4-b-adding-data-to-your-local-environment)
- [5. Join Us: Post-Carceral](#5-join-us-post-carceral)
- [6. License](#6-license)

---

## 1. History: Why Prosecutors?

The U.S. Prosecutor Database was a programming project idea I had while co-founding CLASP (the Community Legal & Advocacy Services Project), a nonprofit prisoners' rights project.

Inspired by [Arbitrary Justice: The Power of the American Prosecutor](https://www.amazon.com/Arbitrary-Justice-Power-American-Prosecutor/dp/0195384733) by the legendary Angela Davis, I decided to start compiling a list of basic information about current & previous prosecutors. This proved to be harder than originally thought. Due to the severe lack of a complete/comprehensive dataset, I asked friends to help. We started mining what we could. Eventually, people found the open-source project on GitHub & began contributing as well.

*The goal of this project is to inspire engagement from the public when it comes to prosecutor oversight, elections, & cases. **Ending Mass Incarceration starts with Prosecutorial Oversight.***

John Pfaff, the author of Locked In, believes one of the reasons why prisoners' rights advocates have forgotten to hold prosecutors accountable is simply because *there is no data available*. We overlook the role of prosecutors since they are less visible.

Some key statistics to help you understand the severity of this unaccounted power dynamic:
- 97% of prisoners are held in state prisons--not private prisons.
- In 46 states, prosecutors are elected—& 85% run without opposition.
- Since the 1990's, violent crime & arrests for violent crime have declined—but the number of felony cases filed in state courts continue to jump drastically higher than they should. "The probability that a prosecutor would file felony charges against an arrestee basically doubled," Pfaff writes, "& that change pushed prison populations up even as crime dropped."
- 95% of cases end in plea bargains worked out behind closed doors.
- Unsurprisingly, as you look at the data for the last twenty or so years, tens of thousands more prosecutors were hired even after crime stopped rising.

The United States Prosecutor Database is one attempt to demystify the power of local, state, & federal prosecutors. My hope is you feel inspired to vote based upon prosecutorial data rather than campaign slogans, as we can help shift the tide away from mass incarceration toward a post-carceral world.

[Back to Top](#us-prosecutor-database)

---

## 2. Overview

The **United States Prosecutor Database** is a website housing the data of current &amp; previous elected/appointed government attorneys at the local, state, &amp; federal level. This includes (but is not limited to):
- Attorney Generals
- U.S. Attorneys
- District/State Attorneys
- Municipal/County/City Attorneys

Our goal is to showcase prosecutorial news articles, demographics, trends, office culture, &amp; history. This goal is in service to [the **Post-Carceral** mission](#5-join-us-post-carceral), which is to:

* Cultivate a community of holding prosecutors accountable as a voting public
* Change the political and cultural landscape of this nation's real lawmakers
* Assist prosecutors who are aiming to end mass incarceration with a commitment to decarceration

[Back to Top](#us-prosecutor-database)

---

## 3. Data Collection

### Please use the `hacktober-data` branch

Here's a link to our Hacktoberfest 2020 goal: **[Add 100 District Attorneys](https://github.com/billimarie/prosecutor-database/issues/80)** It contains *very* detailed steps on how to contribute data. For basic instructions, see below:

1.) Search our [live web app](https://us-prosecutor-database.herokuapp.com/) for counties & states which do not have District Attorney information (or have missing information in their District Attorney profile).

2.) After choosing a state & county (or counties) to focus on, create a private copy of our [U.S. Prosecutor Google Sheet](https://docs.google.com/spreadsheets/d/1Itwl8_jQpuXPjRH70fffEUSHvInfqbRKXg0iPEx8iCE/edit?usp=sharing). You can do this by going to File > Download then uploading it to your Google Drive.

3.) Manually search for the prosecutor information available online, then populate the sheet with the data you can find.

3.) Convert your file (.CSV) into JSON. You can do this through Terminal / Command Line: `npm install -g csvtojson` & `csvtojson [your-file-name-here].csv > [your-file-name-here].json`.

4.) Submit a pull request. Your data will be added to the database, & your GitHub profile will be added to the Contributors gallery.

---

## 4-A. Web App Development

### Please use the `hacktober-app` branch

To run the app locally on your machine:

1. install `node` & `npm` ([see official docs](https://www.npmjs.com/get-npm))
2. install `meteor` via terminal: `npm install -g meteor` ([see official docs]([https://www.meteor.com/install](https://v2-docs.meteor.com/install.html#installation)))
3. `npm install`
4. `meteor run` & open `http://localhost:3000/` in your browser

## 4-B. Adding Data to your local environment

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

[Back to Top](#us-prosecutor-database)

---

## 5. Join Us: POST-CARCERAL

**Post-Carceral** is a digital community group of volunteers working on civic tech projects (like the US Prosecutor Database) in service of working toward a post-carceral ("beyond prison") world.

You don't have to be a developer or a prisoners' rights activist to join. We're looking for all types of people with all types of interestes & expertise to collaborate with.

**Datathons**: CURRENTLY UNDER HIATUS. On Sundays, we hang out remotely and discuss recent prosecutor news, primary results, & campaigns. We also brainstorm new ways to collect data (considering the strange logic of the prosecutorial system, especially as it differes between localities & regions). If you'd like to join, send an email.

**Mailing List**: [http://eepurl.com/dqPQdL](http://eepurl.com/dqPQdL)

[Back to Top](#us-prosecutor-database)

---

## 6. License

The USPD is an open-source community project built to house data about current and previous US Prosecutors (copyright (c) 2017 - 2020 Billimarie Lubiano Robinson). It is licensed under **GNU GPLv3**. This means you are able to use, modify, & distribute USPD as long as the following conditions are met:
- Acknowledge the original source (this repository & its contributors)
- Apply the same license & copyright usage
- Make public any changes, updates, or improvements upon USPD

For more information, please view the [LICENSE.md](/.github/license.md) file.

[Back to Top](#us-prosecutor-database)
