import { executeScriptAsync, Program } from 'clean-scripts'
import { watch } from 'watch-then-execute'

const tsFiles = `"src/**/*.ts" "static/**/*.ts"`
const lessFiles = `"static/**/*.less"`

const tscSrcCommand = 'tsc -p src/'
const webpackCommand = 'webpack --config static/webpack.config.ts'
const revStaticCommand = 'rev-static --config static/rev-static.config.ts'
const cssCommand = [
  'lessc static/index.less > static/index.css',
  'postcss static/index.css -o static/index.postcss.css',
  'cleancss -o static/index.bundle.css static/index.postcss.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css'
]

export default {
  build: {
    back: [
      'rimraf dist/',
      tscSrcCommand
    ],
    front: [
      {
        js: webpackCommand,
        css: cssCommand,
        clean: 'rimraf static/**/*.bundle-*.js static/**/*.bundle-*.css'
      },
      revStaticCommand
    ]
  },
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export "src/**/*.ts" --strict --need-module tslib`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src --strict',
    typeCoverageStatic: 'type-coverage -p static --strict --ignore-files "static/variables.ts"'
  },
  test: {
    start: new Program('clean-release --config clean-run.config.js', 30000)
  },
  fix: {
    ts: `eslint --ext .js,.ts ${tsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    back: `${tscSrcCommand} --watch`,
    template: `${file2variableCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    less: () => watch(['static/**/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revStaticCommand} --watch`
  }
}
