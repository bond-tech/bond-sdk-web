const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    "bond-sdk-cards": [
      path.resolve(__dirname, "./src/show.js"),
      path.resolve(__dirname, "./src/collect.js"),
      path.resolve(__dirname, "./src/bond-sdk-cards.ts"),
    ],
    "bond-sdk-external-accounts": path.resolve(__dirname, './src/bond-sdk-external-accounts.ts'),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath: "./",
    library: "BondWeb",
    libraryTarget: "umd",
    globalObject: "this",
  },

  resolve: {
    extensions: ['.ts', '.js']
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
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.prod.json",
        },
      }
    ],
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "src", "bond-sdk-web.js"),
      ],
    }),
    // Only update what has changed on hot reload
  ],
};
