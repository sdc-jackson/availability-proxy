const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: path.resolve(__dirname, 'client', 'src', 'index.js'),
  output: {
    filename: `bundle_${Date.now()}.js`,
    path: path.resolve(__dirname, 'public')
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
  plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'client', 'src', 'index.html')})],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};