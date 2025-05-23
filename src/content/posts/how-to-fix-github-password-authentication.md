---
title: 'How to Fix GitHub Actions: Support for password authentication was removed'
description: 'Linking private repos as npm dependencies the proper way'
pubDate: 2022-08-01
tags: ['ops']
---

Today the GitHub PAT (_personal access token_) expired in [one of my projects](https://tweak-extension.com), I literally waked up to this:

```
npm ERR! code 128
npm ERR! An unknown git error occurred
npm ERR! command git --no-replace-objects ls-remote https://***@github.com/org/my-dep.git
npm ERR! remote: Support for password authentication was removed on August 13, 2021.
npm ERR! remote: Please see https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
npm ERR! fatal: Authentication failed for 'https://github.com/org/my-dep.git/'

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/runner/.npm/_logs/2022-08-01T16_02_11_768Z-debug-0.log
Error: Process completed with exit code 128.
```

<br />
<br />
(╯°□°)╯︵ ┻━┻
<br />
<br />

It happens that GitHub dropped the support to pass along the password to auth on private repos, which is part of my workflow, because I link npm dependencies with `git+https` schema, in my `package.json`.

```json
// package.json
"dependencies": {
  // ...
  "my-dep": "git+https://<PAT_TOKEN_GOES_HERE>@github.com/org/my-dep.git#3b3b3371d24b31d18bfef6296635df37f7131925",
  // ...
```

> 💡 `#3b3b3371d24b31d18bfef6296635df37f7131925` targets a specific commit.

Well for some reason this was not working anymore, that's somewhat good, because I had my PAT hardcoded right there 🤠

## Let's fix it!

The proper way to this, which also addresses the issue I've posted initially, is the following.

1. First [create a new PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) - ideally with minimum amount of scopes.
2. Now you have your PAT you'll have to make it accessible to whatever repo where you will use the token in its GitHub action. Add this to the [repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
3. Great, now my tricky work around. Because I can only install this via GitHub (_limited infra available to manage packages_), I add my target dependency under `optionalDependencies` rather than `dependencies` in the `package.json`. This means we will use `npm install --no-optional` in our CI in order to skip the dependency that needs auth to download the package from a private repo.

```json
"optionalDependencies": {
  "my-dep": "git+https://github.com/org/my-dep.git#3b3b3371d24b31d18bfef6296635df37f7131925"
},
```

4. Now **in your GitHub action add the additional** steps.

```yml
  - run: npm install --no-optional
  - run: npm install git+https://$TOKEN@github.com/org/my-dep.git#3b3b3371d24b31d18bfef6296635df37f7131925
  env:
    TOKEN: ${{ secrets.MY_PAT_SECRET }}
```

> 💡 `MY_PAT_SECRET` needs to match the secret name you added in GitHub.

Hope this workaround helps you as it helped me!
