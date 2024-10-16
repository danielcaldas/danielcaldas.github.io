---
title: Better imports with webpack resolve.alias
pubDate: 2020-01-10
tags: ['javascript', 'webpack']
description: 'Better imports with webpack resolve.alias'
---

I want to write a short article where once more I emphasize one of the superpowers of <a href="https://webpack.js.org/" target="_blank" title="bundle your scripts">webpack</a>.

Have you ever came across this in some of your project's codebase(s)?

```javascript
import { powerUtility } from '../../../../common/utils'
```

Wouldn't it be pleasing to refer to a top-level module/namespace in any place you need to import something?

```javascript
import { powerUtility } from '@project-x-utils'
```

With webpack, having something like that, it's very straightforward. Aliasing module names for shorter and clear import statements have considerable gains in terms of codebase discoverability, codebase navigation, and of course, general readability. Aliasing modules is especially helpful for large codebases organized in modules.

Aliasing modules is as simple as using <a href="https://webpack.js.org/configuration/resolve/" target="_blank" title="webpack options that change how modules are resolved">webpack _Resolve_ configurations</a>, more precisely <a href="https://webpack.js.org/configuration/resolve/#resolvealias" target="_blank" title="webpack aliases to import or require certain modules more easily">resolve.alias</a>. To follow up on the previous example, here is how your `webpack.config.js` file should look like if you want to be able to import your _utils_ module as displayed above.

```javascript
const webpack = require('webpack')
// ...

const options = {
  entry: {
    // ...
  },
  output: {
    // ...
  },
  module: {
    // ...
  },
  resolve: {
    alias: {
      // Note: 'src/common/utils' is the path to the module, in this case "utils"
      '@project-x-utils': path.resolve(__dirname, 'src/common/utils'),
      // ...
    },
  },
  plugins: [
    // ...
  ],
}

module.exports = options
```

Now you can go ahead and remove all those 100 characters long relative imports at the beginning of your JavaScript files.
