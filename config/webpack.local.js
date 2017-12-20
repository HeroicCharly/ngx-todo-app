const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cwd = process.cwd();

module.exports = webpackMerge(commonConfig, {
  devServer: {
    contentBase: path.resolve(cwd, 'src'),
    compress: true,
    inline: true,
    open: true,
    hot: true,
    publicPath: '/',
    quiet: true,
    historyApiFallback: true,
    stats: {
      chunks: false,
      chunkModules: false
    }
  },

  devtool: 'source-map',

  output: {
    path: path.resolve(cwd, 'wwwroot'),
    filename: 'js/[name].js',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css')
  ]
});
