# U.S. Prosecutor Database
> Last Updated: November 2nd 2019

## Table of Contents
### [1. Overview](#1-overview)
### [2. How You Can Help](#3-how-you-can-help)
#### [Submit Data](submit-data)
#### [Contribute to App Development](contribute-to-app-development)
#### [Brainstorming Other Means Of Data Collection](brainstorming-other-means-of-data-collection)
### [3. Data Collection](#3-data-collection)
### [4. Join Us: Post-Carceral](#4-join-us-post-carceral)
#### [Stay Updated](#stay-updated)
#### [Volunteer](#volunteer)
### [5. License](#5-license)

---

## 1. Overview

The **U.S. Prosecutor Database** is a collection of .csv and .json data for currently elected and appointed government attorneys at the local, state, and federal level. This includes Attorney Generals, U.S. Attorneys, District/State Attorneys, and Municipal/County/City Attorneys.

Our goal is to showcase prosecutorial demographics, culture, and history. This goal is in service to [the **Post-Carceral** mission](#5-our-group-post-carceral), which is to:

* Cultivate a community of holding prosecutors accountable as a voting public
* Change the political and cultural landscape of this nation's real lawmakers
* Assisting prosecutors who aim to end mass incarceration and commit to decarceration

Unfortunately, this prosecutor database does not already exist. [The **Post-Carceral** vision](#5-our-group-post-carceral) is to collect this information so that we can not only showcase reality using open-source, collaborative methods, but contribute to radically shifting this political picture for future generations, as well.

[Back to Top](#us-prosecutor-database)

---

## 2. How You Can Help

### Submit Data
- Start with the beginner docs: [How to search, Google, and collect information into a simple document](https://billimarie.github.io/prosecutor-database#google).
- If you would like to submit directly to this repo instead, here are advanced instructions on manual data mining and entry: [Data Collection](#3-data-collection). Includes both manual .json/.csv collection as well as Python scraping.

### Contribute to App Development

For development:
1. cd to repo
2. `meteor run`
3. `meteor mongo`

For production:

### Brainstorming Other Means Of Data Collection

If you think of a new method for collecting and retrieving prosecutor data, please **create a new issue**. Good luck!

[Back to Top](#us-prosecutor-database)

---

## 3. Data Collection

Once again, if you are a beginner, see the [How to search, Google, and collect information into a simple document](https://billimarie.github.io/prosecutor-database#google) page.

To submit directly to this repo, read ahead.

### SETTING UP LOCALLY

#### 1. Clone this repo to your local environment
```
git clone git@github.com:billimarie/prosecutor-database.git
```

#### 2. Create a new branch for your work (ex: `ny-da`)
```
git checkout -b [state]-[role]
```

#### 3. Install Node modules
```
npm install
```

#### 4. Install the `csvtojson` module globally
```
npm install -g csvtojson
```

### GATHERING DATA

As previously noted, a dataset of all U.S. Prosecutors does not exist. Therefore, in order to create it, we work in a narrow scope: LOCATION (State) and ROLE (ex: District Attorney). You will see this emphasized repeatedly as *State-Role*. **Your branch should only consist of data from one state, one role.** It is okay to submit multiple pull requests, as long as you keep your work isolated in this manner.

There are one of two options you can choose for cultivating your dataset:
* Manually collecting prosecutor names by hand
* Creating a Python script to scrape the data

To manually collect prosecutor names by hand, [complete the steps, below](#step-1).

It is not recommended to go the data scraping route, as there is no uniform data to scrape from. This method is often not ideal as it will **require more energy than simply collecting the data by hand**. However, this is a good avenue to try if you come across some semblance of uniformity and/or want to see how scraping works. To scrape data, complete the steps below after [running the Python script](#optional-python-script).

#### STEP 1

Create a new .csv file as `[state]-[role].csv`. Add the **Basic Prosecutor Profile** columns:

* Name
* Location (State, County)
* Role
* Website
* Office Info (Address)
* Contact Info (Phone, Fax, Email)
* Optional: headshot / profile image

*Note: You can always add additional columns, as long as it conforms to the Full Prosecutor Profile (Demographics: Age, Race, Gender, Party).*

#### STEP 2

Google your chosen state's prosecutor association.

#### STEP 3

Collect the data in your .csv file. **Remember: One State, One Role, One Branch.**

#### STEP 4

Run the csvtojson Node module (ex: `ny-da.csv > ny-da.json`):

```
csvtojson [state-role].csv > [state-role].json
```

#### STEP 5

Be mindful of isolating your work. **As always: One State, One Role, One Branch.**

#### STEP 6

Add, Commit, and Submit a Pull Request:

```
git add .
git commit -m "Added [state] [role] as .csv and .json"
git push origin [branch]
```

#### OPTIONAL: Python Script

Again, **it is highly recommended you collect the data by hand**. If you are adamant on data scraping, here is the Python script I've been tweaking for each state:

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

Please feel free to submit a pull request if you can enhance this script (or provide a newer, better, faster version).

[Back to Top](#us-prosecutor-database)

---

## 4. Join Us: POST-CARCERAL

**Post-Carceral** is a digital community group of volunteers working on civic tech projects (like the US Prosecutor Database) in service of working toward a post-carceral ("beyond prison") world.

### Stay Updated

- **[Sign up for our weekly mailing list](https://t.co/bvfPitdu2g).** I send emails to everyone every Monday, after our remote Sunday sessions.
- You can also find USPD updates on our Twitter: [@USProsecutorDB](https://twitter.com/USProsecutorDB).
- To get involved in a remote Sunday session, follow [@postcarceral](https://twitter.com/postcarceral). This is our general prisoners' rights group responsible for housing the USPD project.

### Volunteer

**You don't have to be a developer or a prisoners' rights activist to join.** We're looking for all types of people with all types of expertise to collaborate with.

Every Sunday, we meet via Skype for a group session where we:
* Discuss recent prosecutor news, primary results, and campaigns
* Brainstorm ways to hold prosecutors accountable
* Collect data

If you'd like to join our Sunday group sessions, send an email to [Billimarie](https://www.github.com/billimarie).

[Back to Top](#us-prosecutor-database)

---

## 5. License

The USPD is an open-source community project built to house data about current and previous US Prosecutors (copyright (c) 2017 - 2019 Billimarie Lubiano Robinson). It is licensed under **GNU GPLv3**. This means you are able to use, modify, & distribute USPD as long as the following conditions are met:
- Acknowledge the original source (this repository & its contributors)
- Apply the same license & copyright usage
- Make public any changes, updates, or improvements upon USPD

For more information, please view the [LICENSE.md](license.md) file.

[Back to Top](#us-prosecutor-database)
