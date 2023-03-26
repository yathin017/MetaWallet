const webpack = require('webpack');
module.exports = {
    // ... your config
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify")
      }
    }
  }