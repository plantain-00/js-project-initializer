import * as libs from './libs'
import * as variables from './variables'

export async function runFrontend (context: libs.Context) {
  context.hasKarma = true

  await libs.appendFile('.gitignore', variables.frontendGitignore)

  await libs.exec(`yarn add -DE tslib`)
  await libs.exec(`yarn add -DE github-fork-ribbon-css`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE vue vue-class-component`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE webpack`)
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
  await libs.writeFile(`vendor.ts`, variables.frontendVendorTs)
  await libs.writeFile(`tsconfig.json`, variables.frontendTsconfigJson)
  await libs.appendFile('README.md', libs.readMeBadge(context))
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
  await libs.writeFile('.travis.yml', libs.getTravisYml(context))
  await libs.writeFile('appveyor.yml', libs.appveyorYml(context))
  await libs.writeFile('clean-scripts.config.js', variables.frontendCleanScriptsConfigJs)
  await libs.writeFile('prerender.html', variables.frontendPrerenderHtml)
  await libs.writeFile('.browserslistrc', libs.browsersList)
  await libs.writeFile('postcss.config.js', libs.postcssConfig)
  await libs.writeFile('file2variable.config.js', variables.frontendFile2variableConfigJs)

  await libs.mkdir(`spec`)
  await libs.writeFile(`spec/karma.config.js`, libs.specKarmaConfigJs)
  await libs.writeFile(`spec/tsconfig.json`, variables.frontendSpecTsconfigJson)
  await libs.writeFile(`spec/webpack.config.js`, libs.specWebpackConfigJs)
  await libs.writeFile(`spec/indexSpec.ts`, libs.specIndexSpecTs)

  await libs.mkdir(`screenshots`)
  await libs.writeFile(`screenshots/tsconfig.json`, libs.tsconfigJson)
  await libs.writeFile(`screenshots/index.ts`, variables.frontendScreenshotsIndexTs)

  await libs.mkdir(`prerender`)
  await libs.writeFile(`prerender/tsconfig.json`, libs.tsconfigJson)
  await libs.writeFile(`prerender/index.ts`, variables.frontendPrerenderIndexTs)
  await libs.writeFile(`prerender/index.html`, variables.frontendPrerenderIndexHtml)

  return {
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      watch: 'clean-scripts watch',
      prerender: 'clean-scripts prerender',
      screenshot: 'clean-scripts screenshot'
    }
  }
}
