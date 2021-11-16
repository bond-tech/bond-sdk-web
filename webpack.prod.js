var webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    "bond-sdk-cards": [
      path.resolve(__dirname, "./src/show.js"),
      path.resolve(__dirname, "./src/collect.js"),
      path.resolve(__dirname, "./src/bond-sdk-cards.ts"),
    ],
    "bond-sdk-external-accounts": path.resolve(__dirname, './src/bond-sdk-external-accounts.ts'),
    "index": path.resolve(__dirname, "./src/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath: "./",
    library: "BondCards",
    libraryTarget: "umd",
    globalObject: "this",
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      { test: /\.tsx?$/, loader: "ts-loader" }
    ],
  },
  mode: "production",
  plugins: [
    new CleanWebpackPlugin(),
    // Only update what has changed on hot reload
  ],
};
