import * as libs from "./libs";

export async function runBackend(context: libs.Context) {
    await libs.mkdir("src");

    await libs.exec(`npm i -DE @types/node`);
    await libs.exec(`npm i -DE jasmine @types/jasmine`);
    await libs.exec(`npm i -DE clean-release`);
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -DE clean-scripts`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`src/index.ts`, srcIndex);
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("clean-release.config.js", getCleanReleaseConfigJs(context));
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
    'tsc -p src/'
  ],
  lint: {
    ts: \`tslint "src/**/*.ts" "src/**/*.tsx"\`,
    js: \`standard "**/*.config.js"\`
  },
  test: [
    'tsc -p spec',
    'jasmine'
  ],
  fix: {
    ts: \`tslint --fix "src/**/*.ts" "src/**/*.tsx"\`,
    js: \`standard --fix "**/*.config.js"\`
  },
  release: \`clean-release\`
}
`;
}

function getCleanReleaseConfigJs(context: libs.Context) {
  return `module.exports = {
  include: [
    'dist/*.js',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  releaseRepository: 'https://github.com/${context.author}/${context.repositoryName}-release.git'
}
`;
}

function readMeDocument(context: libs.Context) {
  return `#### install

\`\`\`bash
git clone https://github.com/${context.author}/${context.repositoryName}-release.git . --depth=1 && npm i --production
\`\`\`
`;
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
