import * as libs from "./libs";
import { ProjectKind, printInConsole } from "./libs";
import { runUIComponent } from "./ui-component";
import { runCLI } from "./cli";
import { runLibrary } from "./library";
import { runBackend } from "./backend";
import { runFrontend } from "./frontend";
import { runBackendWithFrontend } from "./backend-with-frontend";

async function run() {
    const context = await getContext();

    const kind = await selectProjectKind();

    printInConsole("installing typescript...");
    await libs.exec(`npm i -DE typescript@rc`);

    printInConsole("setting .gitignore...");
    await libs.appendFile(".gitignore", gitignore);

    printInConsole("setting .travis.yml...");
    await libs.writeFile(".travis.yml", travisYml);

    printInConsole("setting tssdk...");
    await libs.mkdir(".vscode");
    await libs.writeFile(".vscode/settings.json", vscodeSetting);

    printInConsole("installing tslint...");
    await libs.exec(`npm i -DE tslint`);
    printInConsole("setting tslint.json...");
    await libs.writeFile("tslint.json", libs.tslint);

    printInConsole("setting github issue/pull request template...");
    await libs.mkdir(".github");
    await libs.writeFile(".github/ISSUE_TEMPLATE.md", issueTemplate);
    await libs.writeFile(".github/PULL_REQUEST_TEMPLATE.md", pullRequestTemplate);

    printInConsole("installing rimraf...");
    await libs.exec(`npm i -DE rimraf`);

    let newPackageJson: {
        scripts?: { [key: string]: string };
        bin?: { [key: string]: string };
        dependencies?: {
            tslib?: string;
        };
    } = {};

    switch (kind) {
        case ProjectKind.UIComponent:
            newPackageJson = await runUIComponent(context);
            break;
        case ProjectKind.CLI:
            newPackageJson = await runCLI(context);
            break;
        case ProjectKind.library:
            newPackageJson = await runLibrary(context);
            break;
        case ProjectKind.backend:
            newPackageJson = await runBackend(context);
            break;
        case ProjectKind.frontend:
            newPackageJson = await runFrontend(context);
            break;
        case ProjectKind.backendWithFrontend:
            newPackageJson = await runBackendWithFrontend(context);
            break;
    }

    const packages = await libs.readFile("package.json");
    const packageJson = JSON.parse(packages);
    if (newPackageJson.scripts) {
        packageJson.scripts = newPackageJson.scripts;
    }
    if (newPackageJson.bin) {
        packageJson.bin = newPackageJson.bin;
    }
    if (newPackageJson.dependencies && newPackageJson.dependencies.tslib) {
        packageJson.dependencies.tslib = newPackageJson.dependencies.tslib;
    }
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    printInConsole("success.");
}

run().catch(error => {
    printInConsole(error);
});

async function getContext(): Promise<libs.Context> {
    const packages = await libs.readFile("package.json");
    const packageJson: {
        name: string;
        repository: {
            type: string;
            url: string;
        }
        author: string;
        scripts: { [key: string]: string };
        bin: { [key: string]: string };
    } = JSON.parse(packages);
    const repositoryName = packageJson.name;
    const componentShortName = libs.getComponentShortName(repositoryName);
    const componentTypeName = libs.upperCamelCase(componentShortName);
    let author = packageJson.author;
    if (packageJson.repository && packageJson.repository.url) {
        const items = packageJson.repository.url.split("/");
        if (items.length >= 4) {
            author = items[3];
        }
    }
    return { repositoryName, componentShortName, componentTypeName, author };
}

async function selectProjectKind() {
    const projectKindAnswer = await libs.inquirer.prompt({
        type: "list",
        name: "projectKind",
        message: "Which kind of project?",
        choices: [
            ProjectKind.backend,
            ProjectKind.backendWithFrontend,
            ProjectKind.frontend,
            ProjectKind.CLI,
            ProjectKind.library,
            ProjectKind.UIComponent,
        ],
    });
    return projectKindAnswer.projectKind as ProjectKind;
}

const gitignore = `
# Source
.vscode
dist
**/*.js
**/*.css
!*.config.js
!**/*-*.js
!**/*-*.css
service-worker.js
`;

const travisYml = `language: node_js
node_js:
  - "8"
before_install:
  - sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
before_script:
  - npm i
script:
  - npm run build
  - npm run lint
  - npm run test
env:
  - CXX=g++-4.8
addons:
  apt:
    sources:
      - ubuntu-toolchain-r-test
    packages:
      - g++-4.8`;

const vscodeSetting = `{
    "typescript.tsdk": "./node_modules/typescript/lib"
}`;

const issueTemplate = `#### Version(if relevant): 1.0.0

#### Environment(if relevant):

#### Code(if relevant):

\`\`\`
// code here
\`\`\`

#### Expected:

#### Actual:
`;

const pullRequestTemplate = `#### Fixes(if relevant): #1
`;
