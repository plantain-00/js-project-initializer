import * as libs from './libs'
import * as variables from './variables'

export async function runElectron(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.electronGitignore)
  await libs.appendFile('.editorconfig', variables.electronEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.electronTsconfigBaseJson)
  await libs.appendFile('tsconfig.eslint.json', variables.electronTsconfigEslintJson)

  await libs.exec(`yarn add -E electron`)
  await libs.exec(`yarn add -DE electron-packager`)
  await libs.exec(`yarn add -DE @types/node`)
  await libs.exec(`yarn add -DE tslib`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE vue vue-class-component`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE webpack webpack-cli`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE watch-then-execute`)
  await libs.exec(`yarn add -DE autoprefixer postcss-cli`)
  await libs.exec(`yarn add -DE type-coverage`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.writeFile(`main.ts`, variables.electronMainTs)
  await libs.writeFile(`index.html`, variables.electronIndexHtml)
  await libs.writeFile(`tsconfig.json`, variables.electronTsconfigJson)
  await libs.appendFile('README.md', variables.electronReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('.stylelintrc', variables.electronStylelintrc)
  await libs.writeFile('.travis.yml', variables.electronTravisYml)
  await libs.writeFile('appveyor.yml', variables.electronAppveyorYml)
  await libs.writeFile('clean-release.config.js', variables.electronCleanReleaseConfigJs)
  await libs.writeFile('clean-scripts.config.js', variables.electronCleanScriptsConfigJs)
  await libs.writeFile('.browserslistrc', variables.electronBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.electronPostcssConfigJs)
  await libs.writeFile('.eslintrc', variables.electronEslintrc)
  await libs.writeFile('.eslintignore', variables.electronEslintignore)

  await libs.mkdir('scripts')
  await libs.writeFile('scripts/index.ts', variables.electronScriptsIndexTs)
  await libs.writeFile(`scripts/index.less`, variables.electronScriptsIndexLess)
  await libs.writeFile('scripts/tsconfig.json', variables.electronScriptsTsconfigJson)
  await libs.writeFile(`scripts/index.template.html`, variables.electronScriptsIndexTemplateHtml)
  await libs.writeFile(`scripts/webpack.config.js`, variables.electronScriptsWebpackConfigJs)
  await libs.writeFile('scripts/file2variable.config.js', variables.electronScriptsFile2VariableConfigJs)

  await libs.mkdir('spec')
  await libs.writeFile('spec/tsconfig.json', variables.electronSpecTsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', variables.electronSpecIndexSpecTs)

  await libs.mkdir('static_spec')
  await libs.writeFile(`static_spec/karma.config.js`, variables.electronStaticSpecKarmaConfigJs)
  await libs.writeFile(`static_spec/tsconfig.json`, variables.electronStaticSpecTsconfigJson)
  await libs.writeFile(`static_spec/webpack.config.js`, variables.electronStaticSpecWebpackConfigJs)
  await libs.writeFile(`static_spec/indexSpec.ts`, variables.electronStaticSpecIndexSpecTs)

  return {
    scripts: {
      start: 'electron .',
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      watch: 'clean-scripts watch'
    }
  }
}
