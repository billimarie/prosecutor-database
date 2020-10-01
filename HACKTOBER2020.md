# Welcome, Hacktober participants! 👋🏽 

## Why This Project?
If you're looking for a meaningful repo to contribute to, this is one. Our goal is to collect as much information as we can about **District Attorneys** because prosecutors are the only figures who can charge cops with police brutality. As such, we believe prosecutors are a key contributor to the ongoing police violence against unarmed individuals. **Prosecutors who fail to hold cops accountable actively encourage police brutality**. Our mission with this web app is to help educate voters so that they *vote against* prosecutors who let cops engage in this violence. ([read more](https://github.com/billimarie/prosecutor-database/blob/master/DOCS.md#1-history-why-prosecutors))

## Who Can Contribute
This issue is perfect anyone looking to get their feet wet for Hacktober. From beginners learning to code or use GitHub, to intermediate & advanced developers who are interested in data science, we can use your help harvesting basic information about the nation's District Attorneys. (Unsurprisingly, a dataset of this magnitude does not already exist.) You can see what we currently have on our [live web app](https://us-prosecutor-database.herokuapp.com/). 

## Our Hacktober 2020 Goal: Add 100 District Attorneys 🎉
By the end of Hacktober, we hope to add **100 District Attorneys** to our web app. We need your help with gathering basic information, including:
- name
- role
- state
- county
- party
- age range
- gender
- race
- appointed date OR elected date
- headshot (profile picture)
- website
- wikipedia entry
- targeted google news search
- social media (facebook, twitter, instagram, linkedin, youtube)
- office address
- contact info: email
- contact info: phone
- any relevant articles (link, title, summary, feature image)

Whew! You see why we're looking for as many people as we can to help. That's a lot of simple data to mine.

## How You Can Help

### Instructions For Setting Up Git / GitHub in Terminal / Command Line (OPTIONAL; if you've done this in the past, you don't have to do it again)

1.) Find your public SSH key:
```
cat ~/.ssh/id_rsa.pub
```

2.) Copy the key, including the `ssh-rsa` (but not your computer name)

3.) Go to your [GitHub settings](https://github.com/settings/ssh)

4.) Paste in your SSH key

5.) You should be good to go! Email me if you have any trouble pushing to the repo.

### Instructions For Setting Up Your Local Environment

1.) [Fork this repo](https://github.com/billimarie/prosecutor-database/fork)


2.) Clone the forked repo to your local environment:
```
git clone git@github.com:[your username]/prosecutor-database.git
```

3.) Make sure your branch is up-to-date with everyone else's work:
```
git fetch origin hacktober2020
```

4.) Create your branch:
```
git checkout hacktober2020
```

5.) Install the npm packages. 
```
npm install
```

### Instructions For Gathering Data

1.) Now, the fun part! It's time to start gathering data. Search through our [web app](https://us-prosecutor-database.herokuapp.com/) for a **District Attorney** in a state of your choosing. Click through their profile to see what information we have so far. (Example: search "California" & filter for "District Attorney").

2.) Once you find a missing District Attorney (or missing Profile Information about a District Attorney), visit our Google Sheet: [US Prosecutor Database - Profile Template](https://docs.google.com/spreadsheets/d/1Itwl8_jQpuXPjRH70fffEUSHvInfqbRKXg0iPEx8iCE/edit?usp=sharing). You can *add it to your own Google Drive* or *download it directly to your computer* as a CSV file.

3.) Time to Google! (Or Bing, or DuckDuckGo.) Use your favorite search engine to find information about District Attorneys in the state you chose. Start populating your [Basic Prosecutor Profile](https://docs.google.com/spreadsheets/d/1Itwl8_jQpuXPjRH70fffEUSHvInfqbRKXg0iPEx8iCE/edit?usp=sharing) sheet (aka, your CSV data) with whatever data you can verify.

4.) Once you've finished populating your sheet, save/download the .CSV file to the repo folder. Then, install & run the `csvtojson` package (a CSV to JSON converter tool). This which will convert your [Basic Profile sheet](https://docs.google.com/spreadsheets/d/1Itwl8_jQpuXPjRH70fffEUSHvInfqbRKXg0iPEx8iCE/edit?usp=sharing) .CSV file into a code format called JSON.
```
npm install -g csvtojson
csvtojson [your-file-name-here].csv > [your-file-name-here].json
```

### Instructions For Submitting Your Pull Request

1-A.) Time to **add**, **commit**, & **submit** your pull request:
```
git add .
git commit -m "[Your commit message goes here]"
git push origin hacktober2020
```
1-B.) Did you get an error when trying to submit your PR? Try Step 1 in **Instructions For Setting Up Git / GitHub in Terminal / Command Line**. You might be getting an error because your SSH key isn't connected to GitHub.

2.) Go to your forked repository, and press "Pull Request". Select "hacktober2020" for the branch for your forked repo and the main repo. Press "Create Pull Request" and type a title and description for your PR.

3.) Celebrate! 🎉 You'll receive a comment verifying I received your pull request. Once your PR has been merged, it'll be up on the [live web app](https://us-prosecutor-database.herokuapp.com/).
