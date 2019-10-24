# U.S. Prosecutor Database
> Last Updated: October 24th 2019

## Note for Contributors
Though this repo isn't actively being maintained, I'm more than happy to accept pull requests.

If you are not a developer, you can start with the beginning docs: [How to search, Google, and collect information into a simple document](https://billimarie.github.io/prosecutor-database#google).

If you are a developer, you can see [the "Data Collection" section](#4-data-collection) for detailed instructions on **manual data entry** (recommended) and **Python scraping** (not recommended).

## Table of Contents
### [Note for Contributors](#note-for-contributors)
### [Introduction](#1-introduction)
### [The USPD App](#2-the-uspd-app)
### [The USPD Data](#3-the-uspd-data)
### [Data Collection](#4-data-collection)
### [Our Group: Post-Carceral](#5-our-group-post-carceral)
### [Acknowledgements](#6-acknowledgements)

## 1. Introduction

The **U.S. Prosecutor Database** is a collection of .csv and .json data for currently elected and appointed government attorneys at the local, state, and federal level. This includes Attorney Generals, U.S. Attorneys, District/State Attorneys, and Municipal/County/City Attorneys.

Our goal is to showcase prosecutorial demographics, culture, and history. This goal is in service to [the **Post-Carceral** mission](#5-our-group-post-carceral), which is to:

* Cultivate a community of holding prosecutors accountable as a voting public
* Change the political and cultural landscape of this nation's real lawmakers
* Assisting prosecutors who aim to end mass incarceration and commit to decarceration

Unfortunately, this prosecutor data does not already exist. [The **Post-Carceral** vision](#5-our-group-post-carceral) is to collect this information so that we can not only showcase reality using open-source, collaborative methods, but contribute to radically shifting this political picture for future generations, as well.

[Back to Top](#us-prosecutor-database)

## 2. The USPD App

Our online community, [**Post-Carceral**](#5-our-group-post-carceral), has created a separate web app which renders this data for easy access. Though this repository is dedicated to housing the USPD Data (and NOT the USPD App), please contact [Billimarie](https://www.github.com/billimarie) if you are interested in learning more.

[Back to Top](#us-prosecutor-database)

## 3. The USPD Data

The purpose of this repository is to share the USPD data we are aiming to collect.

The **Basic Prosecutor Profile** consists of 7 fields:
* Name
* Location (State, County)
* Role
* Website
* Office Info (Address)
* Contact Info (Phone, Fax, Email)
* Optional: headshot / profile image

The **Full Prosecutor Profile** has several additional fields, including Demographics (Age, Race, Gender, Party). Though it would be extremely helpful for each pull request to include a Full Prosecutor Profile, it is not expected.

[Back to Top](#us-prosecutor-database)

## 4. Data Collection

Here are detailed instructions on how you can collect and contribute data to the project.

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

[Back to Top](#us-prosecutor-database)

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

#### Brainstorming Other Means Of Data Collection

If a new method for collecting this data is discovered, please **create a new issue** where we can discuss it as a community.

## 5. Our Group: POST-CARCERAL

**Post-Carceral** is a digital community group of volunteers working on civic tech projects (like the US Prosecutor Database) in service of working toward a post-carceral ("beyond prison") world.

### STAY UPDATED

- **[Sign up for our weekly mailing list](https://t.co/bvfPitdu2g).** I send emails to everyone every Monday, after our remote Sunday sessions.
- You can also find USPD updates on our Twitter: [@USProsecutorDB](https://twitter.com/USProsecutorDB).
- To get involved in a remote Sunday session, follow [@postcarceral](https://twitter.com/postcarceral). This is our general prisoners' rights group responsible for housing the USPD project.

### VOLUNTEER

**You don't have to be a developer or a prisoners' rights activist to join.** We're looking for all types of people with all types of expertise to collaborate with.

Every Sunday, we meet via Skype for a group session where we:
* Discuss recent prosecutor news, primary results, and campaigns
* Brainstorm ways to hold prosecutors accountable
* Collect data

If you'd like to join our Sunday group sessions, send an email to [Billimarie](https://www.github.com/billimarie).

[Back to Top](#us-prosecutor-database)

## 6. Acknowledgements

This project would not be possible without the support of many individuals and organizations, including, but not limited to:

<img src="https://user-images.githubusercontent.com/6895471/35476336-29f78180-037c-11e8-800d-6fc8501a09b7.jpg" width="250px" border="0" />
