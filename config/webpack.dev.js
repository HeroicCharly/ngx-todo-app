const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cwd = process.cwd();

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: path.resolve(cwd, 'wwwroot'),
    filename: 'js/[name].[chunkhash].js',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },

  plugins: [
    new ExtractTextPlugin('[name].[contenthash].css')
  ]
});
