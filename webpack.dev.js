const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const webpack = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  entry: {
    hot: 'webpack/hot/dev-server.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    compress: true,
    hot: true,
    watchFiles: path.join(__dirname, 'src'),
  },
  optimization: {
    runtimeChunk: 'single',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin(),
  ],
});
