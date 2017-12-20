const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.ASPNETCORE_ENVIRONMENT || 'Production';

const cwd = process.cwd();

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: ENV.toLowerCase() === 'local',
});

module.exports = {
  entry: {
    polyfills: path.resolve(cwd, 'src', 'polyfills.ts'),
    vendor: path.resolve(cwd, 'src', 'vendor.ts'),
    app: path.resolve(cwd, 'src', 'main.ts'),
  },

  output: {
    path: path.resolve(cwd, 'wwwroot'),
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve(cwd, 'src'),
      path.resolve(cwd, 'src', 'assets'),
      path.resolve(cwd, 'node_modules'),
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: path.resolve(cwd, 'node_modules'),
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: path.resolve(cwd, 'tslint.json'),
              tsconfigFile: path.resolve(cwd, 'src', 'tsconfig.json'),
              failOnHint: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        loaders: [
          'angular2-template-loader',
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: path.resolve(cwd, 'src', 'tsconfig.json') },
          },
          'angular-router-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|ico)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash].[ext]',
            },
          },
        ],
      },
      {},
      {
        test: /\.(svg|woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: [path.resolve(cwd, 'src', 'app')],
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        include: [path.resolve(cwd, 'src', 'app')],
        loader: extractSass.extract({
          use: [
            'to-string-loader',
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'compressed',
              },
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(cwd, './src'), // location of your src
      {} // a map of your routes
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills'],
    }),

    new ProgressBarPlugin({
      format:
        chalk.magenta.bold('Building') +
        ' [' +
        chalk.green(':bar') +
        '] ' +
        chalk.green.bold(':percent') +
        ' ' +
        chalk.yellow.bold(':elapsed seconds') +
        ' ' +
        chalk.white(':msg'),
      clear: false,
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(cwd, 'src', 'index.html'),
    }),
  ],
};
