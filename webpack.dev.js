const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

  entry: {
    "bond-sdk-web": [
      path.resolve(__dirname, "./src/show.js"),
      path.resolve(__dirname, "./src/collect.js"),
      path.resolve(__dirname, "./src/bond-sdk-web.ts"),
    ],
    'link-account': path.resolve(__dirname, './src/link-account.ts'),
    'oauth-redirect': path.resolve(__dirname, './src/oauth-redirect.ts'),
    'micro-deposit': path.resolve(__dirname, './src/micro-deposit.ts'),
    'delete-account': path.resolve(__dirname, './src/delete-account.ts'),
    index: path.resolve(__dirname, "./src/sample-card-show.ts"),
    multiple: path.resolve(__dirname, "./src/sample-card-show-multiple.ts"),
    pin: path.resolve(__dirname, "./src/sample-pin-setting.ts"),
    copy: path.resolve(__dirname, "./src/sample-card-copy.ts"),
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

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

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

      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" }
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // { test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  mode: "development",
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "./dist"),
    publicPath: "/",
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  plugins: [
    new webpack.EnvironmentPlugin(['IDENTITY','AUTHORIZATION']),
    new CleanWebpackPlugin(),
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "src", "sample.css"),
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/sample_card_show.html"),
      inject: true,
      chunks: ["bond-sdk-web", "index"],
      filename: "index.html", // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/sample_card_show_multiple.html"),
      inject: true,
      chunks: ["bond-sdk-web", "multiple"],
      filename: "sample_card_show_multiple.html", // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/sample_pin_setting.html"),
      inject: true,
      chunks: ["bond-sdk-web", "pin"],
      filename: "sample_pin_setting.html", // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/sample_card_copy.html"),
      inject: true,
      chunks: ["bond-sdk-web", "copy"],
      filename: "sample_card_copy.html", // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/link-account.html'),
      inject: true,
      chunks: ['bond-sdk-web', 'link-account'],
      filename: 'link-account.html', // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/oauth-redirect.html'),
      inject: true,
      chunks: ['bond-sdk-web', 'oauth-redirect'],
      filename: 'oauth-redirect.html', // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/micro-deposit.html'),
      inject: true,
      chunks: ['bond-sdk-web', 'micro-deposit'],
      filename: 'micro-deposit.html', // output file
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/delete-account.html'),
      inject: true,
      chunks: ['bond-sdk-web', 'delete-account'],
      filename: 'delete-account.html', // output file
    }),
  ],
};
