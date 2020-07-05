import * as libs from './libs'
import * as variables from './variables'

export async function runCLI(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.cliGitignore)
  await libs.appendFile('.editorconfig', variables.cliEditorconfig)

  await libs.exec(`yarn add -SE tslib@1 minimist@1`)

  const devDependencies = [
    '@types/node',
    '@types/minimist',
    'clean-scripts',
    'clean-release',
    'no-unused-export',
    'type-coverage',
    'ts-node',
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.cliSrcIndexTs.replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`src/core.ts`, variables.cliSrcCoreTs)
  await libs.writeFile(`src/lib.d.ts`, variables.cliSrcLibDTs)
  await libs.writeFile(`src/tsconfig.json`, variables.cliSrcTsconfigJson)

  await libs.appendFile('README.md', variables.cliReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/AUTHOR/g, context.author))
  await libs.writeFile('.travis.yml', variables.cliTravisYml)
  await libs.writeFile('appveyor.yml', variables.cliAppveyorYml)
  await libs.writeFile('clean-release.config.ts', variables.cliCleanReleaseConfigTs)
  await libs.writeFile('clean-scripts.config.ts', variables.cliCleanScriptsConfigTs)
  await libs.writeFile('clean-run.config.ts', variables.cliCleanRunConfigTs)
  await libs.writeFile('.eslintrc', variables.cliEslintrc)
  await libs.writeFile('.eslintignore', variables.cliEslintignore)

  await libs.mkdir('spec')

  await libs.mkdir('bin')
  await libs.writeFile(`bin/${context.repositoryName}`, variables.cliBinCli)

  await libs.exec(`chmod 755 bin/${context.repositoryName}`)

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
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
  }
}
