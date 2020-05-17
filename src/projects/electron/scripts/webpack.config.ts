import * as webpack from 'webpack'

export default {
  entry: {
    index: './scripts/index'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  }
} as webpack.Configuration
