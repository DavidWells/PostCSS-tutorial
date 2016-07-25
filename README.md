# Install the create-react-app CLI
```
npm install -g create-react-app
```

# Create the app with create-react-app CLI
```bash
# create with create-react-app PROJECT_NAME
create-react-app postcss-example
# change into the postcss-example directory
cd postcss-example
# eject the app to expose dependancies and configuration files
npm run eject
```

# Hook up CSS modules
```
// change: webpack.config.dev.js
{
   test: /\.css$/,
   include: srcPath,
   loader: 'style!css!postcss'
},
// to:
{
  test: /\.css$/,
  include: srcPath,
  loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&camelCase!postcss'
},
```

Breaking it down:

`style` is loading the [style-loader](https://github.com/webpack/style-loader)

`!css` is loading the [style-loader](https://github.com/webpack/css-loader). The `!` is how loaders can be chained together

`?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&camelCase`

There is a lot to digest here. Let's break it down piece by piece.

`modules` turns on [css modules](https://github.com/css-modules/css-modules)

`importLoaders=1` The query parameter importLoaders allow to configure which loaders should be applied to @imported resources.

`localIdentName` is the localization format of the CSS class. We are using the format `[name]__[local]___[hash:base64:5]` which is the `FileName__LocalClassName__12345`

`&camelCase` sets the option to convert dash cased class names like `my-class-name` to be `myClassName` in your javascript

# Install Your PostCSS dependancies

I recommend using:

```bash
npm i autoprefixer postcss-initial postcss-import postcss-mixins postcss-nested postcss-simple-vars postcss-math postcss-color-function --save-dev
```

# Now setup a postCSS config file:

Inside `/config` folder create a postcss.config.js file
```
var postCSSConfig = [
/* autoprefix for different browser vendors */
require('autoprefixer'),
/* reset inherited rules */
require('postcss-initial')({
  reset: 'inherited' // reset only inherited rules
}),
/* enable css @imports like Sass/Less */
require('postcss-import'),
/* enable mixins like Sass/Less */
require('postcss-mixins')({
  mixins: require('../src/mixins')
}),
/* enable nested css selectors like Sass/Less */
require('postcss-nested'),
/* require global variables */
require('postcss-simple-vars')({
  variables: function variables() {
    return require('../src/variables')
  },
  unknown: function unknown(node, name, result) {
    node.warn(result, 'Unknown variable ' + name)
  }
}),
/* PostCSS plugin for making calculations with math.js  */
require('postcss-math'),
/* transform W3C CSS color function to more compatible CSS. */
require('postcss-color-function')
]

// Export the PostCSS Config for usage in webpack
module.exports = postCSSConfig;
```

Also create `variables.js` and `mixins.js` in your config folder

```js
// src/mixins.js
var globalMixins = {
  /* noSelect is a static mixin  */
  noSelect: {
    '-webkit-touch-callout': 'none',
    '-webkit-user-select': 'none',
    '-khtml-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    'user-select': 'none'
  },
  /* OpenSans is a dynamic mixin  */
  OpenSans: function (obj, value) {
    return {
      'font-family': 'Open Sans, sans-serif',
      'font-style': 'normal',
      'font-size': value,
      'font-weight': 200,
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale'
    }
  }
}
module.exports = globalMixins
```

```js
// src/variables.js
var globalVariable = {
  primary: 'blue'
}
module.exports = globalVariable
```

# Now import the PostCSS config file into your webpack.config

```js
// in /config/webpack.config.dev.js
/* import postcss config array */
var postCSSConfig = require('./postcss.config')

// in the webpack config add the postCSS Config Array.
module.exports = {
  entry: [...],
  output: {...},
  resolve: { extensions: [...] },
  resolveLoader: {...},
  module: { loaders: [...] },
  // Add postcss to webpack config object
  postcss: function() {
    return postCSSConfig;
  },
  plugins: [...]
}
```

# Usage:

## Using ClassNames

```
import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}
```

## Variables + Mixins

You can now use the global mixins and variables!

Now in `/src/App.css`

```css
/* in /src/App.css */
.intro {
  color: $primary; /* variable usage */
  @mixin noSelect; /* mixin usage */
  @mixin OpenSans 30px; /* mixin with value usage */
}
```

# Profit

