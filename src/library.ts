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

const jasmineTsconfig = `{
    "compilerOptions": {
        "target": "es5",
        "declaration": false,

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "jsx": "react",
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "downlevelIteration": true
    }
}`;

export async function runLibrary(scripts: { [name: string]: string }, repositoryName: string, author: string, componentShortName: string, componentTypeName: string) {
    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    printInConsole(`setting index.ts...`);
    await libs.writeFile(`index.ts`, `export class ${componentTypeName} {
}
`);

    printInConsole(`setting tsconfig.json...`);
    await libs.writeFile(`tsconfig.json`, `{
    "compilerOptions": {
        "target": "es5",
        "declaration": true,

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`);
    scripts.tsc = `tsc`;
    buildScripts.push("npm run tsc");

    scripts.tslint = `tslint "*.ts"`;
    lintScripts.push("npm run tslint");

    printInConsole("setting .npmignore...");
    await libs.writeFile(".npmignore", npmignore);

    printInConsole("setting badges...");
    await libs.prependFile("README.md", getBadge(repositoryName, author));

    printInConsole("setting doc...");
    await libs.appendFile("README.md", `
#### install

\`npm i ${repositoryName}\`
`);

    printInConsole("installing jasmine...");
    await libs.exec(`npm i -DE jasmine`);
    printInConsole("installing @types/jasmine...");
    await libs.exec(`npm i -DE @types/jasmine`);
    printInConsole("init jasmine...");
    await libs.exec("./node_modules/.bin/jasmine init");
    printInConsole("setting spec/tsconfig.json...");
    await libs.writeFile("spec/tsconfig.json", jasmineTsconfig);
    scripts.test = "tsc -p spec && jasmine";

    if (!scripts.build) {
        scripts.build = buildScripts.join(" && ");
    }
    if (!scripts.lint) {
        scripts.lint = lintScripts.join(" && ");
    }

    const packages = await libs.readFile("package.json");
    const packageJson = JSON.parse(packages);
    packageJson.scripts = scripts;
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    printInConsole("success.");
}
