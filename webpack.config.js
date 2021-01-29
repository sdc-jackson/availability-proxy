const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'client', 'src', 'index.js'),
  output: {
    filename: `bundle_${Date.now()}.js`,
    path: './public'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        use: 'babel-loader'
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'client', 'src', 'index.html')})]
};