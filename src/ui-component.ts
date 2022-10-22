import * as libs from './libs'
import * as variables from './variables'

export async function runUIComponent(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.uiComponentGitignore)
  await libs.appendFile('.editorconfig', variables.uiComponentEditorconfig)
  await libs.appendFile('tsconfig.eslint.json', variables.uiComponentTsconfigEslintJson)

  const devDependencies = [
    'github-fork-ribbon-css',
    'less',
    'stylelint stylelint-config-standard',
    'clean-css-cli',
    'file2variable-cli',
    'rev-static',
    'webpack webpack-cli @types/webpack',
    'clean-scripts',
    'no-unused-export',
    'watch-then-execute',
    'http-server',
    'autoprefixer',
    'postcss',
    'postcss-cli',
    'rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve rollup-plugin-uglify',
    'cross-env',
    'type-coverage',
    'ts-node',
    'ts-loader',
    'clean-release',
    '@types/react',
    '@types/react-dom',
  ]

  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

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
  await libs.writeFile(`packages/react/demo/index.ejs.html`, variables.uiComponentPackagesReactDemoIndexEjsHtml.replace(/REPOSITORY_NAME/g, context.repositoryName).replace(/AUTHOR/g, context.author))
  await libs.writeFile(`packages/react/demo/index.tsx`, variables.uiComponentPackagesReactDemoIndexTsx
    .replace(/componentTypeName/g, context.componentTypeName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/react/demo/tsconfig.json`, variables.uiComponentPackagesReactDemoTsconfigJson)
  await libs.writeFile(`packages/react/demo/webpack.config.ts`, variables.uiComponentPackagesReactDemoWebpackConfigTs)

  await libs.mkdir('packages/react/src/')
  await libs.writeFile(`packages/react/src/index.tsx`, variables.uiComponentPackagesReactSrcIndexTsx
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/ComponentTypeName/g, context.componentTypeName)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
  await libs.writeFile(`packages/react/src/tsconfig.json`, variables.uiComponentPackagesReactSrcTsconfigJson)
  await libs.writeFile(`packages/react/src/rollup.config.mjs`, variables.uiComponentPackagesReactSrcRollupConfigMjs
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
  await libs.writeFile(`packages/vue/demo/index.ejs.html`, variables.uiComponentPackagesVueDemoIndexEjsHtml.replace(/REPOSITORY_NAME/g, context.repositoryName).replace(/AUTHOR/g, context.author))
  await libs.writeFile(`packages/vue/demo/index.ts`, variables.uiComponentPackagesVueDemoIndexTs
    .replace(/componentTypeName/g, context.componentTypeName)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPSOTIRY_NAME/g, context.repositoryName)
    .replace(/componentShortName/g, context.componentShortName))
  await libs.writeFile(`packages/vue/demo/tsconfig.json`, variables.uiComponentPackagesVueDemoTsconfigJson)
  await libs.writeFile(`packages/vue/demo/webpack.config.ts`, variables.uiComponentPackagesVueDemoWebpackConfigTs)

  await libs.mkdir('packages/vue/src/')
  await libs.writeFile(`packages/vue/src/index.template.html`, variables.uiComponentPackagesVueSrcIndexTemplateHtml)
  await libs.writeFile(`packages/vue/src/index.ts`, variables.uiComponentPackagesVueSrcIndexTs
    .replace(/ComponentTypeName/g, context.componentTypeName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/vue/src/tsconfig.json`, variables.uiComponentPackagesVueSrcTsconfigJson)
  await libs.writeFile(`packages/vue/src/file2variable.config.ts`, variables.uiComponentPackagesVueSrcFile2VariableConfigTs
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))
  await libs.writeFile(`packages/vue/src/rollup.config.mjs`, variables.uiComponentPackagesVueSrcRollupConfigMjs
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

  await libs.writeFile(`rev-static.config.ts`, variables.uiComponentRevStaticConfigTs)

  await libs.appendFile('README.md', variables.uiComponentReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName)
    .replace(/AUTHOR/g, context.author)
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))
  await libs.writeFile('.stylelintrc', variables.uiComponentStylelintrc)
  await libs.writeFile('appveyor.yml', variables.uiComponentAppveyorYml)
  await libs.writeFile('clean-scripts.config.ts', variables.uiComponentCleanScriptsConfigTs
    .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
  await libs.writeFile('clean-release.config.ts', variables.uiComponentCleanReleaseConfigTs)
  await libs.writeFile('.browserslistrc', variables.uiComponentBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.uiComponentPostcssConfigJs)
  await libs.writeFile('.eslintrc', variables.uiComponentEslintrc)
  await libs.writeFile('.eslintignore', variables.uiComponentEslintignore)
  await libs.writeFile('CONTRIBUTING.md', variables.uiComponentContributingMd)

  return {
    scripts: {
      build: `clean-scripts build`,
      dev: `cross-env NODE_ENV=development clean-scripts build`,
      lint: `clean-scripts lint`,
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      release: 'clean-release',
      watch: 'clean-scripts watch'
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
