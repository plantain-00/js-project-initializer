import * as libs from "./libs";

export async function runCLI(context: libs.Context) {
    await libs.mkdir("src");
    await libs.mkdir("bin");

    await libs.exec(`npm i -DE @types/node`);

    await libs.writeFile(`src/index.ts`, source);
    await libs.writeFile(`src/tsconfig.json`, tsconfig);

    await libs.writeFile(".npmignore", npmignore);
    await libs.prependFile("README.md", getBadge(context.repositoryName, context.author));
    await libs.appendFile("README.md", getDocument(context.repositoryName));

    await libs.writeFile(`bin/${context.repositoryName}`, binConfig);

    return {
        scripts: {
            clean: `rimraf dist/`,
            tsc: `tsc -p src/`,
            tslint: `tslint "src/**/*.ts"`,
            build: [
                "npm run clean",
                "npm run tsc",
            ].join(" && "),
            lint: [
                "npm run tslint",
            ].join(" && "),
        },
        bin: {
            [context.repositoryName]: `bin/${context.repositoryName}`,
        },
    };
}

const binConfig = `#!/usr/bin/env node
require("../dist/index.js");`;

function getDocument(repositoryName: string) {
    return `
#### install

\`npm i ${repositoryName} -g\`

#### usage

run \`${repositoryName}\``;
}

const tsconfig = `{
    "compilerOptions": {
        "target": "esnext",
        "outDir": "../dist",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`;

const source = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

async function executeCommandLine() {
    // todo
}

executeCommandLine().catch(error => {
    printInConsole(error);
});
`;

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
