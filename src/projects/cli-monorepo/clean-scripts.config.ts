const tsFiles = `"packages/**/src/**/*.ts"`
const jsFiles = `"*.config.js"`

export default {
  build: [
    'rimraf packages/core/dist/',
    'tsc -p packages/core/src/',
    'rimraf packages/cli/dist/',
    'tsc -p packages/cli/src/',
    'node packages/cli/dist/index.js --supressError > spec/result.txt'
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles} ${jsFiles}`,
    export: `no-unused-export ${tsFiles} --need-module tslib --strict --need-module tslib`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`
  },
  test: [],
  fix: `eslint --ext .js,.ts ${tsFiles} ${jsFiles} --fix`
}
