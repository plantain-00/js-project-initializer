import * as libs from './libs'
import * as variables from './variables'

export async function runLibrary(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.libraryGitignore)
  await libs.appendFile('.editorconfig', variables.libraryEditorconfig)
  await libs.appendFile('tsconfig.json', variables.libraryTsconfigJson)
  await libs.appendFile('api-extractor.json', variables.libraryApiExtractorJson)

  await libs.exec(`yarn add -SE "tslib@1 || 2"`)

  const devDependencies = [
    'ts-node',
    'ava',
    'rimraf',
    'rollup',
    '@rollup/plugin-node-resolve',
    'rollup-plugin-uglify',
    'clean-scripts',
    'no-unused-export',
    'type-coverage',
    '@microsoft/api-extractor',
    'clean-release',
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.librarySrcIndexTs.replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile(`src/tsconfig.nodejs.json`, variables.librarySrcTsconfigNodejsJson)
  await libs.writeFile(`src/tsconfig.browser.json`, variables.librarySrcTsconfigBrowserJson)

  await libs.appendFile('README.md', variables.libraryReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile('.travis.yml', variables.libraryTravisYml)
  await libs.writeFile('appveyor.yml', variables.libraryAppveyorYml)
  await libs.writeFile('clean-release.config.ts', variables.libraryCleanReleaseConfigTs)
  await libs.writeFile('rollup.config.js', variables.libraryRollupConfigJs.replace(/ComponentTypeName/g, context.componentTypeName).replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('clean-scripts.config.ts', variables.libraryCleanScriptsConfigTs)
  await libs.writeFile('.eslintrc', variables.libraryEslintrc)
  await libs.writeFile('.eslintignore', variables.libraryEslintignore)
  await libs.writeFile('ava.config.js', variables.libraryAvaConfigJs)

  await libs.mkdir('spec')
  await libs.writeFile('spec/index.ts', variables.librarySpecIndexTs)

  return {
    main: 'nodejs/index.js',
    module: 'browser/index.js',
    unpkg: `${context.repositoryName}.min.js`,
    jsdelivr: `${context.repositoryName}.min.js`,
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      release: 'clean-release',
      fix: 'clean-scripts fix'
    }
  }
}
