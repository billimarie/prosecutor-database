# U.S. Prosecutor Database
> June 18th 2018

## Important
**Please do not contribute to the project (comments, pull requests, issues, etc.) before reading the ENTIRE README.md**

Hi everyone,

Thanks for checking out the US Prosecutor Database.

### Vision

The **U.S. Prosecutor Database** is a collection of elected and appointed State attorneys in the United States. It showcases prosecutor history at the local, state, and federal level:
* Attorney Generals
* U.S. Attorneys
* District Attorneys
* Municipal/City Attorneys

### Project
This repository and project can be divided into two sections:

1. The App (GitHub Repo v. Pantheon)
2. The Data

## The App

Though the repo itself is utilizing Meteor.js, our local community group has **migrated away from this GitHub repo toward a CMS (Drupal 8) dev site that is hosted remotely on Pantheon**. This is why the repo has not been updated in months.

I'm hoping to remedy this situation. If you would like to help or offer suggestions, please send me an email: work@billimarie.com.

If you'd like to contribute to the project, there are two ways currently to get involved:
* Join a remote Sunday Session (see ["How You Can Help"](#how-you-can-help))
* Begin scraping data and submitting it as a .csv or .txt file (see ["The Data"](#the-data))

## The Data

I recently taught myself some Python in order to scrape data from district attorney association websites. Here is the Python script I've been tweaking for each state:

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

Please feel free to submit a pull request if you can enhance this script (or provide a newer, better, faster version). Please keep in mind that the following information is what we aim to scrape:
* Name
* Location (State, County)
* Website
* Office Info (Address)
* Contact Info (Phone, Fax, Email)
* Optional: headshot / profile image

Here are the states that are next on our data scraping list:
* Wisconsin
* Rhode Island
* Colorado
* New Mexico
* Texas
* Ohio

## How You Can Help

We need developers to assist with the following:
* Data Scraping (see: ["The Data"](#the-data))
* UX/UI Design (please email)
* Better Exposed Filters + Simple Hierarchal Select integration (Drupal 8 / AJAX; please attend a Sunday Session; see ["Join Us: Remote Sunday Sessions"](#join-us-remote-sunday-sessions))

### How To Stay Updated

**[Sign up for our weekly mailing list](https://t.co/bvfPitdu2g).** I send emails to everyone every Monday, after our remote Sunday sessions.

You can also find USPD updates on our Twitter: [@USProsecutorDB](https://twitter.com/USProsecutorDB).

To get involved in a remote Sunday session, follow [@postcarceral](https://twitter.com/postcarceral) (this is our general prisoners' rights group responsible for housing the USPD project).

### **JOIN US:** Remote Sunday Sessions

Every Sunday, we meet via Skype to:
* Discuss recent prosecutor news, primary results, and campaigns
* Brainstorm ways to hold prosecutors accountable
* Manually search Google by hand for prosecutor data
* Use Python to scrape data from district attorney association websites

**You don't have to be a developer or a prisoners' rights activist to join.** We're looking for all types of people with all types of expertise to collaborate with.

We'd love any developers to join us if you've got a solution for automating and/or scripting our labor intensive search process.

If you'd like to volunteer and help with the US Prosecutor Database, or if you're curious about attending a Datathon session, send an email (see: [GitHub profile](https://www.github.com/billimarie)) and follow [@USProsecutorDB on Twitter](https://twitter.com/USProsecutorDB).

## Acknowledgements

This project would not be possible without the support of many individuals and organizations, including, but not limited to:

<img src="https://user-images.githubusercontent.com/6895471/35476336-29f78180-037c-11e8-800d-6fc8501a09b7.jpg" width="250px" border="0" />
