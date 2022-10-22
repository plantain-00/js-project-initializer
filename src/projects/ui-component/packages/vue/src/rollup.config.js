const { uglify } = require('rollup-plugin-uglify')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')

export default {
  input: 'packages/vue/dist/index.js',
  plugins: [
    resolve({ browser: true }),
    uglify(),
    commonjs()
  ],
  output: {
    name: 'ComponentTypeName',
    file: 'packages/vue/dist/COMPONENT_SHORT_NAME-vue-component.min.js',
    format: 'umd'
  },
  external: [
    'vue',
  ]
}
