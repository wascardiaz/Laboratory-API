const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssStractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./client/app.js",
  output: {
    path: path.join(__dirname, "server/public"),
    filename: "js/bundle.js",
  },

  mode: devMode ? "development" : "production",

  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          devMode ? "style-loader" : MiniCssStractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),

    new MiniCssStractPlugin({
      filename: "css/bundle.css",
    }),
  ],

  devtool: "source-map",
};
