import { executeScriptAsync } from 'clean-scripts'
import { watch } from 'watch-then-execute'

const tsFiles = `"src/**/*.ts" "scripts/**/*.ts"`
const lessFiles = `"scripts/**/*.less"`

const webpackCommand = 'webpack --config scripts/webpack.config.ts'
const cssCommand = [
  'lessc scripts/index.less > scripts/index.css',
  'postcss scripts/index.css -o scripts/index.postcss.css',
  'cleancss -o scripts/index.bundle.css scripts/index.postcss.css'
]

export default {
  build: {
    back: 'tsc',
    front: {
      js: webpackCommand,
      css: cssCommand
    }
  },
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles} --strict --need-module tslib`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p . --strict',
    typeCoverageStatic: 'type-coverage -p static --strict --ignore-files "static/variables.ts"'
  },
  test: {},
  fix: {
    ts: `eslint --ext .js,.ts ${tsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    template: `${templateCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    less: () => watch(['scripts/**/*.less'], [], () => executeScriptAsync(cssCommand))
  }
}
