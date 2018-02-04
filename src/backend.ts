import * as libs from './libs'
import * as variables from './variables'

export async function runBackend (context: libs.Context) {
  await libs.appendFile('.gitignore', variables.backendGitignore)
  await libs.appendFile('tslint.json', variables.backendTslintJson)
  await libs.appendFile('.editorconfig', variables.backendEditorconfig)

  await libs.exec(`yarn add -DE @types/node`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine`)
  await libs.exec(`yarn add -DE standard`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE no-unused-export`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.backendSrcIndexTs)
  await libs.writeFile(`src/tsconfig.json`, variables.backendSrcTsconfigJson)

  await libs.appendFile('README.md', variables.backendReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('.travis.yml', variables.backendTravisYml)
  await libs.writeFile('appveyor.yml', variables.backendAppveyorYml)
  await libs.writeFile('clean-release.config.js', variables.backendCleanReleaseConfigJs
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('clean-scripts.config.js', variables.backendCleanScriptsConfigJs)
  await libs.writeFile('Dockerfile', variables.backendDockerfile)

  await libs.mkdir('spec')
  await libs.writeFile('spec/tsconfig.json', variables.backendSpecTsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', variables.backendSpecIndexSpecTs)

  return {
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix',
      watch: 'clean-scripts watch'
    }
  }
}
