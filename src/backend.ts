import * as libs from "./libs";

export async function runBackend(context: libs.Context) {
    await libs.mkdir("src");

    await libs.exec(`npm i -DE @types/node`);

    await libs.writeFile(`src/index.ts`, source);
    await libs.writeFile(`src/tsconfig.json`, tsconfig);

    await libs.prependFile("README.md", getBadge(context.repositoryName, context.author));

    return {
        scripts: {
            clean: `rimraf dist/`,
            tsc: `tsc -p src/`,
            tslint: `tslint "src/**/*.ts" "src/**/*.tsx"`,
            build: [
                "npm run clean",
                "npm run tsc",
            ].join(" && "),
            lint: [
                "npm run tslint",
            ].join(" && "),
        },
    };
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
