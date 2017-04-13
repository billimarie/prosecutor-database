# light-pollution
> a database of all U.S. prosecutors

![Light Pollution: a prototype database of all U.S. Prosecutors](https://github.com/billimarie/light-pollution/blob/master/public/img/light-pollution-front-animation.gif?raw=true)

**light-pollution** is a prototype of a prosecutor community oversight project.

It houses local and national prosecutor data in a [.JSON masterlist](https://github.com/billimarie/light-pollution/blob/master/public/data/prosecutors.json), then displays the information in a simple, clean, and user-friendly website called [Light Pollution](https://billimarie.github.io/light-pollution).

## Table of Contents

- [How To Use](#how-to-use)
- [Installation](#installation)
    - [Requirements](#requirements)
    - [Steps](#1-prepare-the-repo)
- [Contributing](#contributing)

# How To Use

## Using the Website

### Navigation

Navigate to different types of U.S. Prosecutors using the navigation menu:

<p align="center">
    <img src="https://github.com/billimarie/light-pollution/blob/master/public/img/light-pollution-hover-menu-animation.gif" width="700px" alt="Light Pollution: Attorney General, U.S. Attorney, District Attorney, Municipal, City, and County Attorney" />
</p>

### Browsing

Browse through the list until you spot a U.S. Prosecutor you would like more information on:

<p align="center">
    <img src="https://github.com/billimarie/light-pollution/blob/master/public/img/light-pollution-hover-prosecutor-animation.gif" width="350px" alt="Light Pollution: Jeff Sessions, Attorney General of the United States of America" />
</p>

### Individual Prosecutor Page

Click their name, and you'll be taken to their individual prosecutor page.

The individual prosecutor page template is currently under development. **light-pollution** is actively seeking contributors and would love your help: [Wiki: Contributing](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions).

### Update Prosecutor Data: Google Forms

Did you come across wrong information? Can't find a prosecutor? Want to edit existing prosecutor data? Submit your data [here](https://goo.gl/forms/JG9gYxSIGE7nB6eK2):

<p align="center">
    <img src="https://github.com/billimarie/light-pollution/blob/master/public/img/light-pollution-submission-animation.gif" width="700px" alt="Light Pollution: Submit data about a U.S. Prosecutor via Google Forms" /></p>

### Update Prosecutor Data: .JSON Masterlist

You can also update prosecutor data by directly editing the Masterlist.

View the current masterlist of U.S. Prosecutors here: [prosecutors.JSON](https://github.com/billimarie/light-pollution/blob/master/public/data/prosecutors.json)

# Installation

## Requirements

Python and npm (Gulp):

```
python --version
npm --version
```

## 1. Prepare the repo

[Fork](https://github.com/billimarie/light-pollution#fork-destination-box) the repository.

Clone, Fetch, and Checkout the `master` branch.

```
git clone https://www.github.com/[YOUR-USERNAME-HERE]/light-pollution.git
cd light-pollution
git fetch
git checkout master
```

Make your own branch. Name it after the feature/fix you plan to implement (for example: `Update-District-Attorney-websites`).

```
git branch [YOUR-BRANCH-NAME-HERE]
git checkout [YOUR-BRANCH-NAME-HERE]
```

For a detailed overview of the fork/clone GitHub workflow, [view the GitHub tutorial](https://help.github.com/articles/fork-a-repo/).

## 2. Install dependencies

In the root of the project, install npm dependencies.

```
npm install
```

## 3. Load site

Boot up a server in the `/public` directory, then navigate to `localhost:8000` in your browser.

```
cd public
Python -m SimpleHTTPServer
```

## 4. Make changes to the code

### 4.1 Updating individual prosecutor profiles

To update and/or add new information to individual prosecutor pages, edit the related `.handlebars` template and `.json` file.

For example: edit `templates/attorney-general-profile.handlebars` and `public/attorney-general/_attorney-general-config.json` if you want to change the office hours of an Attorney General.

### 4.2 Run Gulp

Build out the website with Gulp. Make sure you're in the root, where the `gulpfile.js` is located.

```
gulp handlebars
```

## 5. Finished? Just commit and push

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin [YOUR-BRANCH-NAME-HERE]
```

## 6. Submit a pull request

Go to the page of your fork on GitHub.

Select your branch and click the pull request button.

Once accepted, your pull request will be merged with the Github Pages branch (`gh-pages`) and go live on the [website](https://billimarie.github.io/light-pollution).

# Contributing

## Submit Data and Research

Everyone is welcome to submit data.

Once you've found data regarding a U.S. Prosecutor, please submit your findings through the [Light Pollution: Google Form](https://goo.gl/forms/FTztY8EJaPt7KXTn1).

For additional details, visit the [wiki](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions).

## Update the Website

If you'd like to contribute, please [view the guidelines](https://github.com/billimarie/light-pollution/.github/CONTRIBUTING.md). Everyone is welcome to [fork the repo](https://github.com/billimarie/light-pollution#fork-destination-box) and [submit pull requests](https://github.com/billimarie/light-pollution/compare).

For any additional questions or comments, please contact [@billimarie](https://www.github.com/billimarie).

## Submit Suggestions, Solutions, or Issues

Before submitting an issue, [view all current issues](https://github.com/billimarie/light-pollution/issues) to limit duplicates.

If you discover an unlisted bug, feel free to [open a new issue](https://github.com/billimarie/light-pollution/issues/new).

Have a suggestion? A proposed solution? View the [wiki](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions#submit-a-suggestion-or-solution) for more information.
