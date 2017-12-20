const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');

const cwd = process.cwd();

const GLOBALS = {
  'process.env.ENV': JSON.stringify('Production')
};

module.exports = webpackMerge(commonConfig, {
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      comments: false,
      compress: {
        drop_console: true,
      },
      mangle: {
        keep_fnames: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    }),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin('[name].[contenthash].css'),
  ]
});
