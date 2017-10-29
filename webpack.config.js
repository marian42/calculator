const path = require('path');

module.exports = {
  entry: './build/script.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'script.js'
  }
};
