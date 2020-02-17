import * as libs from './libs'
import * as variables from './variables'

export async function runUIComponent(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.uiComponentGitignore)
  await libs.appendFile('.editorconfig', variables.uiComponentEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.uiComponentTsconfigBaseJson)
  await libs.appendFile('tsconfig.eslint.json', variables.uiComponentTsconfigEslintJson)

  await libs.exec(`yarn add -DE github-fork-ribbon-css`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE rev-static`)
  await libs.exec(`yarn add -DE webpack webpack-cli`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE watch-then-execute`)
  await libs.exec(`yarn add -DE http-server`)
  await libs.exec(`yarn add -DE puppeteer @types/puppeteer`)
  await libs.exec(`yarn add -DE autoprefixer postcss-cli`)
  await libs.exec(`yarn add -DE react-test-renderer @types/react-test-renderer react vue-test-utils`)
  await libs.exec(`yarn add -DE rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve rollup-plugin-uglify`)
  await libs.exec(`yarn add -DE cross-env`)
  await libs.exec(`yarn add -DE type-coverage`)

  await libs.exec(`lerna init`)

  await libs.mkdir('packages/core/demo/')
  await libs.writeFile(`packages/core/demo/index.ts`, variables.uiComponentPackagesCoreDemoIndexTs)
  await libs.writeFile(`packages/core/demo/tsconfig.json`, variables.uiComponentPackagesCoreDemoTsconfigJson)

  await libs.mkdir('packages/core/src/')
  await libs.writeFile(`packages/core/src/index.less`, variables.uiComponentPackagesCoreSrcIndexLess.replace(/componentShortName/g, context.componentShortName))
  await libs.writeFile(`packages/core/src/index.ts`, variables.uiComponentPackagesCoreSrcIndexTs.replace(/componentTypeNameData/g, context.componentTypeName))
  await libs.writeFile(`packages/core/src/tsconfig.json`, variables.uiComponentPackagesCoreSrcTsconfigJson)

  await libs.writeFile(`packages/core/README.md`, variables.uiComponentPackagesCoreReadmeMd
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/core/package.json`, variables.uiComponentPackagesCorePackageJson
    .replace(/repository-name/g, context.repositoryName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR_NAME/g, context.authorName)
    .replace(/AUTHOR/g, context.author))

  await libs.mkdir('packages/react/demo/')
  await libs.writeFile(`packages/react/demo/index.ejs.html`, variables.uiComponentPackagesReactDemoIndexEjsHtml)
  await libs.writeFile(`packages/react/demo/index.tsx`, variables.uiComponentPackagesReactDemoIndexTsx
    .replace(/componentTypeName/g, context.componentTypeName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/react/demo/tsconfig.json`, variables.uiComponentPackagesReactDemoTsconfigJson)
  await libs.writeFile(`packages/react/demo/webpack.config.js`, variables.uiComponentPackagesReactDemoWebpackConfigJs)

  await libs.mkdir('packages/react/src/')
  await libs.writeFile(`packages/react/src/index.tsx`, variables.uiComponentPackagesReactSrcIndexTsx
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/ComponentTypeName/g, context.componentTypeName)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
  await libs.writeFile(`packages/react/src/tsconfig.json`, variables.uiComponentPackagesReactSrcTsconfigJson)
  await libs.writeFile(`packages/react/src/rollup.config.js`, variables.uiComponentPackagesReactSrcRollupConfigJs
    .replace(/ComponentTypeName/g, context.componentTypeName)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))

  await libs.writeFile(`packages/react/README.md`, variables.uiComponentPackagesReactReadmeMd
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/react/package.json`, variables.uiComponentPackagesReactPackageJson
    .replace(/component-short-name/g, context.componentShortName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))

  await libs.mkdir('packages/vue/demo/')
  await libs.writeFile(`packages/vue/demo/index.ejs.html`, variables.uiComponentPackagesVueDemoIndexEjsHtml)
  await libs.writeFile(`packages/vue/demo/index.ts`, variables.uiComponentPackagesVueDemoIndexTs
    .replace(/componentTypeName/g, context.componentTypeName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPSOTIRY_NAME/g, context.repositoryName)
    .replace(/componentShortName/g, context.componentShortName))
  await libs.writeFile(`packages/vue/demo/tsconfig.json`, variables.uiComponentPackagesVueDemoTsconfigJson)
  await libs.writeFile(`packages/vue/demo/webpack.config.js`, variables.uiComponentPackagesVueDemoWebpackConfigJs)

  await libs.mkdir('packages/vue/src/')
  await libs.writeFile(`packages/vue/src/index.template.html`, variables.uiComponentPackagesVueSrcIndexTemplateHtml)
  await libs.writeFile(`packages/vue/src/index.ts`, variables.uiComponentPackagesVueSrcIndexTs
    .replace(/ComponentTypeName/g, context.componentTypeName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/vue/src/tsconfig.json`, variables.uiComponentPackagesVueSrcTsconfigJson)
  await libs.writeFile(`packages/vue/src/file2variable.config.js`, variables.uiComponentPackagesVueSrcFile2VariableConfigJs
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))
  await libs.writeFile(`packages/vue/src/rollup.config.js`, variables.uiComponentPackagesVueSrcRollupConfigJs
    .replace(/ComponentTypeName/g, context.componentTypeName)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))

  await libs.writeFile(`packages/vue/README.md`, variables.uiComponentPackagesVueReadmeMd
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/vue/package.json`, variables.uiComponentPackagesVuePackageJson
    .replace(/component-short-name/g, context.componentShortName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))

  await libs.writeFile(`packages/tsconfig.json`, variables.uiComponentPackagesTsconfigJson)

  await libs.writeFile(`rev-static.config.js`, variables.uiComponentRevStaticConfigJs)

  await libs.mkdir(`spec`)
  await libs.writeFile(`spec/karma.config.js`, variables.uiComponentSpecKarmaConfigJs)
  await libs.writeFile(`spec/tsconfig.json`, variables.uiComponentSpecTsconfigJson)
  await libs.writeFile(`spec/webpack.config.js`, variables.uiComponentSpecWebpackConfigJs)
  await libs.writeFile(`spec/indexSpec.ts`, variables.uiComponentSpecIndexSpecTs)
  await libs.writeFile(`spec/reactSpec.tsx`, variables.uiComponentSpecReactSpecTsx
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))
  await libs.writeFile(`spec/vueSpec.tsx`, variables.uiComponentSpecVueSpecTsx
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))

  await libs.mkdir(`screenshots`)
  await libs.writeFile(`screenshots/tsconfig.json`, variables.uiComponentScreenshotsTsconfigJson)
  await libs.writeFile(`screenshots/index.ts`, variables.uiComponentScreenshotsIndexTs)

  await libs.appendFile('README.md', variables.uiComponentReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/AUTHOR/g, context.author)
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))
  await libs.writeFile('.stylelintrc', variables.uiComponentStylelintrc)
  await libs.writeFile('.travis.yml', variables.uiComponentTravisYml)
  await libs.writeFile('appveyor.yml', variables.uiComponentAppveyorYml)
  await libs.writeFile('clean-scripts.config.js', variables.uiComponentCleanScriptsConfigJs
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
  await libs.writeFile('.browserslistrc', variables.uiComponentBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.uiComponentPostcssConfigJs)
  await libs.writeFile('.eslintrc', variables.uiComponentEslintrc)
  await libs.writeFile('.eslintignore', variables.uiComponentEslintignore)

  await libs.writeFile('lerna.json', variables.uiComponentLernaJson)

  return {
    scripts: {
      bootstrap: 'lerna bootstrap -- --frozen-lockfile',
      build: `clean-scripts build`,
      dev: `cross-env NODE_ENV=development clean-scripts build`,
      lint: `clean-scripts lint`,
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      watch: 'clean-scripts watch',
      screenshot: 'clean-scripts screenshot'
    },
    dependencies: {
      tslib: '1'
    },
    private: true,
    workspaces: [
      'packages/*'
    ],
  }
}
