import { Program } from 'clean-scripts'

const tsFiles = `"src/**/*.ts" "spec/**/*.ts" "test/**/*.ts"`
const jsFiles = `"*.config.js"`

const tscSrcCommand = 'tsc -p src/'

module.exports = {
  build: [
    'rimraf dist/',
    tscSrcCommand
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles} ${jsFiles}`,
    export: `no-unused-export ${tsFiles} --strict`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src --strict'
  },
  test: [
    'tsc -p spec',
    'jasmine',
    new Program('clean-release --config clean-run.config.js', 30000)
  ],
  fix: `eslint --ext .js,.ts ${tsFiles} ${jsFiles} --fix`,
  watch: `${tscSrcCommand} --watch`
}
