import * as libs from "./libs";

export async function runLibrary(context: libs.Context) {
    context.isNpmPackage = true;

    await libs.exec(`npm i -DE jasmine`);
    await libs.exec(`npm i -DE @types/jasmine`);
    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`index.ts`, index(context));
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.writeFile(".npmignore", libs.npmignore);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile("spec/tsconfig.json", specTsconfig);

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

function readMeDocument(context: libs.Context) {
    return `
#### install

\`npm i ${context.repositoryName}\`
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

function index(context: libs.Context) {
    return `export class ${context.componentTypeName} {
}
`;
}

const specTsconfig = `{
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
