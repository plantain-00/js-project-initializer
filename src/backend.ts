import * as libs from "./libs";

export async function runBackend(context: libs.Context) {

    await libs.appendFile(".gitignore", libs.gitignore(context));

    await libs.exec(`yarn add -DE @types/node`);
    await libs.exec(`yarn add -DE jasmine @types/jasmine`);
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE no-unused-export`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.mkdir("src");
    await libs.writeFile(`src/index.ts`, srcIndex);
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml(context));
    await libs.writeFile("clean-release.config.js", getCleanReleaseConfigJs(context));
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));
    await libs.writeFile("Dockerfile", dockerfile);

    await libs.mkdir("spec");
    await libs.writeFile("spec/tsconfig.json", libs.tsconfigJson);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    return {
        scripts: {
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: "clean-scripts fix",
            watch: "clean-scripts watch",
        },
    };
}

const port = 8000;

const dockerfile = `FROM node:alpine
WORKDIR /app
ADD . /app
RUN apk add --no-cache make gcc g++ python && yarn --production
EXPOSE ${port}
CMD ["node","dist/index.js"]
`;

function cleanScriptsConfigJs(context: libs.Context) {
    return `const { checkGitStatus } = require('clean-scripts')

const tsFiles = \`"src/**/*.ts" "spec/**/*.ts" "test/**/*.ts"\`
const jsFiles = \`"*.config.js"\`

const tscSrcCommand = 'tsc -p src/'

module.exports = {
  build: [
    'rimraf dist/',
    tscSrcCommand
  ],
  lint: {
    ts: \`tslint \${tsFiles}\`,
    js: \`standard \${jsFiles}\`,
    export: \`no-unused-export \${tsFiles}\`,
    commit: \`commitlint --from=HEAD~1\`
  },
  test: [
    'tsc -p spec',
    'jasmine',
    () => checkGitStatus()
  ],
  fix: {
    ts: \`tslint --fix \${tsFiles}\`,
    js: \`standard --fix \${jsFiles}\`
  },
  watch: \`\${tscSrcCommand} --watch\`
}
`;
}

function getCleanReleaseConfigJs(context: libs.Context) {
  return `module.exports = {
  include: [
    'dist/*.js',
    'LICENSE',
    'package.json',
    'yarn.lock',
    'README.md'
  ],
  exclude: [
  ],
  releaseRepository: 'https://github.com/${context.author}/${context.repositoryName}-release.git',
  postScript: [
    'cd "[dir]" && rm -rf .git',
    'cp Dockerfile "[dir]"',
    'cd "[dir]" && docker build -t ${context.author}/${context.repositoryName} . && docker push ${context.author}/${context.repositoryName}'
  ]
}
`;
}

function readMeDocument(context: libs.Context) {
  return `#### install

\`\`\`bash
git clone https://github.com/${context.author}/${context.repositoryName}-release.git . --depth=1 && yarn add --production
\`\`\`

#### docker

\`\`\`bash
docker run -d -p ${port}:${port} ${context.author}/${context.repositoryName}
\`\`\`
`;
}

const srcIndex = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

printInConsole("app started!");

process.on("SIGINT", () => {
  process.exit();
});

process.on("SIGTERM", () => {
  process.exit();
});
`;

const srcTsconfig = `{
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
