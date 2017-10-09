import * as libs from "./libs";

export async function runCLI(context: libs.Context) {
    context.isNpmPackage = true;

    await libs.mkdir("src");
    await libs.mkdir("bin");

    await libs.exec(`yarn add -DE @types/node`);
    await libs.exec(`yarn add -DE jasmine @types/jasmine`);
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -E minimist`);
    await libs.exec(`yarn add -DE @types/minimist`);
    await libs.exec(`yarn add -DE clean-release`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE no-unused-export`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`src/index.ts`, source(context));
    await libs.writeFile(`src/lib.d.ts`, libDTs);
    await libs.writeFile(`src/tsconfig.json`, tsconfig);

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml);
    await libs.writeFile("clean-release.config.js", cleanReleaseConfigJs);
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));

    await libs.writeFile(`bin/${context.repositoryName}`, binConfig);

    await libs.exec(`chmod 755 bin/${context.repositoryName}`);

    await libs.writeFile("spec/tsconfig.json", libs.tsconfigJson);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    return {
        scripts: {
            demoTest: `clean-scripts test[2]`,
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
    return `const childProcess = require('child_process')
const util = require('util')

const execAsync = util.promisify(childProcess.exec)

module.exports = {
  build: [
    'rimraf dist/',
    'tsc -p src/'
  ],
  lint: {
    ts: \`tslint "src/**/*.ts"\`,
    js: \`standard "**/*.config.js"\`,
    export: \`no-unused-export "src/**/*.ts" "spec/*.ts"\`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    \`node dist/index.js --supressError > spec/result.txt\`,
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(\`generated files doesn't match.\`)
      }
    }
  ],
  fix: {
    ts: \`tslint --fix "src/**/*.ts"\`,
    js: \`standard --fix "**/*.config.js"\`
  },
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

\`yarn add ${context.repositoryName} -g\`

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
        "skipLibCheck": true,
        "newLine": "LF"
    }
}`;

function source(context: libs.Context) {
    return `import * as minimist from "minimist";
import * as packageJson from "../package.json";

let suppressError = false;

function printInConsole(message: any) {
    if (message instanceof Error) {
        message = message.message;
    }
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

    suppressError = argv.suppressError;

    // todo
}

executeCommandLine().then(() => {
    printInConsole("${context.repositoryName} success.");
}, error => {
    printInConsole(error);
    if (!suppressError) {
        process.exit(1);
    }
});
`;
}

const libDTs = `declare module "*.json" {
    export const version: string;
}
`;
