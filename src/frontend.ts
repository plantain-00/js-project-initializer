import * as libs from './libs'
import * as variables from './variables'

export async function runFrontend(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.frontendGitignore)
  await libs.appendFile('.editorconfig', variables.frontendEditorconfig)
  await libs.appendFile('tsconfig.eslint.json', variables.frontendTsconfigEslintJson)

  const devDependencies = [
    'tslib',
    'github-fork-ribbon-css',
    'less',
    'stylelint stylelint-config-standard',
    'vue',
    'clean-css-cli',
    'file2variable-cli',
    'webpack webpack-cli @types/webpack',
    'rev-static',
    'sw-precache uglify-js@^2.8',
    'clean-scripts',
    'no-unused-export',
    'watch-then-execute',
    'http-server',
    'autoprefixer',
    'postcss',
    'postcss-cli',
    'cross-env',
    'ts-loader',
    'type-coverage',
    'ts-node'
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.writeFile(`index.ts`, variables.frontendIndexTs)
  await libs.writeFile(`index.template.html`, variables.frontendIndexTemplateHtml)
  await libs.writeFile(`tsconfig.json`, variables.frontendTsconfigJson)
  await libs.appendFile('README.md', variables.frontendReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`index.less`, variables.frontendIndexLess)
  await libs.writeFile('.stylelintrc', variables.frontendStylelintrc)
  await libs.writeFile(`webpack.config.ts`, variables.frontendWebpackConfigTs)
  await libs.writeFile(`rev-static.config.ts`, variables.frontendRevStaticConfigTs)
  await libs.writeFile('index.ejs.html',
    variables.frontendIndexEjsHtml
      .replace(/DESCRIPTION/g, context.description)
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/AUTHOR/g, context.author))
  await libs.writeFile('sw-precache.config.js', variables.frontendSwPrecacheConfigJs)
  await libs.writeFile('.travis.yml', variables.frontendTravisYml)
  await libs.writeFile('appveyor.yml', variables.frontendAppveyorYml)
  await libs.writeFile('clean-scripts.config.ts', variables.frontendCleanScriptsConfigTs)
  await libs.writeFile('prerender.html', variables.frontendPrerenderHtml)
  await libs.writeFile('.browserslistrc', variables.frontendBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.frontendPostcssConfigJs)
  await libs.writeFile('file2variable.config.ts', variables.frontendFile2VariableConfigTs)
  await libs.writeFile('.eslintrc', variables.frontendEslintrc)
  await libs.writeFile('.eslintignore', variables.frontendEslintignore)

  return {
    scripts: {
      build: 'clean-scripts build',
      dev: 'cross-env NODE_ENV=development clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: `clean-scripts fix`,
      watch: 'cross-env NODE_ENV=development clean-scripts watch',
      prerender: 'clean-scripts prerender',
      screenshot: 'clean-scripts screenshot'
    }
  }
}
