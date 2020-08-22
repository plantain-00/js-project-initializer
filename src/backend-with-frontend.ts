import * as libs from './libs'
import * as variables from './variables'

export async function runBackendWithFrontend(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.backendWithFrontendGitignore)
  await libs.appendFile('.editorconfig', variables.backendWithFrontendEditorconfig)
  await libs.appendFile('tsconfig.eslint.json', variables.backendWithFrontendTsconfigEslintJson)

  await libs.exec(`yarn add -SE tslib`)

  const devDependencies = [
    '@types/node',
    'github-fork-ribbon-css',
    'less',
    'stylelint',
    'stylelint-config-standard',
    'vue',
    'vue-class-component',
    'clean-css-cli',
    'file2variable-cli',
    'webpack',
    'webpack-cli',
    '@types/webpack',
    'ts-loader',
    'rev-static',
    'clean-scripts',
    'ts-node',
    'clean-release',
    'no-unused-export',
    'watch-then-execute',
    'autoprefixer',
    'postcss-cli',
    'cross-env',
    'type-coverage',
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.backendWithFrontendSrcIndexTs)
  await libs.writeFile(`src/tsconfig.json`, variables.backendWithFrontendSrcTsconfigJson)

  await libs.mkdir('static')
  await libs.writeFile(`static/tsconfig.json`, variables.backendWithFrontendStaticTsconfigJson)
  await libs.writeFile(`static/index.ts`, variables.backendWithFrontendStaticIndexTs)
  await libs.writeFile(`static/index.template.html`, variables.backendWithFrontendStaticIndexTemplateHtml)
  await libs.writeFile(`static/index.less`, variables.backendWithFrontendStaticIndexLess)
  await libs.writeFile(`static/webpack.config.ts`, variables.backendWithFrontendStaticWebpackConfigTs)
  await libs.writeFile(`static/rev-static.config.ts`, variables.backendWithFrontendStaticRevStaticConfigTs)
  await libs.writeFile('static/index.ejs.html',
    variables.backendWithFrontendStaticIndexEjsHtml
      .replace(/DESCRIPTION/g, context.description)
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/AUTHOR/g, context.author))
  await libs.writeFile('static/prerender.html', variables.backendWithFrontendStaticPrerenderHtml)
  await libs.writeFile('static/file2variable.config.ts', variables.backendWithFrontendStaticFile2VariableConfigTs)

  await libs.appendFile('README.md',
    variables.backendWithFrontendReadmeMd
      .replace(/AUTHOR/g, context.author)
      .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('.stylelintrc', variables.backendWithFrontendStylelintrc)
  await libs.writeFile('.travis.yml', variables.backendWithFrontendTravisYml)
  await libs.writeFile('appveyor.yml', variables.backendWithFrontendAppveyorYml)
  await libs.writeFile('clean-release.config.ts',
    variables.backendWithFrontendCleanReleaseConfigTs
      .replace(/AUTHOR/g, context.author)
      .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('clean-scripts.config.ts', variables.backendWithFrontendCleanScriptsConfigTs)
  await libs.writeFile('.browserslistrc', variables.backendWithFrontendBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.backendWithFrontendPostcssConfigJs)
  await libs.writeFile('Dockerfile', variables.backendWithFrontendDockerfile)
  await libs.writeFile('clean-run.config.ts', variables.backendWithFrontendCleanRunConfigTs)
  await libs.writeFile('.eslintrc', variables.backendWithFrontendEslintrc)
  await libs.writeFile('.eslintignore', variables.backendWithFrontendEslintignore)

  return {
    scripts: {
      build: 'clean-scripts build',
      'test:run': 'clean-release --config clean-run.config.js',
      dev: 'cross-env NODE_ENV=development clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix',
      watch: 'cross-env NODE_ENV=development clean-scripts watch',
      screenshot: 'clean-scripts screenshot',
      prerender: 'clean-scripts prerender'
    }
  }
}
