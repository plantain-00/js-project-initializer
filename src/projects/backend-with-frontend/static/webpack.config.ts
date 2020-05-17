import * as webpack from 'webpack'

export default {
  mode: process.env.NODE_ENV || 'production',
  entry: {
    index: './static/index'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: [
    { test: /\.tsx?$/, loader: 'ts-loader' }
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
} as webpack.Configuration
