const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const resolve = source => path.resolve(__dirname, source);

const sassLoaderOptions = {
  loader: 'sass-loader',
  options: {
    includePaths: [path.resolve(__dirname, 'node_modules')],
    sourceMap: true,
  },
};

const cssLoaders = process.env.NODE_ENV === 'development' ? {
  test: /\.scss$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    sassLoaderOptions,
  ],
} : {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract([
    'css-loader?sourceMap',
    sassLoaderOptions,
  ]),
};

module.exports = {
  entry: ['./src/scss/index.scss', './src/index.js'],
  output: {
    filename: 'app.bundle.js',
    path: resolve('dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      scss: resolve('src/scss'),
      app: resolve('src'),
      $: resolve('node_modules'),
    },
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|jpg|gif|svg|wav|mp3|ogg)$/i,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: [
          'css-loader',
        ],
      },
      cssLoaders,
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
};
