import * as libs from './libs'
import * as variables from './variables'

export async function runBackend(context: libs.Context) {
  await libs.appendFile('.gitignore', variables.backendGitignore)
  await libs.appendFile('.editorconfig', variables.backendEditorconfig)
  await libs.appendFile('tsconfig.eslint.json', variables.backendTsconfigEslintJson)

  await libs.exec(`yarn add -SE tslib`)

  const devDependencies = [
    '@types/node',
    'clean-scripts',
    'clean-release',
    'no-unused-export',
    'type-coverage',
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.mkdir('src')
  await libs.writeFile(`src/index.ts`, variables.backendSrcIndexTs)
  await libs.writeFile(`src/tsconfig.json`, variables.backendSrcTsconfigJson)

  await libs.appendFile('README.md', variables.backendReadmeMd
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('.travis.yml', variables.backendTravisYml)
  await libs.writeFile('appveyor.yml', variables.backendAppveyorYml)
  await libs.writeFile('clean-release.config.ts', variables.backendCleanReleaseConfigTs
    .replace(/AUTHOR/g, context.author)
    .replace(/REPOSITORY_NAME/g, context.repositoryName))
  await libs.writeFile('clean-scripts.config.ts', variables.backendCleanScriptsConfigTs)
  await libs.writeFile('Dockerfile', variables.backendDockerfile)
  await libs.writeFile('clean-run.config.ts', variables.backendCleanRunConfigTs)
  await libs.writeFile('.eslintrc', variables.backendEslintrc)
  await libs.writeFile('.eslintignore', variables.backendEslintignore)

  return {
    scripts: {
      build: 'clean-scripts build',
      'test:run': 'clean-release --config clean-run.config.js',
      lint: 'clean-scripts lint',
      test: 'clean-scripts test',
      fix: 'clean-scripts fix',
      watch: 'clean-scripts watch'
    }
  }
}
