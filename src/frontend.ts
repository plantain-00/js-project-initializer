import * as libs from './libs'
import * as variables from './variables'

export async function runFrontend(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.frontendGitignore)
  await libs.appendFile('tslint.json', variables.frontendTslintJson)
  await libs.appendFile('.editorconfig', variables.frontendEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.frontendTsconfigBaseJson)

  await libs.exec(`yarn add -DE tslib`)
  await libs.exec(`yarn add -DE github-fork-ribbon-css`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE vue vue-class-component`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE webpack webpack-cli`)
  await libs.exec(`yarn add -DE rev-static`)
  await libs.exec(`yarn add -DE sw-precache uglify-js@^2.8`)
  await libs.exec(`yarn add -DE standard`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE watch-then-execute`)
  await libs.exec(`yarn add -DE http-server`)
  await libs.exec(`yarn add -DE puppeteer @types/puppeteer`)
  await libs.exec(`yarn add -DE autoprefixer postcss-cli`)

  await libs.writeFile(`index.ts`, variables.frontendIndexTs)
  await libs.writeFile(`index.template.html`, variables.frontendIndexTemplateHtml)
  await libs.writeFile(`tsconfig.json`, variables.frontendTsconfigJson)
  await libs.appendFile('README.md', variables.frontendReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`index.less`, variables.frontendIndexLess)
  await libs.writeFile('.stylelintrc', variables.frontendStylelintrc)
  await libs.writeFile(`webpack.config.js`, variables.frontendWebpackConfigJs)
  await libs.writeFile(`rev-static.config.js`, variables.frontendRevStaticConfigJs)
  await libs.writeFile('index.ejs.html',
    variables.frontendIndexEjsHtml
      .replace(/DESCRIPTION/g, context.description)
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/AUTHOR/g, context.author))
  await libs.writeFile('sw-precache.config.js', variables.frontendSwPrecacheConfigJs)
  await libs.writeFile('.travis.yml', variables.frontendTravisYml)
  await libs.writeFile('appveyor.yml', variables.frontendAppveyorYml)
  await libs.writeFile('clean-scripts.config.js', variables.frontendCleanScriptsConfigJs)
  await libs.writeFile('prerender.html', variables.frontendPrerenderHtml)
  await libs.writeFile('.browserslistrc', variables.frontendBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.frontendPostcssConfigJs)
  await libs.writeFile('file2variable.config.js', variables.frontendFile2variableConfigJs)

  await libs.mkdir(`spec`)
  await libs.writeFile(`spec/karma.config.js`, variables.frontendSpecKarmaConfigJs)
  await libs.writeFile(`spec/tsconfig.json`, variables.frontendSpecTsconfigJson)
  await libs.writeFile(`spec/webpack.config.js`, variables.frontendSpecWebpackConfigJs)
  await libs.writeFile(`spec/indexSpec.ts`, variables.frontendSpecIndexSpecTs)

  await libs.mkdir(`screenshots`)
  await libs.writeFile(`screenshots/tsconfig.json`, variables.frontendScreenshotsTsconfigJson)
  await libs.writeFile(`screenshots/index.ts`, variables.frontendScreenshotsIndexTs)

  await libs.mkdir(`prerender`)
  await libs.writeFile(`prerender/tsconfig.json`, variables.frontendPrerenderTsconfigJson)
  await libs.writeFile(`prerender/index.ts`, variables.frontendPrerenderIndexTs)
  await libs.writeFile(`prerender/index.html`, variables.frontendPrerenderIndexHtml)

  return {
    scripts: {
      build: 'clean-scripts build',
      dev: 'export NODE_ENV=development && clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      watch: 'clean-scripts watch',
      prerender: 'clean-scripts prerender',
      screenshot: 'clean-scripts screenshot'
    }
  }
}
