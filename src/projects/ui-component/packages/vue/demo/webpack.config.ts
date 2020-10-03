import * as webpack from 'webpack'

export default {
  mode: process.env.NODE_ENV,
  entry: './packages/vue/demo/index',
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
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js'
    }
  }
} as webpack.Configuration
