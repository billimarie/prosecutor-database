<p align="center">
    <img src="https://github.com/billimarie/light-pollution/raw/master/public/img/light-pollution-front-animation.gif" width="800px" alt="Light Pollution: Click on a U.S. Prosecutor to read their data" />
</p>

# light-pollution :city_sunset:

**light-pollution** is a list of all U.S. prosecutors. It houses local and national prosecutor data in a [.JSON masterlist](https://github.com/billimarie/light-pollution/blob/master/public/data/prosecutors.json), then displays the information in a simple, clean, and user-friendly website called [Light Pollution](https://billimarie.github.io/light-pollution).

Inspired by John Pfaff's new book, "Locked In," **light-pollution** has morphed into a community oversight project.

- [Installation](#installation)
    - [Requirements](#requirements)
    - [Steps](#1-prepare-the-repo)
- [Help Wanted](#help-wanted)

---

# Installation

## Requirements

[Git](https://git-scm.com/download/), Python, and Node (npm, Gulp):

```
git --version
python --version
node -v
npm install npm@latest -g
npm install --global gulp-cli
```

If you don't already have a GitHub account, now is the time to sign up.

## 1. Prepare the repo

[Fork](https://github.com/billimarie/light-pollution#fork-destination-box) the repository.

Change directories to where your clone of the light-pollution repo is located.

## 2. Switch to the Terminal or Command Prompt to initialize Git
```
cd path/goes/here/light-pollution
```

## 2.1 For people afraid of using Command Prompt / Terminal: Download [GitHub Desktop](https://desktop.github.com/)

## 2.2 For everyone else: Create a local clone of your fork

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

## 3. Install dependencies

In the root of the project, install npm dependencies.

```
npm install
```

## 4. Load site

Boot up a server in the `/public` directory, then navigate to `localhost:8000` in your browser.

```
cd public
Python -m SimpleHTTPServer
```

If you're using windows and get an error running SimpleHTTPServer, run `python -m http.server`, instead.

## 5. Make changes to the code

You can view the local dev version of light-pollution by going to `http://localhost:8000` in your browser.

### 5.1 Updating individual prosecutor profiles

To update and/or add new information to individual prosecutor pages, edit the related `.handlebars` template and `.json` file. (For example: edit `templates/attorney-general-profile.handlebars` and `public/attorney-general/_attorney-general-config.json` if you want to change the office hours of an Attorney General.)

### 5.2 Run Gulp

Build out the website with Gulp. Make sure you're in the root, where the `gulpfile.js` is located.

```
gulp handlebars
```

## 6. Finished? Just commit and push

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin [YOUR-BRANCH-NAME-HERE]
```

## 7. Submit a pull request

Go to the page of your fork on GitHub.

Select your branch and click the pull request button.

Once accepted, your pull request will be merged with the Github Pages branch (`gh-pages`) and go live on the [website](https://billimarie.github.io/light-pollution).

<p align="center">
    <img src="https://github.com/billimarie/light-pollution/blob/master/public/img/light-pollution-title-card-animation.gif" alt="Light Pollution: a prototype database of all U.S. Prosecutors" width="800px" />
</p>

# Help Wanted

Contributors of all skill levels warmly encouraged to participate.

There are several areas in need of contributors:

- [Submit prosecutor data and research via the Google Form](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions)
- [Create an inline form on the website to replace the Google Form](https://github.com/billimarie/light-pollution/issues/12)
- [Populate the .JSON masterlist with ALL THE PROSECUTORS](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions)
- [How to Organize Prosecutors: Role vs. Map vs. Zipcode](https://github.com/billimarie/light-pollution/issues/11)
- [Finalize Individual Prosecutor Pages: Design and Dev Templates](https://github.com/billimarie/light-pollution/issues/9)

## Submit Suggestions, Solutions, or Issues

Before submitting an issue, [view all current issues](https://github.com/billimarie/light-pollution/issues) to limit duplicates.

If you discover an unlisted bug, [open a new issue](https://github.com/billimarie/light-pollution/issues/new).

View the [wiki](https://github.com/billimarie/light-pollution/wiki/Contribute-Data,-Research,-and-Suggested-Solutions#submit-a-suggestion-or-solution) for more information.
