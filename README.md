# light-pollution
> a database of all U.S. prosecutors

**light-pollution** is a prototype of a prosecutor oversight project. It displays local and national prosecutor data.

## Table of Contents

- [Installation](#installation)
    - [Requirements](#requirements)
    - [Steps](#1-prepare-the-repo)
- [Contributing](#contributing)

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
