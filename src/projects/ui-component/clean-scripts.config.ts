import { executeScriptAsync } from 'clean-scripts'
import { watch } from 'watch-then-execute'

const tsFiles = `"packages/@(core|vue|react)/@(src|demo)/**/*.@(ts|tsx)"`
const lessFiles = `"packages/core/src/**/*.less"`

const vueTemplateCommand = `file2variable-cli --config packages/vue/src/file2variable.config.ts`

const tscCoreSrcCommand = `tsc -p packages/core/src`
const tscVueSrcCommand = `tsc -p packages/vue/src`
const tscReactSrcCommand = `tsc -p packages/react/src`

const webpackVueCommand = `webpack --config packages/vue/demo/webpack.config.ts`
const webpackReactCommand = `webpack --config packages/react/demo/webpack.config.ts`

const revStaticCommand = `rev-static --config rev-static.config.ts`
const cssCommand = [
  `lessc packages/core/src/index.less --math=strict > packages/core/src/index.css`,
  `postcss packages/core/src/index.css -o packages/core/dist/COMPONENT_SHORT_NAME.css`,
  `cleancss packages/core/dist/COMPONENT_SHORT_NAME.css -o packages/core/dist/COMPONENT_SHORT_NAME.min.css`,
  `cleancss packages/core/dist/COMPONENT_SHORT_NAME.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css -o packages/core/demo/index.bundle.css`
]

const isDev = process.env.NODE_ENV === 'development'

export default {
  build: [
    {
      js: [
        tscCoreSrcCommand,
        {
          vue: [
            vueTemplateCommand,
            tscVueSrcCommand,
            isDev ? undefined : `rollup --config packages/vue/src/rollup.config.js`,
            webpackVueCommand
          ],
          react: [
            tscReactSrcCommand,
            isDev ? undefined : `rollup --config packages/react/src/rollup.config.js`,
            webpackReactCommand
          ]
        }
      ],
      css: cssCommand,
      clean: `rimraf "packages/@(core|vue|react)/demo/**/@(*.bundle-*.js|*.bundle-*.css)"`
    },
    revStaticCommand
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    less: `stylelint ${lessFiles}`,
    // export: `no-unused-export ${tsFiles} ${lessFiles} --exclude ${excludeTsFiles} --strict --need-module tslib`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'lerna exec -- type-coverage -p src --strict'
  },
  test: [],
  fix: {
    ts: `eslint --ext .js,.ts ${tsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    vueTemplateCommand: `${vueTemplateCommand} --watch`,
    tscCoreSrcCommand: `${tscCoreSrcCommand} --watch`,
    tscVueSrcCommand: `${tscVueSrcCommand} --watch`,
    tscReactSrcCommand: `${tscReactSrcCommand} --watch`,
    webpackVueCommand: `${webpackVueCommand} --watch`,
    webpackReactCommand: `${webpackReactCommand} --watch`,
    less: () => watch(['src/**/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revStaticCommand} --watch`
  }
}
