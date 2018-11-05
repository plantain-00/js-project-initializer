const { executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"src/**/*.ts" "scripts/**/*.ts" "spec/**/*.ts" "static_spec/**/*.ts"`
const jsFiles = `"*.config.js" "scripts/**/*.config.js" "static_spec/**/*.config.js"`
const lessFiles = `"scripts/**/*.less"`

const templateCommand = 'file2variable-cli --config scripts/file2variable.config.js'
const tscScriptsCommand = 'tsc -p scripts/'
const webpackCommand = 'webpack --config scripts/webpack.config.js'
const cssCommand = [
  'lessc scripts/index.less > scripts/index.css',
  'postcss scripts/index.css -o scripts/index.postcss.css',
  'cleancss -o scripts/index.bundle.css scripts/index.postcss.css'
]

module.exports = {
  build: {
    back: 'tsc',
    front: {
      js: [
        templateCommand,
        tscScriptsCommand,
        webpackCommand
      ],
      css: cssCommand
    }
  },
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles}`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p .',
    typeCoverageStatic: 'type-coverage -p static'
  },
  test: {
    jasmine: [
      'tsc -p spec',
      'jasmine'
    ],
    karma: [
      'tsc -p static_spec',
      'karma start static_spec/karma.config.js'
    ]
  },
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    template: `${templateCommand} --watch`,
    script: `${tscScriptsCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    less: () => watch(['scripts/**/*.less'], [], () => executeScriptAsync(cssCommand))
  }
}
