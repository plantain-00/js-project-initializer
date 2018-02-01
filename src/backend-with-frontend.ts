import * as libs from './libs'
import * as variables from './variables'

export async function runBackendWithFrontend (context: libs.Context) {
  context.hasKarma = true

  await libs.appendFile('.gitignore', variables.backendWithFrontendGitignore)

  await libs.exec(`yarn add -DE @types/node`)
  await libs.exec(`yarn add -DE tslib`)
  await libs.exec(`yarn add -DE github-fork-ribbon-css`)
  await libs.exec(`yarn add -DE less`)
  await libs.exec(`yarn add -DE stylelint stylelint-config-standard`)
  await libs.exec(`yarn add -DE vue vue-class-component`)
  await libs.exec(`yarn add -DE clean-css-cli`)
  await libs.exec(`yarn add -DE file2variable-cli`)
  await libs.exec(`yarn add -DE webpack`)
  await libs.exec(`yarn add -DE rev-static`)
  await libs.exec(`yarn add -DE standard`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE watch-then-execute`)
  await libs.exec(`yarn add -DE puppeteer @types/puppeteer`)
  await libs.exec(`yarn add -DE autoprefixer postcss-cli`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.backendWithFrontendSrcIndexTs)
  await libs.writeFile(`src/tsconfig.json`, variables.backendWithFrontendSrcTsconfigJson)

  await libs.mkdir('static')
  await libs.writeFile(`static/tsconfig.json`, variables.backendWithFrontendStaticTsconfigJson)
  await libs.writeFile(`static/index.ts`, variables.backendWithFrontendStaticIndexTs)
  await libs.writeFile(`static/vendor.ts`, variables.backendWithFrontendStaticVendorTs)
  await libs.writeFile(`static/index.template.html`, variables.backendWithFrontendStaticIndexTemplateHtml)
  await libs.writeFile(`static/index.less`, variables.backendWithFrontendStaticIndexLess)
  await libs.writeFile(`static/webpack.config.js`, variables.backendWithFrontendStaticWebpackConfigJs)
  await libs.writeFile(`static/rev-static.config.js`, variables.backendWithFrontendStaticRevStaticConfigJs)
  await libs.writeFile('static/index.ejs.html',
    variables.backendWithFrontendStaticIndexEjsHtml
      .replace(/DESCRIPTION/g, context.description)
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/AUTHOR/g, context.author))
  await libs.writeFile('static/prerender.html', variables.backendWithFrontendStaticPrerenderHtml)
  await libs.writeFile('static/file2variable.config.js', variables.backendWithFrontendStaticFile2variableConfigJs)

  await libs.appendFile('README.md', libs.readMeBadge(context))
  await libs.appendFile('README.md',
    variables.backendWithFrontendReadmeMd
      .replace(/AUTHOR/g, context.author)
      .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('.stylelintrc', libs.stylelint)
  await libs.writeFile('.travis.yml', libs.getTravisYml(context))
  await libs.writeFile('appveyor.yml', libs.appveyorYml(context))
  await libs.writeFile('clean-release.config.js',
    variables.backendWithFrontendCleanReleaseConfigJs
      .replace(/AUTHOR/g, context.author)
      .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('clean-scripts.config.js', variables.backendWithFrontendCleanScriptsConfigJs)
  await libs.writeFile('.browserslistrc', libs.browsersList)
  await libs.writeFile('postcss.config.js', libs.postcssConfig)
  await libs.writeFile('Dockerfile', variables.backendWithFrontendDockerfile)

  await libs.mkdir('spec')
  await libs.writeFile('spec/tsconfig.json', variables.backendWithFrontendSpecTsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', libs.specIndexSpecTs)

  await libs.mkdir('static_spec')
  await libs.writeFile(`static_spec/karma.config.js`, variables.backendWithFrontendStaticSpecKarmaConfigJs)
  await libs.writeFile(`static_spec/tsconfig.json`, variables.backendWithFrontendStaticSpecTsconfigJson)
  await libs.writeFile(`static_spec/webpack.config.js`, libs.specWebpackConfigJs)
  await libs.writeFile(`static_spec/indexSpec.ts`, libs.specIndexSpecTs)

  await libs.mkdir('screenshots')
  await libs.writeFile(`screenshots/tsconfig.json`, libs.tsconfigJson)
  await libs.writeFile(`screenshots/index.ts`, variables.backendWithFrontendScreenshotsIndexTs)

  await libs.mkdir('prerender')
  await libs.writeFile(`prerender/tsconfig.json`, libs.tsconfigJson)
  await libs.writeFile(`prerender/index.ts`, variables.backendWithFrontendPrerenderIndexTs)
  await libs.writeFile(`prerender/index.html`, variables.backendWithFrontendPrerenderIndexHtml)

  return {
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix',
      watch: 'clean-scripts watch',
      screenshot: 'clean-scripts screenshot',
      prerender: 'clean-scripts prerender'
    }
  }
}
