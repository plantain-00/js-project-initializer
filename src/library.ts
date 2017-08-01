import * as libs from "./libs";

export async function runLibrary(context: libs.Context) {
    context.isNpmPackage = true;

    await libs.mkdir("src");

    await libs.exec(`npm i -DE jasmine @types/jasmine`);
    await libs.exec(`npm i -DE clean-release`);
    await libs.exec(`npm i -DE rimraf`);
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -DE rollup rollup-plugin-node-resolve rollup-plugin-uglify`);
    await libs.exec(`npm i -DE clean-scripts`);

    await libs.exec("./node_modules/.bin/jasmine init");

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

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
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
    return `module.exports = {
  build: [
    'rimraf dist/',
    'tsc -p src/tsconfig.nodejs.json',
    'tsc -p src/tsconfig.browser.json',
    'rollup --config rollup.config.js'
  ],
  lint: [
    \`tslint "*.ts" "spec/*.ts"\`,
    \`standard "**/*.config.js"\`
  ],
  test: [
    'tsc -p spec',
    'jasmine'
  ],
  fix: [
    \`standard --fix "**/*.config.js"\`
  ],
  release: [
    \`clean-release\`
  ]
}
`;
}

const tsconfigNodejs = `{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "target": "esnext",
        "outDir": "../dist/nodejs",
        "module": "commonjs"
    }
}
`;

const tsconfigBrowser = `{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "target": "es5",
        "outDir": "../dist/browser",
        "module": "esnext",
        "moduleResolution": "node"
    }
}
`;

function rollupConfigJs(context: libs.Context) {
    return `import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'dist/browser/index.js',
  dest: 'dist/${context.repositoryName}.min.js',
  format: 'umd',
  moduleName: '${context.componentTypeName}',
  plugins: [resolve(), uglify()]
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

\`npm i ${context.repositoryName}\`
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
        "skipLibCheck": true
    }
}`;

function index(context: libs.Context) {
    return `export default class ${context.componentTypeName} {
}
`;
}

const specTsconfig = `{
    "compilerOptions": {
        "target": "esnext",
        "declaration": false,

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "downlevelIteration": true
    }
}`;
