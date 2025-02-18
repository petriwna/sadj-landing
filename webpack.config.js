const path = require('node:path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const envs = dotenv.config();
dotenvExpand.expand(envs);

function getAppSrc() {
  return path.resolve(process.cwd(), 'src');
}

function resolve(filePath, fileName) {
  return path.resolve(getAppSrc(), filePath, fileName);
}

function resolveSrc(relativePath) {
  return path.resolve(__dirname, 'src', relativePath);
}

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const imageInlineSizeLimit = 8192;
const isDevMode = process.env.NODE_ENV !== 'production';
const shouldUseSourceMap = true;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isDevMode && 'style-loader',
    !isDevMode && MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            'postcss-flexbugs-fixes',
            ['postcss-preset-env', { autoprefixer: { flexbox: 'no-2009' }, stage: 3 }],
            'postcss-normalize',
          ],
        },
        sourceMap: shouldUseSourceMap,
      },
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push(
      {
        loader: 'resolve-url-loader',
        options: { sourceMap: shouldUseSourceMap, root: getAppSrc() },
      },
      {
        loader: preProcessor,
        options: { sourceMap: shouldUseSourceMap },
      },
    );
  }

  return loaders;
};

module.exports = {
  mode: isDevMode ? 'development' : 'production',
  entry: {
    main: resolve('js', 'index.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name]-[hash:8].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: 'asset',
            parser: { dataUrlCondition: { maxSize: imageInlineSizeLimit } },
            generator: {
              filename: 'public/images/[name][ext]',
            },
          },
          {
            test: /\.svg$/,
            type: 'asset',
            parser: { dataUrlCondition: { maxSize: imageInlineSizeLimit } },
            generator: {
              filename: 'media/svg/[name].[hash].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: path.resolve(process.cwd(), 'src'),
            loader: require.resolve('babel-loader'),
            options: {
              presets: ['@babel/env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: { mode: 'icss' },
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: { mode: 'local', localIdentName: '[name]__[local]___[hash:base64:5]' },
            }),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: shouldUseSourceMap,
                modules: { mode: 'icss' },
              },
              'sass-loader',
            ),
            sideEffects: true,
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: shouldUseSourceMap,
                modules: { mode: 'local', localIdentName: '[name]__[local]___[hash:base64:5]' },
              },
              'sass-loader',
            ),
          },
          {
            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            type: 'asset/resource',
            generator: {
              filename: 'media/[hash][ext][query]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': dotenv.parsed,
      'process.env.TELEGRAM_BOT_TOKEN': JSON.stringify(process.env.TELEGRAM_BOT_TOKEN),
      'process.env.TELEGRAM_CHAT_ID': JSON.stringify(process.env.TELEGRAM_CHAT_ID),
      'process.env.API': JSON.stringify(process.env.API),
      'process.env.TELEGRAM_BOT_TOKEN_ERROR': JSON.stringify(process.env.TELEGRAM_BOT_TOKEN_ERROR),
      'process.env.TELEGRAM_CHAT_ID_ERROR': JSON.stringify(process.env.TELEGRAM_CHAT_ID_ERROR),
      'process.env.API_ERROR': JSON.stringify(process.env.API_ERROR),
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
      'process.env.AUTH_DOMAIN': JSON.stringify(process.env.AUTH_DOMAIN),
      'process.env.PROJECT_ID': JSON.stringify(process.env.PROJECT_ID),
      'process.env.STORAGE_BUCKET': JSON.stringify(process.env.STORAGE_BUCKET),
      'process.env.MESSAGING_SENDER_ID': JSON.stringify(process.env.MESSAGING_SENDER_ID),
      'process.env.APP_ID': JSON.stringify(process.env.APP_ID),
    }),
    new CleanWebpackPlugin({ verbose: true }),
    !isDevMode && new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: resolveSrc('public/images'), to: 'public/images' },
        { from: resolveSrc('public/favicon'), to: 'public/favicon' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: true,
      inject: 'body',
    }),
    new WebpackManifestPlugin(),
  ].filter(Boolean),
  devtool: 'source-map',
  devServer: {
    hot: true,
    open: ['/'],
    compress: true,
    host: '0.0.0.0',
    port: 3003,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    static: {
      directory: path.join(process.cwd(), 'dist'),
      publicPath: '',
      watch: {
        ignored: getAppSrc(),
      },
    },
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      publicPath: '',
      writeToDisk: true,
    },
  },
};
