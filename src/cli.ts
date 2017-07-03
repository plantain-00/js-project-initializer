import * as libs from "./libs";

export async function runCLI(context: libs.Context) {
    context.isNpmPackage = true;

    await libs.mkdir("src");
    await libs.mkdir("bin");

    await libs.exec(`npm i -DE @types/node`);
    await libs.exec(`npm i -DE jasmine @types/jasmine`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`src/index.ts`, source);
    await libs.writeFile(`src/tsconfig.json`, tsconfig);

    await libs.writeFile(".npmignore", libs.npmignore);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));

    await libs.writeFile(`bin/${context.repositoryName}`, binConfig);

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    return {
        scripts: {
            clean: `rimraf dist/`,
            tsc: `tsc -p src/`,
            tslint: `tslint "src/**/*.ts"`,
            test: "tsc -p spec && jasmine",
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

function readMeDocument(context: libs.Context) {
    return `
#### install

\`npm i ${context.repositoryName} -g\`

#### usage

run \`${context.repositoryName}\``;
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

const specTsconfig = `{
    "compilerOptions": {
        "target": "esnext",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`;
