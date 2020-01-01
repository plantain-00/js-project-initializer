import * as libs from './libs'
import * as variables from './variables'

export async function runLibrary(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.libraryGitignore)
  await libs.appendFile('.editorconfig', variables.libraryEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.libraryTsconfigBaseJson)
  await libs.appendFile('tsconfig.eslint.json', variables.libraryTsconfigEslintJson)
  await libs.appendFile('tsconfig.json', variables.libraryTsconfigJson)
  await libs.appendFile('api-extractor.json', variables.libraryApiExtractorJson)

  await libs.exec(`yarn add -SE tslib@1`)

  await libs.exec(`yarn add -DE jasmine @types/jasmine`)
  await libs.exec(`yarn add -DE rimraf`)
  await libs.exec(`yarn add -DE rollup rollup-plugin-node-resolve rollup-plugin-uglify`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE type-coverage`)
  await libs.exec(`yarn add -DE @microsoft/api-extractor`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.librarySrcIndexTs.replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile(`src/tsconfig.base.json`, variables.librarySrcTsconfigBaseJson)
  await libs.writeFile(`src/tsconfig.nodejs.json`, variables.librarySrcTsconfigNodejsJson)
  await libs.writeFile(`src/tsconfig.browser.json`, variables.librarySrcTsconfigBrowserJson)

  await libs.appendFile('README.md', variables.libraryReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile('.travis.yml', variables.libraryTravisYml)
  await libs.writeFile('appveyor.yml', variables.libraryAppveyorYml)
  await libs.writeFile('clean-release.config.js', variables.libraryCleanReleaseConfigJs)
  await libs.writeFile('rollup.config.js', variables.libraryRollupConfigJs.replace(/ComponentTypeName/g, context.componentTypeName).replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('clean-scripts.config.js', variables.libraryCleanScriptsConfigJs)
  await libs.writeFile('.eslintrc', variables.libraryEslintrc)
  await libs.writeFile('.eslintignore', variables.libraryEslintignore)

  await libs.writeFile('spec/tsconfig.json', variables.librarySpecTsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', variables.librarySpecIndexSpecTs)

  return {
    main: 'nodejs/index.js',
    module: 'browser/index.js',
    unpkg: `${context.repositoryName}.min.js`,
    jsdelivr: `${context.repositoryName}.min.js`,
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix'
    }
  }
}
