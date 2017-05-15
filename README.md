<p align="center">
    <img src="https://raw.githubusercontent.com/billimarie/light-pollution/gh-pages/img/light-pollution-title-card-animation.gif" alt="Light Pollution: a prototype database of all U.S. Prosecutors" width="800px" />
</p>

# light-pollution :city_sunset:

**light-pollution** is a database of elected and appointed State attorneys in the United States (Attorney Generals, U.S. Attorneys, District Attorneys, Municipal/City Attorneys). It showcases prosecutor history at the local, state, and federal level.

## Table of Contents

- [Demo](#demo)
- [Installation](#installation)
    - [Requirements](#requirements)
    - [Steps](#1-prepare-the-repo)
- [Contributors](#contributors)
- [Help Wanted](#help-wanted)
    - [Submit Suggestions, Solutions, or Issues](#submit-suggestions-solutions-or-issues)

---

# Demo

**View the new Heroku demo: [http://light-pollution.herokuapp.com/](http://light-pollution.herokuapp.com/)**

View the old GitHub Pages demo: [https://billimarie.github.io/light-pollution](https://billimarie.github.io/light-pollution)

<p align="center">
    <img src="https://github.com/billimarie/light-pollution/blob/gh-pages/img/light-pollution-front-animation.gif?raw=true" width="800px" alt="Light Pollution: Click on a U.S. Prosecutor to read their data" />
</p>

# Installation

## Requirements

[Git](https://git-scm.com/download/), [Meteor](https://www.meteor.com)

```
git --version
meteor --version
```

## 1. Prepare the repo

[Fork](https://github.com/billimarie/light-pollution#fork-destination-box) the repository.

## 2. Create a local clone of your fork

Switch to the Terminal. Clone, Fetch, and Checkout the `master` branch of your `light-pollution` fork.

```
git clone https://www.github.com/[YOUR-USERNAME-HERE]/light-pollution.git

cd light-pollution

git fetch

git checkout dev

git pull origin dev
```

## 3. Name your working branch

```
git checkout -b [YOUR-INITIALS-HERE]/feature-name-here
```

**Note:** For organizational purposes, make sure you use your initials at the beginning of your branch. Then create a brief description of your feature. For example: `blr/toggle-attorney-types`

## 4. Setup your development environment and load the site

```
meteor

meteor npm install

meteor mongo
```

## 5. Make and commit changes as you go along

```
git commit -m "[YOUR COMMENT HERE]"
```

## 6. Finished? Don't forget to checkout, pull, and rebase before you push

```
git checkout dev

git pull

git checkout [YOUR-INITIALS-HERE]/feature-name-here

git rebase dev

git push -u origin [YOUR-INITIALS-HERE]/feature-name-here
```

## 7. Submit a pull request

Go to the page of your fork on GitHub.

Select your branch and click the pull request button.

Once accepted, your pull request will be merged with the production branch (`master`) and go live on the [website](https://billimarie.github.io/light-pollution).

# Contributors

Created and maintained by @billimarie.

# Help Wanted

Contributors of all skill levels warmly encouraged to participate.

There are several areas in need of contributors:

- [Create Node.js RESTful API](https://github.com/billimarie/light-pollution/issues/15)
- [Submit prosecutor data and research via the Google Form](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions)
- [Create an inline form on the website to replace the Google Form](https://github.com/billimarie/light-pollution/issues/12)
- [Populate the .JSON masterlist with ALL THE PROSECUTORS](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions)
- [Finalize Individual Prosecutor Pages: Design and Dev Templates](https://github.com/billimarie/light-pollution/issues/9)

## Submit Suggestions, Solutions, or Issues

Before submitting an issue, [view all current issues](https://github.com/billimarie/light-pollution/issues) to limit duplicates.

If you discover an unlisted bug, [open a new issue](https://github.com/billimarie/light-pollution/issues/new).

View the [wiki](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions#submit-a-suggestion-or-solution) for more information.
