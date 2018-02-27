import * as libs from './libs'
import * as variables from './variables'

export async function runUIComponent (context: libs.Context) {
  const answer = await libs.inquirer.prompt({
    type: 'checkbox',
    name: 'options',
    message: 'Choose options:',
    default: [
    ],
    choices: [
      'angular'
    ]
  })
  const options: string[] = answer.options

  const hasAngularChoice = options.some(o => o === 'angular')

  await libs.appendFile('.gitignore', variables.uiComponentGitignore)
  await libs.appendFile('tslint.json', variables.uiComponentTslintJson)
  await libs.appendFile('.editorconfig', variables.uiComponentEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.uiComponentTsconfigBaseJson)

  await libs.exec(`yarn add -DE github-fork-ribbon-css`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE rev-static`)
  await libs.exec(`yarn add -DE webpack`)
  if (hasAngularChoice) {
    await libs.exec(`yarn add -DE @angular/compiler @angular/core @angular/compiler-cli`)
  }
  await libs.exec(`yarn add -DE standard`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE watch-then-execute`)
  await libs.exec(`yarn add -DE http-server`)
  await libs.exec(`yarn add -DE puppeteer @types/puppeteer`)
  await libs.exec(`yarn add -DE autoprefixer postcss-cli`)
  await libs.exec(`yarn add -DE react-test-renderer @types/react-test-renderer react vue-test-utils`)

  await libs.exec(`lerna init`)

  await libs.mkdir('packages/core/demo/')
  await libs.writeFile(`packages/core/demo/index.ts`, variables.uiComponentPackagesCoreDemoIndexTs)
  await libs.writeFile(`packages/core/demo/tsconfig.json`, variables.uiComponentPackagesCoreDemoTsconfigJson)

  await libs.mkdir('packages/core/src/')
  await libs.writeFile(`packages/core/src/index.less`, variables.uiComponentPackagesCoreSrcIndexLess.replace(/componentShortName/g, context.componentShortName))
  await libs.writeFile(`packages/core/src/index.ts`, variables.uiComponentPackagesCoreSrcIndexTs.replace(/componentTypeNameData/g, context.componentShortName))
  await libs.writeFile(`packages/core/src/tsconfig.json`, variables.uiComponentPackagesCoreSrcTsconfigJson)

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
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/vue/src/tsconfig.json`, variables.uiComponentPackagesVueSrcTsconfigJson)
  await libs.writeFile(`packages/vue/src/file2variable.config.js`, variables.uiComponentPackagesVueSrcFile2variableConfigJs
    .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))

  await libs.writeFile(`packages/vue/package.json`, variables.uiComponentPackagesVuePackageJson
    .replace(/component-short-name/g, context.componentShortName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))

  await libs.writeFile(`packages/tsconfig.json`, variables.uiComponentPackagesTsconfigJson)

  if (hasAngularChoice) {
    await libs.mkdir('packages/angular/demo/aot/')
    await libs.writeFile(`packages/angular/demo/aot/index.ejs.html`, variables.uiComponentPackagesAngularDemoAotIndexEjsHtml)
    await libs.writeFile(`packages/angular/demo/aot/index.ts`, variables.uiComponentPackagesAngularDemoAotIndexTs)
    await libs.writeFile(`packages/angular/demo/aot/webpack.config.js`, variables.uiComponentPackagesAngularDemoAotWebpackConfigJs)

    await libs.mkdir('packages/angular/demo/jit/')
    await libs.writeFile(`packages/angular/demo/jit/index.ejs.html`, variables.uiComponentPackagesAngularDemoJitIndexEjsHtml)
    await libs.writeFile(`packages/angular/demo/jit/index.ts`, variables.uiComponentPackagesAngularDemoJitIndexTs)
    await libs.writeFile(`packages/angular/demo/jit/webpack.config.js`, variables.uiComponentPackagesAngularDemoJitWebpackConfigJs)

    await libs.writeFile(`packages/angular/demo/main.component.ts`, variables.uiComponentPackagesAngularDemoMainComponentTs
      .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName)
      .replace(/AUTHOR/g, context.author)
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
    await libs.writeFile(`packages/angular/demo/main.module.ts`, variables.uiComponentPackagesAngularDemoMainModuleTs
      .replace(/COMPONENT_TYPE_NAME/g, context.componentTypeName))
    await libs.writeFile(`packages/angular/demo/tsconfig.json`, variables.uiComponentPackagesAngularDemoTsconfigJson)

    await libs.mkdir('packages/angular/src/')
    await libs.writeFile(`packages/angular/src/index.template.html`, variables.uiComponentPackagesAngularSrcIndexTemplateHtml
      .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
    await libs.writeFile(`packages/angular/src/index.ts`, variables.uiComponentPackagesAngularSrcIndexTs
      .replace(/ComponentTypeName/g, context.componentTypeName)
      .replace(/REPOSITORY_NAME/g, context.repositoryName))
    await libs.writeFile(`packages/angular/src/index.component.ts`, variables.uiComponentPackagesAngularSrcIndexComponentTs
      .replace(/ComponentTypeName/g, context.componentTypeName)
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/COMPONENT_SHORT_NAME/g, context.componentShortName))
    await libs.writeFile(`packages/angular/src/tsconfig.json`, variables.uiComponentPackagesAngularSrcTsconfigJson)

    await libs.writeFile(`packages/angular/package.json`, variables.uiComponentPackagesAngularPackageJson
      .replace(/component-short-name/g, context.componentShortName)
      .replace(/DESCRIPTION/g, context.description)
      .replace(/AUTHOR/g, context.author)
      .replace(/REPOSITORY_NAME/g, context.repositoryName))
  }

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

  await libs.writeFile('lerna.json', variables.uiComponentLernaJson)

  return {
    scripts: {
      bootstrap: 'lerna bootstrap -- --frozen-lockfile',
      build: `clean-scripts build`,
      lint: `clean-scripts lint`,
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      watch: 'clean-scripts watch',
      screenshot: 'clean-scripts screenshot'
    },
    dependencies: {
      tslib: '1'
    },
    private: true
  }
}
