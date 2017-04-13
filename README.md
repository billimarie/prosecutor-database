# light-pollution
> a database of all U.S. prosecutors

**light-pollution** is a prototype of a prosecutor oversight project. It displays local and national prosecutor data.

## Table of Contents

- [Installation](#installation)
    - [Requirements](#requirements)
    - [Steps](#1-fork-the-repository)
- [Support](#support)
- [Contributing](#contributing)

## Installation

### Requirements

Python and npm (Gulp):

```
python --version
npm --version
```

### 1. [Fork](https://github.com/billimarie/light-pollution#fork-destination-box) the repository

### 2. Clone, fetch, and checkout the `master` branch

```
git clone https://www.github.com/[YOUR-USERNAME-HERE]/light-pollution.git
cd light-pollution
git fetch
git checkout master
```

For a detailed overview of the fork/clone GitHub workflow, [view the GitHub tutorial](https://help.github.com/articles/fork-a-repo/).

### 3. Make your own branch and update the code

```
git branch [YOUR-BRANCH-NAME-HERE]
git checkout [YOUR-BRANCH-NAME-HERE]
```

Boot up a server in the `/public` directory, then navigate to `localhost:8000` in your browser.

```
cd public
Python -m SimpleHTTPServer
```

Make changes to the code.

### 4-1. If you DON'T make changes to the individual prosecutor profiles, skip to step 5

### 4-2. If you DO make changes to the individual prosecutor profiles, finalize the process with Gulp

HINT: To update individual prosecutor pages, edit the related .handlebars template and .json files. For example: to add new information to an individual Attorney General profile, edit `templates/attorney-general-profile.handlebars` and `public/attorney-general/_attorney-general-config.json`.

When you're finished, run Gulp. Make sure you're in the root, where the `gulpfile.js` is located.

```
gulp handlebars
```

### 5. Finished? Just commit and push

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin [YOUR-BRANCH-NAME-HERE]
```

### 6. Submit a pull request

Go to the page of your fork on GitHub: https://www.github.com/[YOUR-USERNAME-HERE]/light-pollution. Select your branch and click the pull request button.

Once accepted, your pull request will be merged with the Github Pages branch (`gh-pages`) and go live on the [website](https://billimarie.github.io/light-pollution).

## Support

Before requesting support, [view all current issues](https://github.com/billimarie/light-pollution/issues).

If you have an unlisted problem, feel free to [open a new issue](https://github.com/billimarie/light-pollution/issues/new).

For any additional questions or comments, please contact [@billimarie](https://www.github.com/billimarie).

## Contributing

If you'd like to contribute, please [view the guidelines](https://github.com/billimarie/light-pollution/.github/CONTRIBUTING.md). Feel free to [fork this repo](https://github.com/billimarie/light-pollution#fork-destination-box) and make your changes. [Pull requests are warmly welcome](https://github.com/billimarie/light-pollution/compare).
