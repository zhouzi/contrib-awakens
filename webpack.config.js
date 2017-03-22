const path = require('path');

module.exports = {
  entry: {
    content: './src/extension/content.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
};
