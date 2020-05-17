import * as webpack from 'webpack'

export default {
  mode: process.env.NODE_ENV,
  entry: './packages/react/demo/index',
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
    filename: 'index.bundle.js'
  }
} as webpack.Configuration
