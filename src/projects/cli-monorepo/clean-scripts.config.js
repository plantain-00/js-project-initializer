const tsFiles = `"packages/**/src/**/*.ts" "spec/**/*.ts"`
const jsFiles = `"*.config.js"`

module.exports = {
  build: [
    'rimraf packages/core/dist/',
    'tsc -p packages/core/src/',
    'rimraf packages/cli/dist/',
    'tsc -p packages/cli/src/',
    'node packages/cli/dist/index.js --supressError > spec/result.txt'
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles} ${jsFiles}`,
    export: `no-unused-export ${tsFiles} --need-module tslib --strict`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`
  },
  test: [
    'tsc -p spec',
    'jasmine'
  ],
  fix: `eslint --ext .js,.ts ${tsFiles} ${jsFiles} --fix`
}
