import * as libs from './libs'
import { runUIComponent } from './ui-component'
import { runCLI } from './cli'
import { runLibrary } from './library'
import { runBackend } from './backend'
import { runFrontend } from './frontend'
import { runBackendWithFrontend } from './backend-with-frontend'
import { runElectron } from './electron'
import { runCLIMonorepo } from './cli-monorepo'
import * as packageJson from '../package.json'

const packageJsonFileName = 'package.json'

function showToolVersion() {
  console.log(`Version: ${packageJson.version}`)
}

async function run() {
  const argv = libs.minimist(process.argv.slice(2), { '--': true }) as unknown as {
    v?: unknown
    version?: unknown
    suppressError?: unknown
  }

  const showVersion = argv.v || argv.version
  if (showVersion) {
    showToolVersion()
    return
  }

  const context = await getContext()

  const kind = await selectProjectKind()

  const devDependencies = [
    'typescript',
    '@typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-plantain eslint',
    '@commitlint/config-conventional @commitlint/cli',
    'markdownlint-cli',
    'rimraf',
  ]
  await libs.exec(`yarn add -DE ${devDependencies.join(' ')}`)

  await libs.mkdir('.vscode')
  await libs.writeFile('.vscode/settings.json', vscodeSetting)

  await libs.writeFile('commitlint.config.js', commitlintConfig)
  await libs.writeFile('.markdownlint.json', markdownlintConfig)

  await libs.mkdir('.github')
  await libs.writeFile('.github/ISSUE_TEMPLATE.md', issueTemplate)
  await libs.writeFile('.github/PULL_REQUEST_TEMPLATE.md', pullRequestTemplate)
  await libs.mkdir('.github/workflows')
  await libs.writeFile('.github/workflows/github-ci.yaml', githubCI)

  let newPackageJson: PackageJson = {}

  context.kind = kind

  switch (kind) {
    case libs.ProjectKind.UIComponent:
      newPackageJson = await runUIComponent(context)
      break
    case libs.ProjectKind.CLI:
      newPackageJson = await runCLI(context)
      break
    case libs.ProjectKind.CLIMonorepo:
      newPackageJson = await runCLIMonorepo(context)
      break
    case libs.ProjectKind.library:
      newPackageJson = await runLibrary(context)
      break
    case libs.ProjectKind.backend:
      newPackageJson = await runBackend(context)
      break
    case libs.ProjectKind.frontend:
      newPackageJson = await runFrontend(context)
      break
    case libs.ProjectKind.backendWithFrontend:
      newPackageJson = await runBackendWithFrontend(context)
      break
    case libs.ProjectKind.electron:
      newPackageJson = await runElectron(context)
      break
  }

  const packages = await libs.readFile(packageJsonFileName)
  const packageJson: PackageJson = JSON.parse(packages)
  if (newPackageJson.scripts) {
    packageJson.scripts = newPackageJson.scripts
  }
  if (newPackageJson.bin) {
    packageJson.bin = newPackageJson.bin
  }
  if (newPackageJson.dependencies && newPackageJson.dependencies.tslib) {
    if (!packageJson.dependencies) {
      packageJson.dependencies = {}
    }
    packageJson.dependencies.tslib = newPackageJson.dependencies.tslib
  }
  if (newPackageJson.main) {
    packageJson.main = newPackageJson.main
  }
  if (newPackageJson.module) {
    packageJson.module = newPackageJson.module
  }
  if (newPackageJson.unpkg) {
    packageJson.unpkg = newPackageJson.unpkg
  }
  if (newPackageJson.jsdelivr) {
    packageJson.jsdelivr = newPackageJson.jsdelivr
  }
  if (newPackageJson.types) {
    packageJson.types = newPackageJson.types
  }
  if (newPackageJson.private) {
    packageJson.private = newPackageJson.private
  }
  if (newPackageJson.workspaces) {
    packageJson.workspaces = newPackageJson.workspaces
  }
  packageJson.typeCoverage = {
    atLeast: 100
  }
  await libs.writeFile(packageJsonFileName, JSON.stringify(packageJson, null, '  ') + '\n')
}

run().then(() => {
  console.log('initialize repository success.')
}).catch((error: Error) => {
  if (error instanceof Error) {
    console.log(error.message)
  } else {
    console.log(error)
  }
  process.exit(1)
})

const markdownlintConfig = `{
    "default": true,
    "line-length": false
}
`

const commitlintConfig = `module.exports = {
  extends: ['@commitlint/config-conventional']
}
`

async function getContext(): Promise<libs.Context> {
  const packages = await libs.readFile(packageJsonFileName)
  const packageJson: {
    name: string;
    description: string;
    repository: {
      type: string;
      url: string;
    } | string
    author: string;
    scripts: { [key: string]: string };
    bin: { [key: string]: string };
  } = JSON.parse(packages)
  const repositoryName = packageJson.name
  const componentShortName = libs.getComponentShortName(repositoryName)
  const componentTypeName = libs.upperCamelCase(componentShortName)
  let author = packageJson.author
  if (packageJson.repository) {
    let repositoryUrl: string | undefined
    if (typeof packageJson.repository === 'string') {
      repositoryUrl = packageJson.repository
    } else if (packageJson.repository.url) {
      repositoryUrl = packageJson.repository.url
    }
    if (repositoryUrl) {
      const items = repositoryUrl.split('/')
      if (items.length >= 4) {
        author = items[3]
      }
    }
  }
  return { repositoryName, componentShortName, componentTypeName, author, description: packageJson.description, authorName: packageJson.author }
}

async function selectProjectKind() {
  const projectKindAnswer = await libs.inquirer.prompt<{ projectKind: libs.ProjectKind }>({
    type: 'list',
    name: 'projectKind',
    message: 'Which kind of project?',
    choices: [
      libs.ProjectKind.backend,
      libs.ProjectKind.backendWithFrontend,
      libs.ProjectKind.frontend,
      libs.ProjectKind.CLIMonorepo,
      libs.ProjectKind.CLI,
      libs.ProjectKind.library,
      libs.ProjectKind.UIComponent,
      libs.ProjectKind.electron
    ]
  })
  return projectKindAnswer.projectKind
}

interface PackageJson {
  main?: string;
  module?: string;
  unpkg?: string;
  jsdelivr?: string;
  types?: string;
  scripts?: { [key: string]: string };
  bin?: { [key: string]: string };
  dependencies?: {
    tslib?: string;
  };
  private?: boolean
  workspaces?: string[]
  typeCoverage?: { atLeast: number }
}

const vscodeSetting = `{
    "typescript.tsdk": "./node_modules/typescript/lib"
}`

const issueTemplate = `#### Version(if relevant): 1.0.0

#### Environment(if relevant):

#### Code(if relevant):

\`\`\`
// code here
\`\`\`

#### Expected:

#### Actual:
`

const pullRequestTemplate = `#### Fixes(if relevant):

#### Checks

+ [ ] Contains Only One Commit(\`git reset\` then \`git commit\`)
+ [ ] Build Success(\`npm run build\`)
+ [ ] Lint Success(\`npm run lint\` to check, \`npm run fix\` to fix)
+ [ ] Add Test(if relevant, \`npm run test\` to check)
+ [ ] Add Demo(if relevant)
`

const githubCI = `name: Github CI

on:
  push:
    branches-ignore:
      - 'gh-pages'

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: \${{ matrix.node-version }}
    - run: git fetch --unshallow || true
    - run: yarn install --frozen-lockfile
    - run: npm run build
    - run: npm run lint
    - run: npm run test
      env:
        CI: true
`
