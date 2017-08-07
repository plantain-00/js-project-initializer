import * as libs from "./libs";

export async function runCLI(context: libs.Context) {
    context.isNpmPackage = true;

    await libs.mkdir("src");
    await libs.mkdir("bin");

    await libs.exec(`npm i -DE @types/node`);
    await libs.exec(`npm i -DE jasmine @types/jasmine`);
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -SE minimist`);
    await libs.exec(`npm i -DE @types/minimist`);
    await libs.exec(`npm i -DE clean-release`);
    await libs.exec(`npm i -DE clean-scripts`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`src/index.ts`, source);
    await libs.writeFile(`src/lib.d.ts`, libDTs);
    await libs.writeFile(`src/tsconfig.json`, tsconfig);

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("clean-release.config.js", cleanReleaseConfigJs);
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));

    await libs.writeFile(`bin/${context.repositoryName}`, binConfig);

    await libs.exec(`chmod 755 bin/${context.repositoryName}`);

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    return {
        scripts: {
            demoTest: `./bin/${context.repositoryName}`,
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: "clean-scripts fix",
            release: "clean-scripts release",
        },
        bin: {
            [context.repositoryName]: `bin/${context.repositoryName}`,
        },
    };
}

function cleanScriptsConfigJs(context: libs.Context) {
    return `module.exports = {
  build: [
    'rimraf dist/',
    'tsc -p src/'
  ],
  lint: {
    ts: \`tslint "src/**/*.ts"\`,
    js: \`standard "**/*.config.js"\`
  },
  test: [
    'tsc -p spec',
    'jasmine'
  ],
  fix: \`standard --fix "**/*.config.js"\`,
  release: \`clean-release\`
}
`;
}

const cleanReleaseConfigJs = `module.exports = {
  include: [
    'bin/*',
    'dist/*.js',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  postScript: 'npm publish [dir] --access public'
}
`;

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

const source = `import * as minimist from "minimist";
import * as packageJson from "../package.json";

function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

function showToolVersion() {
    printInConsole(\`Version: \${packageJson.version}\`);
}

async function executeCommandLine() {
    const argv = minimist(process.argv.slice(2), { "--": true });

    const showVersion = argv.v || argv.version;
    if (showVersion) {
        showToolVersion();
        return;
    }
    // todo
}

try {
    executeCommandLine().then(() => {
        printInConsole("success.");
    }, error => {
        if (error.stdout) {
            printInConsole(error.stdout);
            process.exit(error.status);
        } else {
            printInConsole(error);
            process.exit(1);
        }
    });
} catch (error) {
    if (error.stdout) {
        printInConsole(error.stdout);
        process.exit(error.status);
    } else {
        printInConsole(error);
        process.exit(1);
    }
}
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

const libDTs = `declare module "*.json" {
    export const version: string;
}
`;
