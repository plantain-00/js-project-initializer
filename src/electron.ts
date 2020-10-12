import * as libs from './libs'
import * as variables from './variables'

export async function runElectron(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.electronGitignore)
  await libs.appendFile('.editorconfig', variables.electronEditorconfig)
  await libs.appendFile('tsconfig.eslint.json', variables.electronTsconfigEslintJson)

  await libs.exec(`yarn add -E electron "tslib@1 || 2"`)

  const devDependencies = [
    'electron-packager',
    '@types/node',
    'less',
    'ts-node',
    'stylelint',
    'stylelint-config-standard',
    'react react-dom @types/react @types/react-dom',
    'clean-css-cli',
    'webpack',
    'webpack-cli',
    '@types/webpack',
    'ts-loader',
    'clean-scripts',
    'no-unused-export',
    'watch-then-execute',
    'autoprefixer',
    'postcss',
    'postcss-cli',
    'type-coverage',
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.writeFile(`main.ts`, variables.electronMainTs)
  await libs.writeFile(`index.html`, variables.electronIndexHtml)
  await libs.writeFile(`tsconfig.json`, variables.electronTsconfigJson)
  await libs.appendFile('README.md', variables.electronReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('.stylelintrc', variables.electronStylelintrc)
  await libs.writeFile('.travis.yml', variables.electronTravisYml)
  await libs.writeFile('appveyor.yml', variables.electronAppveyorYml)
  await libs.writeFile('clean-release.config.ts', variables.electronCleanReleaseConfigTs)
  await libs.writeFile('clean-scripts.config.ts', variables.electronCleanScriptsConfigTs)
  await libs.writeFile('.browserslistrc', variables.electronBrowserslistrc)
  await libs.writeFile('postcss.config.js', variables.electronPostcssConfigJs)
  await libs.writeFile('.eslintrc', variables.electronEslintrc)
  await libs.writeFile('.eslintignore', variables.electronEslintignore)

  await libs.mkdir('scripts')
  await libs.writeFile('scripts/index.tsx', variables.electronScriptsIndexTsx)
  await libs.writeFile(`scripts/index.less`, variables.electronScriptsIndexLess)
  await libs.writeFile('scripts/tsconfig.json', variables.electronScriptsTsconfigJson)
  await libs.writeFile(`scripts/webpack.config.ts`, variables.electronScriptsWebpackConfigTs)

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
