/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mode: 'development',
  entry: {
    home: './src/scripts/pages/home.js',
    // Ajouter les pages ici si necessaire
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // new ESLintPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: path.join(__dirname, './public'),
    hot: true,
  },
};
