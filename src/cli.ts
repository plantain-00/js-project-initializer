import * as libs from './libs'
import * as variables from './variables'

export async function runCLI(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.cliGitignore)
  await libs.appendFile('.editorconfig', variables.cliEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.cliTsconfigBaseJson)
  await libs.appendFile('tsconfig.eslint.json', variables.cliTsconfigEslintJson)

  await libs.exec(`yarn add -SE tslib`)
  await libs.exec(`yarn add -DE @types/node`)
  await libs.exec(`yarn add -DE jasmine @types/jasmine`)
  await libs.exec(`yarn add -E minimist`)
  await libs.exec(`yarn add -DE @types/minimist`)
  await libs.exec(`yarn add -DE clean-scripts`)
  await libs.exec(`yarn add -DE clean-release`)
  await libs.exec(`yarn add -DE no-unused-export`)
  await libs.exec(`yarn add -DE type-coverage`)

  await libs.exec('./node_modules/.bin/jasmine init')

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.cliSrcIndexTs.replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`src/lib.d.ts`, variables.cliSrcLibDTs)
  await libs.writeFile(`src/tsconfig.json`, variables.cliSrcTsconfigJson)

  await libs.appendFile('README.md', variables.cliReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/AUTHOR/g, context.author))
  await libs.writeFile('.travis.yml', variables.cliTravisYml)
  await libs.writeFile('appveyor.yml', variables.cliAppveyorYml)
  await libs.writeFile('clean-release.config.js', variables.cliCleanReleaseConfigJs)
  await libs.writeFile('clean-scripts.config.js', variables.cliCleanScriptsConfigJs)
  await libs.writeFile('clean-run.config.js', variables.cliCleanRunConfigJs)
  await libs.writeFile('.eslintrc', variables.cliEslintrc)
  await libs.writeFile('.eslintignore', variables.cliEslintignore)

  await libs.mkdir('bin')
  await libs.writeFile(`bin/${context.repositoryName}`, variables.cliBinCli)

  await libs.exec(`chmod 755 bin/${context.repositoryName}`)

  await libs.mkdir('spec')
  await libs.writeFile('spec/tsconfig.json', variables.cliSpecTsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', variables.cliSpecIndexSpecTs)

  return {
    scripts: {
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix'
    },
    bin: {
      [context.repositoryName]: `bin/${context.repositoryName}`
    },
  }
}
