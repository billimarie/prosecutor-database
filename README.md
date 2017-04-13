# light-pollution
> a database of all U.S. prosecutors

**light-pollution** is a prototype of a prosecutor oversight project. It displays local and national prosecutor data.

## Table of Contents

- [Installation](#installation)
    - [`master` branch](#master-branch)
    - [`gh-pages` branch](#gh-pages-branch)
- [Support](#support)
- [Contributing](#contributing)

## Installation

### `master` branch

#### 1. First: fetch and update the `master` branch

```
git clone https://www.github.com/billimarie/light-pollution.git
cd light-pollution
git fetch
git checkout master
```

#### 2. Boot up a simple server in the `/public` directory to see what the site looks like

```
cd public
Python -m SimpleHTTPServer
```

#### 3. Navigate to `localhost:8000` in your browser to make sure the site is running

#### 4. When you're done updating the code, build out the prosecutor profiles (see step 5)

Hint: make sure you're in the root. If you're in the public directory, just `cd ..`.

#### 5. To make changes to the individual Attorney General prosecutor pages, edit the `templates/attorney-general-profile.handlebars` and `public\attorney-general\_attorney-general-config.json` files

#### 6. If you've made changes to the .handlebars template (see step 5), finalize the process with Gulp

```
gulp handlebars
```

#### 7. After you build and double-check the site, just commit and push

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin master
```

### `gh-pages` branch

#### 8. Once you've updated the `master` branch, `cd ..` (change directories) and fetch the `gh-branch`

```
git clone https://www.github.com/billimarie/light-pollution.git
cd light-pollution
git fetch
git checkout gh-pages
```

#### 9. Now: select all the files inside `\public` from your earlier `master` branch directory. Then, drop them into the new `gh-pages` branch directory

Don't forget to boot up the server to double-check your changes:

```
Python -m SimpleHTTPServer
```

#### 10. When you're good, commit and push

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin gh-pages
```

## Support

Before requesting support, [view all current issues](https://github.com/billimarie/light-pollution/issues).

If you have an unlisted problem, feel free to [open a new issue](https://github.com/billimarie/light-pollution/issues/new).

## Contributing

If you'd like to contribute, please [view the guidelines](https://github.com/billimarie/light-pollution/.github/CONTRIBUTING.md). Feel free to [fork this repo](https://github.com/billimarie/light-pollution#fork-destination-box) and make your changes. [Pull requests are warmly welcome](https://github.com/billimarie/light-pollution/compare).
