var path = require('path');

module.exports = {
  entry: './src/js/scripts.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'assets', 'js'),
  },
  devServer: {
    publicPath: '/assets/js/'
  },
  mode: 'production'
};
