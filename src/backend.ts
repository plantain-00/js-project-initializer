import * as libs from "./libs";
import { printInConsole } from "./libs";

export async function runBackend(scripts: { [name: string]: string }, repositoryName: string, author: string, componentShortName: string, componentTypeName: string) {
    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    await libs.mkdir("src");

    printInConsole("installing @types/node...");
    await libs.exec(`npm i -DE @types/node`);
    printInConsole(`setting src/index.ts...`);
    await libs.writeFile(`src/index.ts`, source);

    printInConsole(`setting src/tsconfig.json...`);
    await libs.writeFile(`src/tsconfig.json`, tsconfig);
    scripts.tsc = `tsc -p src/`;
    buildScripts.push("npm run tsc");

    scripts.tslint = `tslint "src/**/*.ts" "src/**/*.tsx"`;
    lintScripts.push("npm run tslint");

    printInConsole("setting badges...");
    await libs.prependFile("README.md", getBadge(repositoryName, author));

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
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    printInConsole("success.");
}

const source = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

printInConsole("app started!");
`;

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

function getBadge(repositoryName: string, author: string) {
    return `[![Dependency Status](https://david-dm.org/${author}/${repositoryName}.svg)](https://david-dm.org/${author}/${repositoryName})
[![devDependency Status](https://david-dm.org/${author}/${repositoryName}/dev-status.svg)](https://david-dm.org/${author}/${repositoryName}#info=devDependencies)
[![Build Status](https://travis-ci.org/${author}/${repositoryName}.svg?branch=master)](https://travis-ci.org/${author}/${repositoryName})

`;
}
