import * as libs from "./libs";

export async function runBackend(context: libs.Context) {
    await libs.mkdir("src");

    await libs.exec(`npm i -DE @types/node`);
    await libs.exec(`npm i -DE jasmine @types/jasmine`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`src/index.ts`, srcIndex);
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    return {
        scripts: {
            clean: `rimraf dist/`,
            tsc: `tsc -p src/`,
            tslint: `tslint "src/**/*.ts" "src/**/*.tsx"`,
            test: "tsc -p spec && jasmine",
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

const srcIndex = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

printInConsole("app started!");
`;

const srcTsconfig = `{
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
