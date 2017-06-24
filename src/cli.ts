import * as libs from "./libs";
import { printInConsole } from "./libs";

const npmignore = `.vscode
.github
tslint.json
.travis.yml
tsconfig.json
webpack.config.js
src
rev-static.config.js
spec
demo
`;

function getBadge(repositoryName: string, author: string) {
    return `[![Dependency Status](https://david-dm.org/${author}/${repositoryName}.svg)](https://david-dm.org/${author}/${repositoryName})
[![devDependency Status](https://david-dm.org/${author}/${repositoryName}/dev-status.svg)](https://david-dm.org/${author}/${repositoryName}#info=devDependencies)
[![Build Status](https://travis-ci.org/${author}/${repositoryName}.svg?branch=master)](https://travis-ci.org/${author}/${repositoryName})
[![npm version](https://badge.fury.io/js/${repositoryName}.svg)](https://badge.fury.io/js/${repositoryName})
[![Downloads](https://img.shields.io/npm/dm/${repositoryName}.svg)](https://www.npmjs.com/package/${repositoryName})

`;
}

export async function runCLI(scripts: { [name: string]: string }, repositoryName: string, author: string, componentShortName: string, componentTypeName: string) {
    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    const demoDirectory = ".";
    await libs.mkdir(demoDirectory);
    const srcDirectory = "src";
    await libs.mkdir(srcDirectory);

    printInConsole("installing @types/node...");
    await libs.exec(`npm i -DE @types/node`);
    printInConsole(`setting ${srcDirectory}/index.ts...`);
    await libs.writeFile(`${srcDirectory}/index.ts`, `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

async function executeCommandLine() {
    // todo
}

executeCommandLine().catch(error => {
    printInConsole(error);
});
`);

    printInConsole(`setting ${srcDirectory}/tsconfig.json...`);
    await libs.writeFile(`${srcDirectory}/tsconfig.json`, `{
    "compilerOptions": {
        "target": "esnext",
        "outDir": "../dist",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`);
    scripts.tsc = `tsc -p ${srcDirectory}/`;
    buildScripts.push("npm run tsc");

    scripts.tslint = `tslint "${srcDirectory}/**/*.ts" "${srcDirectory}/**/*.tsx"`;
    lintScripts.push("npm run tslint");

    printInConsole("setting .npmignore...");
    await libs.writeFile(".npmignore", npmignore);

    printInConsole("setting badges...");
    await libs.prependFile("README.md", getBadge(repositoryName, author));

    printInConsole("setting doc...");
    await libs.appendFile("README.md", `
#### install

\`npm i ${repositoryName} -g\`

#### usage

run \`${repositoryName}\``);

    let bin: { [key: string]: string } | undefined;
    printInConsole("setting cli...");
    await libs.mkdir("bin");
    await libs.writeFile(`bin/${repositoryName}`, `#!/usr/bin/env node
require("../dist/index.js");`);
    bin = {
        [repositoryName]: `bin/${repositoryName}`,
    };

    scripts.clean = `rimraf dist/`;
    buildScripts.unshift("npm run clean");

    if (!scripts.build) {
        scripts.build = buildScripts.join(" && ");
    }
    if (!scripts.lint) {
        scripts.lint = lintScripts.join(" && ");
    }

    const packages = await libs.readFile("package.json");
    const packageJson = JSON.parse(packages);
    packageJson.scripts = scripts;
    if (bin) {
        packageJson.bin = bin;
    }
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    printInConsole("success.");
}
