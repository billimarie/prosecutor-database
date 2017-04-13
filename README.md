# light-pollution : `gh-pages`

The `gh-pages` branch contains all the code for the [website](https://billimarie.github.io/light-pollution). It houses all the `/public` directory content (found on the `master` branch).

## Installation

For detailed installation instructions, visit the [wiki](https://github.com/billimarie/light-pollution/wiki) or [`master` README.md](https://github.com/billimarie/light-pollution/blob/master/README.md).

1. Fetch and update the `master` branch:

```
git clone https://www.github.com/billimarie/light-pollution.git
cd light-pollution
git fetch
git checkout master
```

2. Update the code. To view your changes to the site, boot up a simple server in the `/public` directory then navigate to `localhost:8000` in your browser:

```
cd public
Python -m SimpleHTTPServer
```

3. When you're done updating the code, build out the prosecutor profiles.

HINT: make sure you're in the root, where `gulpfile.js` is located.

```
gulp handlebars
```

4. Then, commit and push:

```
git add .
git commit -m "[INSERT YOUR COMMIT MESSAGE HERE (for example: Update index.html: new title)]"
git push origin master
```

Once your pull request is accepted, [@billimarie](https://www.github.com/billimarie) will merge your files with the Github Pages branch (`gh-pages`).
