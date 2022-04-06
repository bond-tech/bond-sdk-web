const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    'bond-sdk-web': [
      path.resolve(__dirname, "./src/show.js"),
      path.resolve(__dirname, "./src/collect.js"),
      path.resolve(__dirname, "./src/bond-sdk-web.ts"),
    ]
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
    new webpack.EnvironmentPlugin(['IDENTITY','AUTHORIZATION']),
    new CleanWebpackPlugin(),
    // Only update what has changed on hot reload
  ],
};
