const path = require('path');

module.exports = {
  entry: './src/js/scripts.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'assets', 'js')
  },
  mode: 'production'
};
