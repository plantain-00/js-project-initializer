import { uglify } from 'rollup-plugin-uglify'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

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
