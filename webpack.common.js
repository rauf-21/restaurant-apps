const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const ImageminSvgo = require('imagemin-svgo');
const ImageminWebp = require('imagemin-webp-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                minimize: true,
                includePaths: [path.resolve(__dirname, 'node_modules')],
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
      jsExtension: '.gz',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
        {
          from: path.resolve(__dirname, 'netlify.toml'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, 'src/public/icons/logo.svg'),
      logoMaskable: path.resolve(
        __dirname,
        'src/public/icons/maskable-logo.png'
      ),
      mode: 'webapp',
      favicons: {
        appName: 'RestaurAnt',
        appShortName: 'RestaurAnt',
        appDescription: 'Find the best restaurant near you',
        background: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        manifestMaskable: true,
        preferRelatedApplications: true,
        relatedApplications: {
          id: 'restaurants-app-pwa-1',
        },
      },
    }),
    new ImageminWebpackPlugin({
      plugins: [
        ImageminMozjpeg({
          quality: 60,
          progressive: true,
        }),
        ImageminSvgo({
          quality: 50,
          progressive: true,
        }),
      ],
    }),
    new ImageminWebp(),
  ],
};
