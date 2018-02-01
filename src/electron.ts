import * as libs from './libs'
import * as variables from './variables'

export async function runElectron (context: libs.Context) {
  context.hasKarma = true

  await libs.appendFile('.gitignore', variables.electronGitignore)

  await libs.exec(`yarn add -E electron`)
  await libs.exec(`yarn add -DE electron-packager`)
  await libs.exec(`yarn add -DE @types/node`)
  await libs.exec(`yarn add -DE tslib`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE vue vue-class-component`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE webpack`)
  await libs.exec(`yarn add -DE standard`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE watch-then-execute`)
  await libs.exec(`yarn add -DE autoprefixer postcss-cli`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.writeFile(`main.ts`, variables.electronMainTs)
  await libs.writeFile(`index.html`, variables.electronIndexHtml)
  await libs.writeFile(`tsconfig.json`, variables.electronTsconfigJson)
  await libs.appendFile('README.md', libs.readMeBadge(context))
  await libs.writeFile('.stylelintrc', libs.stylelint)
  await libs.writeFile('.travis.yml', libs.getTravisYml(context))
  await libs.writeFile('appveyor.yml', libs.appveyorYml(context))
  await libs.writeFile('clean-release.config.js', variables.electronCleanReleaseConfigJs)
  await libs.writeFile('clean-scripts.config.js', variables.electronCleanScriptsConfigJs)
  await libs.writeFile('.browserslistrc', variables.electronBrowserslistrc)
  await libs.writeFile('postcss.config.js', libs.postcssConfig)

  await libs.mkdir('scripts')
  await libs.writeFile('scripts/index.ts', variables.electronScriptsIndexTs)
  await libs.writeFile(`scripts/index.less`, variables.electronScriptsIndexLess)
  await libs.writeFile('scripts/tsconfig.json', variables.electronScriptsTsconfigJson)
  await libs.writeFile(`scripts/index.template.html`, variables.electronScriptsIndexTemplateHtml)
  await libs.writeFile(`scripts/webpack.config.js`, variables.electronScriptsWebpackConfigJs)
  await libs.writeFile('scripts/file2variable.config.js', variables.electronScriptsFile2variableConfigJs)

  await libs.mkdir('spec')
  await libs.writeFile('spec/tsconfig.json', libs.tsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', libs.specIndexSpecTs)

  await libs.mkdir('static_spec')
  await libs.writeFile(`static_spec/karma.config.js`, libs.specKarmaConfigJs)
  await libs.writeFile(`static_spec/tsconfig.json`, variables.electronStaticSpecTsconfigJson)
  await libs.writeFile(`static_spec/webpack.config.js`, libs.specWebpackConfigJs)
  await libs.writeFile(`static_spec/indexSpec.ts`, libs.specIndexSpecTs)

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
