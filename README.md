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
  mixins: require('./mixins')
}),
/* enable nested css selectors like Sass/Less */
require('postcss-nested'),
/* require global variables */
require('postcss-simple-vars')({
  variables: function variables() {
    return require('./variables')
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
// mixins.js
var globalMixins = {
  OpenSans: {
    'font-family': 'Open Sans, sans-serif',
    'font-style': 'normal',
    'font-weight': 200,
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale'
  }
}
module.exports = globalMixins
```

```js
// variables.js
var globalVariable = {
  primary: 'blue'
}
module.exports = globalVariable
```

# Now import the PostCSS config file into your webpack.config

```
// in /config/webpack.config.dev.js
var postCSSConfig = require('../config/postcss.config')

// in the webpack config add the postCSS Config Array.
postcss: function() {
  return postCSSConfig;
},
```

# Now in `/src/App.css`

You can now use the global mixins and variables!

```
.App {
  text-align: center;
  background: $primary;
  @mixin OpenSans;
}
```

