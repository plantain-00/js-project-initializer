import { checkGitStatus } from 'clean-scripts'

const tsFiles = `"src/**/*.ts"`

export default {
  build: [
    'rimraf dist/',
    'file2variable-cli --config file2variable.config.ts',
    'tsc -p src'
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    export: `no-unused-export ${tsFiles} --strict --need-module tslib --exclude "src/projects/**/*.ts"`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src --strict --ignore-files "**/projects/**/*"'
  },
  test: [
    () => checkGitStatus()
  ],
  fix: `eslint --ext .js,.ts ${tsFiles} --fix`
}
