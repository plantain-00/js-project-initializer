import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/index.js',
  name: 'ComponentTypeName',
  plugins: [resolve(), uglify()],
  output: {
    file: 'dist/ComponentTypeName.min.js',
    format: 'umd'
  }
}
