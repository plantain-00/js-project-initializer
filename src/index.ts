import * as libs from "./libs";
import { runUIComponent } from "./ui-component";
import { runCLI } from "./cli";
import { runLibrary } from "./library";
import { runBackend } from "./backend";
import { runFrontend } from "./frontend";
import { runBackendWithFrontend } from "./backend-with-frontend";
import { runElectron } from "./electron";

async function run() {
    const context = await getContext();

    const kind = await selectProjectKind();

    await libs.exec(`yarn add -DE typescript`);

    await libs.appendFile(".gitignore", gitignore);

    await libs.mkdir(".vscode");
    await libs.writeFile(".vscode/settings.json", vscodeSetting);

    await libs.exec(`yarn add -DE tslint`);
    await libs.writeFile("tslint.json", libs.tslint);

    await libs.exec(`yarn add -DE @commitlint/config-angular @commitlint/cli`);
    await libs.writeFile("commitlint.config.js", commitlintConfig);

    await libs.mkdir(".github");
    await libs.writeFile(".github/ISSUE_TEMPLATE.md", issueTemplate);
    await libs.writeFile(".github/PULL_REQUEST_TEMPLATE.md", pullRequestTemplate);

    await libs.exec(`yarn add -DE rimraf`);

    let newPackageJson: {
        scripts?: { [key: string]: string };
        bin?: { [key: string]: string };
        dependencies?: {
            tslib?: string;
        };
    } = {};

    switch (kind) {
        case libs.ProjectKind.UIComponent:
            newPackageJson = await runUIComponent(context);
            break;
        case libs.ProjectKind.CLI:
            newPackageJson = await runCLI(context);
            break;
        case libs.ProjectKind.library:
            newPackageJson = await runLibrary(context);
            break;
        case libs.ProjectKind.backend:
            newPackageJson = await runBackend(context);
            break;
        case libs.ProjectKind.frontend:
            newPackageJson = await runFrontend(context);
            break;
        case libs.ProjectKind.backendWithFrontend:
            newPackageJson = await runBackendWithFrontend(context);
            break;
        case libs.ProjectKind.electron:
            newPackageJson = await runElectron(context);
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
}

run().then(() => {
    libs.printInConsole("initialize repository success.");
}).catch(error => {
    libs.printInConsole(error);
    process.exit(1);
});

const commitlintConfig = `module.exports = {
  extends: ['@commitlint/config-angular']
}
`;

async function getContext(): Promise<libs.Context> {
    const packages = await libs.readFile("package.json");
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
    return { repositoryName, componentShortName, componentTypeName, author, description: packageJson.description };
}

async function selectProjectKind() {
    const projectKindAnswer = await libs.inquirer.prompt({
        type: "list",
        name: "projectKind",
        message: "Which kind of project?",
        choices: [
            libs.ProjectKind.backend,
            libs.ProjectKind.backendWithFrontend,
            libs.ProjectKind.frontend,
            libs.ProjectKind.CLI,
            libs.ProjectKind.library,
            libs.ProjectKind.UIComponent,
            libs.ProjectKind.electron,
        ],
    });
    return projectKindAnswer.projectKind as libs.ProjectKind;
}

const gitignore = `
# Source
.vscode
dist
**/*.js
**/*.css
!*.config.js
!**/*-*.js
!**/*.index.bundle.js
!**/*-*.css
service-worker.js
!*.index.bundle.js
#**/*-*.png
#index.html
*.data
`;

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

#### Checks

+ [ ] Contains Only One Commit(\`git reset\` then \`git commit\`)
+ [ ] Build Success(\`npm run build\`)
+ [ ] Lint Success(\`npm run lint\` to check, \`npm run fix\` to fix)
+ [ ] File Integrity(\`git add -A\` or add rules at \`.gitignore\` file)
+ [ ] Add Test(if relevant, \`npm run test\` to check)
+ [ ] Add Demo(if relevant)
`;
