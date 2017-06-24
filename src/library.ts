import * as libs from "./libs";

export async function runLibrary(context: libs.Context) {
    await libs.exec(`npm i -DE jasmine`);
    await libs.exec(`npm i -DE @types/jasmine`);
    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`index.ts`, getSource(context.componentTypeName));
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.writeFile(".npmignore", npmignore);
    await libs.prependFile("README.md", getBadge(context.repositoryName, context.author));
    await libs.appendFile("README.md", getDocument(context.repositoryName));
    await libs.writeFile("spec/tsconfig.json", jasmineTsconfig);

    return {
        scripts: {
            tsc: `tsc`,
            tslint: `tslint "*.ts"`,
            test: "tsc -p spec && jasmine",
            build: [
                "npm run tsc",
            ].join(" && "),
            lint: [
                "npm run tslint",
            ].join(" && "),
        },
    };
}

function getDocument(repositoryName: string) {
    return `
#### install

\`npm i ${repositoryName}\`
`;
}

const tsconfig = `{
    "compilerOptions": {
        "target": "es5",
        "declaration": true,

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`;

function getSource(componentTypeName: string) {
    return `export class ${componentTypeName} {
}
`;
}

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
