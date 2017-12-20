const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();

module.exports = {
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve(cwd, 'src'),
      path.resolve(cwd, 'src', 'assets'),
      path.resolve(cwd, 'node_modules')
    ]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['angular2-template-loader', {
          loader: 'awesome-typescript-loader',
          options: { configFileName: path.resolve(cwd, 'src', 'tsconfig.json') }
        }]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null-loader'
      },
      {
        test: /\.scss$/,
        exclude: path.resolve(cwd, 'src', 'app'),
        loader: 'null-loader'
      },
      {
        test: /\.scss$/,
        include: path.resolve(cwd, 'src', 'app'),
        use: ['to-string-loader', 'resolve-url-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(cwd, './src'), // location of your src
      {} // a map of your routes
    )
  ]
}
