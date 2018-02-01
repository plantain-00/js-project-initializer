import * as libs from './libs'
import * as variables from './variables'

export async function runLibrary (context: libs.Context) {
  context.isNpmPackage = true

  await libs.appendFile('.gitignore', variables.libraryGitignore)

  await libs.exec(`yarn add -DE jasmine @types/jasmine`)
  await libs.exec(`yarn add -DE rimraf`)
  await libs.exec(`yarn add -DE standard`)
  await libs.exec(`yarn add -DE rollup rollup-plugin-node-resolve rollup-plugin-uglify`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.librarySrcIndexTs.replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile(`src/tsconfig.base.json`, variables.librarySrcTsconfigBaseJson)
  await libs.writeFile(`src/tsconfig.nodejs.json`, variables.librarySrcTsconfigNodejsJson)
  await libs.writeFile(`src/tsconfig.browser.json`, variables.librarySrcTsconfigBrowserJson)

  await libs.appendFile('README.md', libs.readMeBadge(context))
  await libs.appendFile('README.md',
    variables.libraryReadmeMd
      .replace(/REPOSITORY_NAME/g, context.repositoryName)
      .replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile('.travis.yml', libs.getTravisYml(context))
  await libs.writeFile('appveyor.yml', libs.appveyorYml(context))
  await libs.writeFile('clean-release.config.js', variables.libraryCleanReleaseConfigJs)
  await libs.writeFile('rollup.config.js', variables.libraryRollupConfigJs.replace(/ComponentTypeName/g, context.componentTypeName))
  await libs.writeFile('clean-scripts.config.js', variables.libraryCleanScriptsConfigJs)

  await libs.writeFile('spec/tsconfig.json', libs.tsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', libs.specIndexSpecTs)

  return {
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix'
    }
  }
}
