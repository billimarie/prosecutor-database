# DOCS
> Last Updated: August 28th 2020

## Table of Contents
- [1. History: Why Prosecutors?](#0-history-why-prosecutors)
- [2. Overview](#1-overview)
- [3. Data Collection](#3-data-collection)
- [4. Web App Development](#4-web-app-development)
- [5. Join Us: Post-Carceral](#4-join-us-post-carceral)
- [6. License](#5-license)

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

Please keep in mind: **the top priority is collecting data from electable District & State attorneys.** Here's how you can collect data for the web app:

1.) Search our live web app for counties & states which do not have District or State Attorney information.

2.) After choosing a state & county (or counties) to focus on, create a private copy of our U.S. Prosecutor Google Sheet. You can do this by going to File > Download then uploading it to your Google Drive.

3.) Manually search for the prosecutor information available online, then populate the sheet with the data you can find.

3.) Once you've finished, reply to this issue. A maintainer will ask you to share your new Google Sheet with their email (link in profile).

4.) Your data will be added to the database, & your GitHub profile will be added to the Contributors gallery.

---

## 4. Web App Development

To run the app locally on your machine:

1. install `node` & `npm` ([see official docs](https://www.npmjs.com/get-npm))
2. install `meteor` via terminal: `curl https://install.meteor.com/ | sh ` ([see official docs](https://www.meteor.com/install))
3. `cd` into repo's `app` folder
4. `npm install`
5. `meteor run` & open `http://localhost:3000/` in your browser

To play around with data:
1. in a new (simultaneous) terminal tab: `meteor mongo`
2. verify that the `show collections` command produces the `Attorneys` collection
3. insert a new document using the `api` folder .js files as a base. Make sure it contains the `name`, `state`, & `role`--otherwise it won't work. Example: `db.Attorneys.insertOne({"id": "ag-01","state": "Alabama","name": "Steve Marshall","role": "Attorney General"})`
4. check on the app in your browser; it should automatically refresh

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
