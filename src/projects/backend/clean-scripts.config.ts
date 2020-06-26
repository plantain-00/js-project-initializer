import { Program } from 'clean-scripts'

const tsFiles = `"src/**/*.ts"`

const tscSrcCommand = 'tsc -p src/'

export default {
  build: [
    'rimraf dist/',
    tscSrcCommand
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    export: `no-unused-export ${tsFiles} --strict --need-module tslib`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src --strict'
  },
  test: [
    new Program('clean-release --config clean-run.config.ts', 30000)
  ],
  fix: `eslint --ext .js,.ts ${tsFiles} --fix`,
  watch: `${tscSrcCommand} --watch`
}
