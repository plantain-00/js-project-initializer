import * as libs from './libs'
import * as variables from './variables'

export async function runCLIMonorepo(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.cliMonorepoGitignore)
  await libs.appendFile('.editorconfig', variables.cliMonorepoEditorconfig)
  await libs.appendFile('tsconfig.base.json', variables.cliMonorepoTsconfigBaseJson)
  await libs.appendFile('tsconfig.eslint.json', variables.cliMonorepoTsconfigEslintJson)

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

  await libs.exec(`lerna init`)

  await libs.mkdir('packages/cli')
  await libs.mkdir('packages/cli/src')
  await libs.writeFile(`packages/cli/src/index.ts`, variables.cliMonorepoPackagesCliSrcIndexTs.replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/cli/src/lib.d.ts`, variables.cliMonorepoPackagesCliSrcLibDTs)
  await libs.writeFile(`packages/cli/src/tsconfig.json`, variables.cliMonorepoPackagesCliSrcTsconfigJson)
  await libs.writeFile(`packages/cli/README.md`, variables.cliMonorepoPackagesCliReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/AUTHOR/g, context.author))
  await libs.writeFile(`packages/cli/package.json`, variables.cliMonorepoPackagesCliPackageJson
    .replace(/repository-name/g, context.repositoryName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author))

  await libs.mkdir('packages/cli/bin')
  await libs.writeFile(`packages/cli/bin/${context.repositoryName}`, variables.cliMonorepoPackagesCliBinCli)
  await libs.exec(`chmod 755 packages/cli/bin/${context.repositoryName}`)

  await libs.mkdir('packages/core')
  await libs.mkdir('packages/core/src')
  await libs.writeFile(`packages/core/src/index.ts`, variables.cliMonorepoPackagesCoreSrcIndexTs.replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile(`packages/core/src/tsconfig.json`, variables.cliMonorepoPackagesCoreSrcTsconfigJson)
  await libs.writeFile(`packages/core/README.md`, variables.cliMonorepoPackagesCoreReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/AUTHOR/g, context.author))
  await libs.writeFile(`packages/core/package.json`, variables.cliMonorepoPackagesCorePackageJson
    .replace(/repository-name/g, context.repositoryName)
    .replace(/DESCRIPTION/g, context.description)
    .replace(/AUTHOR/g, context.author))

  await libs.appendFile('README.md', variables.cliMonorepoReadmeMd
    .replace(/REPOSITORY_NAME/g, context.repositoryName)
    .replace(/AUTHOR/g, context.author))
  await libs.writeFile('.travis.yml', variables.cliMonorepoTravisYml)
  await libs.writeFile('appveyor.yml', variables.cliMonorepoAppveyorYml)
  await libs.writeFile('clean-scripts.config.js', variables.cliMonorepoCleanScriptsConfigJs)
  await libs.writeFile('.eslintrc', variables.cliMonorepoEslintrc)
  await libs.writeFile('.eslintignore', variables.cliMonorepoEslintignore)

  await libs.mkdir('spec')
  await libs.writeFile('spec/tsconfig.json', variables.cliMonorepoSpecTsconfigJson)
  await libs.writeFile('spec/indexSpec.ts', variables.cliMonorepoSpecIndexSpecTs)

  await libs.writeFile('lerna.json', variables.cliMonorepoLernaJson)

  return {
    scripts: {
      bootstrap: 'lerna bootstrap -- --frozen-lockfile',
      build: 'clean-scripts build',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix'
    },
    private: true,
    workspaces: [
      'packages/*'
    ],
  }
}
