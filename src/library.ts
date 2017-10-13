import * as libs from "./libs";

export async function runLibrary(context: libs.Context) {
    context.isNpmPackage = true;

    await libs.exec(`yarn add -DE jasmine @types/jasmine`);
    await libs.exec(`yarn add -DE clean-release`);
    await libs.exec(`yarn add -DE rimraf`);
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -DE rollup rollup-plugin-node-resolve rollup-plugin-uglify`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE no-unused-export`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.mkdir("src");
    await libs.writeFile(`src/index.ts`, index(context));
    await libs.writeFile(`src/tsconfig.base.json`, tsconfigBase);
    await libs.writeFile(`src/tsconfig.nodejs.json`, tsconfigNodejs);
    await libs.writeFile(`src/tsconfig.browser.json`, tsconfigBrowser);

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml);
    await libs.writeFile("clean-release.config.js", cleanReleaseConfigJs);
    await libs.writeFile("rollup.config.js", rollupConfigJs(context));
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));

    await libs.writeFile("spec/tsconfig.json", libs.tsconfigJson);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    return {
        scripts: {
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: "clean-scripts fix",
            release: "clean-scripts release",
        },
    };
}

function cleanScriptsConfigJs(context: libs.Context) {
    return `const childProcess = require('child_process')
const util = require('util')

const execAsync = util.promisify(childProcess.exec)

const tsFiles = \`"src/**/*.ts" "spec/**/*.ts"\`
const jsFiles = \`"*.config.js"\`

module.exports = {
  build: [
    'rimraf dist/',
    {
      back: 'tsc -p src/tsconfig.nodejs.json',
      front: [
        'tsc -p src/tsconfig.browser.json',
        'rollup --config rollup.config.js'
      ]
    }
  ],
  lint: {
    ts: \`tslint \${tsFiles}\`,
    js: \`standard \${jsFiles}\`,
    export: \`no-unused-export \${tsFiles}\`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(\`generated files doesn't match.\`)
      }
    }
  ],
  fix: {
    ts: \`tslint --fix \${tsFiles}\`,
    js: \`standard --fix \${jsFiles}\`
  },
  release: \`clean-release\`
}
`;
}

const tsconfigNodejs = `{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "target": "esnext",
        "outDir": "../dist/nodejs",
        "module": "commonjs",
        "newLine": "LF"
    }
}
`;

const tsconfigBrowser = `{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "target": "es5",
        "outDir": "../dist/browser",
        "module": "esnext",
        "moduleResolution": "node",
        "newLine": "LF"
    }
}
`;

function rollupConfigJs(context: libs.Context) {
    return `import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/index.js',
  name: '${context.componentTypeName}',
  plugins: [resolve(), uglify()],
  output: {
    file: 'dist/${context.repositoryName}.min.js',
    format: 'umd'
  }
}
`;
}

const cleanReleaseConfigJs = `module.exports = {
  include: [
    'dist/**/*',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  base: 'dist',
  postScript: 'npm publish [dir] --access public'
}
`;

function readMeDocument(context: libs.Context) {
    return `
#### install

\`yarn add ${context.repositoryName}\`

#### usage

\`\`\`ts
import ${context.componentTypeName} from "${context.repositoryName}";
// <script src="./node_modules/${context.repositoryName}/${context.repositoryName}.min.js"></script>
\`\`\`
`;
}

const tsconfigBase = `{
    "compilerOptions": {
        "target": "es5",
        "declaration": true,

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "newLine": "LF"
    }
}`;

function index(context: libs.Context) {
    return `/**
 * @public
 */
export default class ${context.componentTypeName} {
}
`;
}
