# U.S. Prosecutor Database
> Last Updated: November 22nd 2019

## Live App: https://us-prosecutor-database.herokuapp.com/
## App Branch: https://github.com/billimarie/prosecutor-database/tree/app
## Data Branch: https://github.com/billimarie/prosecutor-database/tree/csv-json-data

## Table of Contents
- [1. Overview](#1-overview)
- [2. How You Can Help](#2-how-you-can-help)
  * [2.1 Beginner](#beginner)
  * [2.2 Intermediate](#intermediate)
  * [2.3 Advanced](#advanced)
  * [2.4 Brainstorming Other Means Of Data Collection](#brainstorming-other-means-of-data-collection)
- [3. Data Collection](#3-data-collection)
- [4. Join Us: Post-Carceral](#4-join-us-post-carceral)
  * [4.1 Stay Updated](#stay-updated)
  * [4.2 Volunteer](#volunteer)
- [5. License](#5-license)

---

## 1. Overview

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

## 2. How You Can Help

Unfortunately, a complete &amp; comprehensive dataset of prosecutors does not already exist.

You can help by: manually collecting data into a spreadsheet ("beginner"), manually collecting data &amp; pushing it to the `csv-json-data` folder ("intermediate"), and/or updating the app ("advanced").

### Beginner (no GitHub experience)
[How to search, Google, and collect information into a simple document](https://billimarie.github.io/prosecutor-database#google).

### Intermediate (GitHub experience)
Instructions on how to pull down the repo, begin the manual data mining/entry process, then submit a pull request: [Data Collection](#3-data-collection). It includes both manual .json/.csv collection as well as Python scraping.

Additionally, we now have a `headshots` folder for hosting prosecutor pictures. Feel free to submit a pull request if you've gathered this data in your own fork. After merging, I'll upload your images to mLab so the Heroku app can sync up.

### Advanced (Developer experience)
To help build the app:

1. cd to repo/app
2. `npm install`
3. `meteor run`
4. `meteor mongo`

Production: https://us-prosecutor-database.herokuapp.com/

### Brainstorming Other Means Of Data Collection

If you think of a new method for collecting and retrieving prosecutor data, please **create a new issue**. Good luck!

[Back to Top](#us-prosecutor-database)

---

## 3. Data Collection

### Local Environment

#### 1. Clone this repo to your local environment
```
git clone git@github.com:billimarie/prosecutor-database.git
```

#### 3. Switch to the csv-json-data folder
```
cd [repo]/csv-json-data
```

#### 2. Create a new branch for your work (ex: `ny-da`)
```
git checkout -b [state]-[role]
```

#### 3. Install Node modules (only have to do this once)
```
npm install
```

#### 4. Install the `csvtojson` module globally (only have to do this once)
```
npm install -g csvtojson
```

### Collecting Data

As previously noted, a dataset of all U.S. Prosecutors does not exist. Therefore, in order to create it, we work in a narrow scope: LOCATION (State) and ROLE (ex: District Attorney). You will see this emphasized repeatedly as *State-Role*. **Your branch should only consist of data from one state, one role.** It is okay to submit multiple pull requests, as long as you keep your work isolated in this manner.

There are one of two options you can choose for cultivating your dataset:
* Manually collecting prosecutor names by hand
* Creating a Python script to scrape the data

To manually collect prosecutor names by hand, [complete the steps, below](#step-1).

It is not recommended to go the data scraping route, as there is no uniform data to scrape from. This method is often not ideal as it will **require more energy than simply collecting the data by hand**. However, this is a good avenue to try if you come across some semblance of uniformity and/or want to see how scraping works. To scrape data, complete the steps below after [running the Python script](#optional-python-script).

#### 1. Create a new .csv file as `[state]-[role].csv`. Add the **Basic Prosecutor Profile** columns:
```
* Name
* Location (State, County)
* Role
* Website
* Office Info (Address)
* Contact Info (Phone, Fax, Email)
* Optional: headshot / profile image (url)
```

#### 2. Search for your chosen state's prosecutor association.

#### 3. Collect the data in your .csv file. **Remember: One State, One Role, One Branch.**

#### 4. Run the `csvtojson` Node module (ex: `ny-da.csv > ny-da.json`):

```
csvtojson [state-role].csv > [state-role].json
```

#### 5. Add, Commit, and Submit a Pull Request:

```
git add .
git commit -m "Added [state] [role] as .csv and .json"
git push origin [branch]
```

#### OPTIONAL: Scrape data with a Python Script

Again, **it is highly recommended you collect the data by hand**. If you are adamant on data scraping, here's the Python script I created a few years ago. You can use it as a base and adjust the logic according to each state's system. Please feel free to submit a pull request if you can enhance this script (or provide a newer, better, faster version).

```
#!/usr/bin/python3

from pyquery import PyQuery as pq
import requests as req

urls = [
    'https://www.nypti.org/DA Htmls/stlawrence.html',
    'https://www.nypti.org/DA Htmls/franklin.html',
    'https://www.nypti.org/DA Htmls/clinton.html',
    ...
    'https://www.nypti.org/DA Htmls/orleans.html',
    'https://www.nypti.org/DA Htmls/niagara.html',
    'https://www.nypti.org/DA Htmls/chautauqua.html'
]

for url in urls:
    page = req.get(url)
    doc = pq(page.text)
    link = doc('a')
    website = pq(link).attr('href')
    da = doc('div').text()
    print(da)
    print(website)
```

[Back to Top](#us-prosecutor-database)

---

## 4. Join Us: POST-CARCERAL

**Post-Carceral** is a digital community group of volunteers working on civic tech projects (like the US Prosecutor Database) in service of working toward a post-carceral ("beyond prison") world.

### Stay Updated

- [Sign up for our mailing list](http://eepurl.com/dqPQdL).
- You can also find USPD updates on our Twitter: [@USProsecutorDB](https://twitter.com/USProsecutorDB).
- To get involved in a remote Sunday session, follow [@postcarceral](https://twitter.com/postcarceral). This is our general prisoners' rights group responsible for housing the USPD project.

### Volunteer

You don't have to be a developer or a prisoners' rights activist to join. We're looking for all types of people with all types of interestes & expertise to collaborate with.

**Datathons**: On Sundays, we hang out remotely and discuss recent prosecutor news, primary results, & campaigns. We also brainstorm new ways to collect data (considering the strange logic of the prosecutorial system, especially as it differes between localities & regions). If you'd like to join, send me an email.

[Back to Top](#us-prosecutor-database)

---

## 5. License

The USPD is an open-source community project built to house data about current and previous US Prosecutors (copyright (c) 2017 - 2019 Billimarie Lubiano Robinson). It is licensed under **GNU GPLv3**. This means you are able to use, modify, & distribute USPD as long as the following conditions are met:
- Acknowledge the original source (this repository & its contributors)
- Apply the same license & copyright usage
- Make public any changes, updates, or improvements upon USPD

For more information, please view the [LICENSE.md](/.github/license.md) file.

[Back to Top](#us-prosecutor-database)
