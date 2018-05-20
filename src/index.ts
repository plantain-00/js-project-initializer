import * as libs from './libs'
import { runUIComponent } from './ui-component'
import { runCLI } from './cli'
import { runLibrary } from './library'
import { runBackend } from './backend'
import { runFrontend } from './frontend'
import { runBackendWithFrontend } from './backend-with-frontend'
import { runElectron } from './electron'

const packageJsonFileName = 'package.json'

async function run() {
  const context = await getContext()

  const kind = await selectProjectKind()

  await libs.exec(`yarn add -DE typescript`)

  await libs.mkdir('.vscode')
  await libs.writeFile('.vscode/settings.json', vscodeSetting)

  await libs.exec(`yarn add -DE tslint tslint-config-standard tslint-sonarts`)
  await libs.exec(`yarn add -DE @commitlint/config-conventional @commitlint/cli`)
  await libs.writeFile('commitlint.config.js', commitlintConfig)
  await libs.exec(`yarn add -DE markdownlint-cli`)
  await libs.writeFile('.markdownlint.json', markdownlintConfig)

  await libs.mkdir('.github')
  await libs.writeFile('.github/ISSUE_TEMPLATE.md', issueTemplate)
  await libs.writeFile('.github/PULL_REQUEST_TEMPLATE.md', pullRequestTemplate)

  await libs.exec(`yarn add -DE rimraf`)

  let newPackageJson: {
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
  } = {}

  context.kind = kind

  switch (kind) {
    case libs.ProjectKind.UIComponent:
      newPackageJson = await runUIComponent(context)
      break
    case libs.ProjectKind.CLI:
      newPackageJson = await runCLI(context)
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
  const packageJson = JSON.parse(packages)
  if (newPackageJson.scripts) {
    packageJson.scripts = newPackageJson.scripts
  }
  if (newPackageJson.bin) {
    packageJson.bin = newPackageJson.bin
  }
  if (newPackageJson.dependencies && newPackageJson.dependencies.tslib) {
    if (!newPackageJson.dependencies) {
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
  await libs.writeFile(packageJsonFileName, JSON.stringify(packageJson, null, '  ') + '\n')
}

run().then(() => {
  console.log('initialize repository success.')
}).catch(error => {
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
    }
    author: string;
    scripts: { [key: string]: string };
    bin: { [key: string]: string };
  } = JSON.parse(packages)
  const repositoryName = packageJson.name
  const componentShortName = libs.getComponentShortName(repositoryName)
  const componentTypeName = libs.upperCamelCase(componentShortName)
  let author = packageJson.author
  if (packageJson.repository && packageJson.repository.url) {
    const items = packageJson.repository.url.split('/')
    if (items.length >= 4) {
      author = items[3]
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
      libs.ProjectKind.CLI,
      libs.ProjectKind.library,
      libs.ProjectKind.UIComponent,
      libs.ProjectKind.electron
    ]
  })
  return projectKindAnswer.projectKind
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

const pullRequestTemplate = `#### Fixes(if relevant): #1

#### Checks

+ [ ] Contains Only One Commit(\`git reset\` then \`git commit\`)
+ [ ] Build Success(\`npm run build\`)
+ [ ] Lint Success(\`npm run lint\` to check, \`npm run fix\` to fix)
+ [ ] Add Test(if relevant, \`npm run test\` to check)
+ [ ] Add Demo(if relevant)
`
