# light-pollution : `gh-pages`

The `gh-pages` branch contains all the code for the official website.

## Installation

### `master` branch

Fetch and update the `master` branch, first:

```
git clone https://www.github.com/billimarie/light-pollution.git
cd light-pollution
git fetch
git checkout master
```

Boot up a simple server in the `/public` directory to see what the site looks like:

```
cd public
Python -m SimpleHTTPServer
```

Navigate to `localhost:8000` in your browser to make sure the site is running.

When you're done updating the code, build out the prosecutor profiles: (Make sure you're in the root. If you're in the public directory: `cd ..`)

```
gulp handlebars
```

Then, commit and push:

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin master
```

### `gh-pages` branch

After you've updated the `master` branch, `cd ..` (change directories) and fetch the `gh-branch`:

```
git clone https://www.github.com/billimarie/light-pollution.git
cd light-pollution
git fetch
git checkout gh-pages
```

Now: select all the files inside `\public` from your earlier `master` branch directory. Then, drop them into the new `gh-pages` branch directory.

Boot up the server to double-check your changes:

```
Python -m SimpleHTTPServer
```

When you're good, commit and push:

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin gh-pages
```
