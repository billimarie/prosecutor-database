# light-pollution
> a database of all U.S. prosecutors

**light-pollution** is a prototype of a prosecutor oversight project. It displays local and national prosecutor data.

## Table of Contents

- [Installation](#installation)
    - [Requirements](#requirements)
    - [`master` branch](#master-branch)
- [Support](#support)
- [Contributing](#contributing)

## Installation

### Requirements

Python and npm (Gulp):

```
python --version
npm --version
```

### 1. Fetch and update the `master` branch

```
git clone https://www.github.com/billimarie/light-pollution.git
cd light-pollution
git fetch
git checkout master
```

### 2. Update the code

Boot up a server in the `/public` directory, then navigate to `localhost:8000` in your browser.

```
cd public
Python -m SimpleHTTPServer
```

Make changes to the code.

### 3. When you're done updating the code, build out the prosecutor profiles with Gulp (see step 4)

HINT: make sure you're in the root, where `gulpfile.js` is located. If you're in the `/public` directory, just `cd ..`.

```
gulp handlebars
```

### 3-1. To update individual prosecutor pages, edit the .handlebars template and .json files

For example: to add new information to an individual Attorney General profile, edit `templates/attorney-general-profile.handlebars` and `public/attorney-general/_attorney-general-config.json`.

### 4. Finalize the process with Gulp (see step 3)

Again, make sure you're in the root, where `gulpfile.js` is located.

#### 5. Finished? Just commit and push

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin master
```

Once accepted, your pull request will be merged with the Github Pages branch (`gh-pages`).

## Support

Before requesting support, [view all current issues](https://github.com/billimarie/light-pollution/issues).

If you have an unlisted problem, feel free to [open a new issue](https://github.com/billimarie/light-pollution/issues/new).

For any additional questions or comments, please contact [@billimarie](https://www.github.com/billimarie).

## Contributing

If you'd like to contribute, please [view the guidelines](https://github.com/billimarie/light-pollution/.github/CONTRIBUTING.md). Feel free to [fork this repo](https://github.com/billimarie/light-pollution#fork-destination-box) and make your changes. [Pull requests are warmly welcome](https://github.com/billimarie/light-pollution/compare).
