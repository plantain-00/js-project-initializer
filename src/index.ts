import * as libs from "./libs";
import { ProjectKind, printInConsole } from "./libs";
import { runUIComponent } from "./ui-component";
import { runCLI } from "./cli";
import { runLibrary } from "./library";
import { runBackend } from "./backend";
import { runFrontend } from "./frontend";
import { runBackendWithFrontend } from "./backend-with-frontend";

async function run() {
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

    const scripts: { [name: string]: string } = {};

    let author = packageJson.author;
    if (packageJson.repository && packageJson.repository.url) {
        const items = packageJson.repository.url.split("/");
        if (items.length >= 4) {
            author = items[3];
        }
    }

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

    switch (kind) {
        case ProjectKind.UIComponent:
            await runUIComponent(scripts, repositoryName, author, componentShortName, componentTypeName);
            break;
        case ProjectKind.CLI:
            await runCLI(scripts, repositoryName, author, componentShortName, componentTypeName);
            break;
        case ProjectKind.library:
            await runLibrary(scripts, repositoryName, author, componentShortName, componentTypeName);
            break;
        case ProjectKind.backend:
            await runBackend(scripts, repositoryName, author, componentShortName, componentTypeName);
            break;
        case ProjectKind.frontend:
            await runFrontend(scripts, repositoryName, author, componentShortName, componentTypeName);
            break;
        case ProjectKind.backendWithFrontend:
            await runBackendWithFrontend(scripts, repositoryName, author, componentShortName, componentTypeName);
            break;
    }

    printInConsole("success.");
}

run().catch(error => {
    printInConsole(error);
});

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
