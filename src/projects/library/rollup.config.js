const { uglify } = require('rollup-plugin-uglify')
const resolve = require('@rollup/plugin-node-resolve')

export default {
  input: 'dist/browser/index.js',
  plugins: [resolve({ browser: true }), uglify()],
  output: {
    name: 'ComponentTypeName',
    file: 'dist/REPOSITORY_NAME.min.js',
    format: 'umd'
  }
}
