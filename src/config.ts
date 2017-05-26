export const tsconfig = `{
    "compilerOptions": {
        "target": "es5",
        "outDir": "../dist",
        "declaration": true,

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "jsx": "react",
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true
    }
}`;

export const jasmineTsconfig = `{
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
        "allowSyntheticDefaultImports": true
    }
}`;

export const tssdk = `{
    "typescript.tsdk": "./node_modules/typescript/lib"
}`;

export const tslint = `{
    "extends": "tslint:latest",
    "rules": {
        "forin": false,
        "interface-name": [
            false
        ],
        "max-line-length": [
            false
        ],
        "no-var-requires": false,
        "no-console": [
            false
        ],
        "no-string-literal": false,
        "no-reference": false,
        "ordered-imports": [
            false
        ],
        "object-literal-sort-keys": false,
        "variable-name": [
            true,
            "ban-keywords"
        ],
        "no-bitwise": false,
        "member-access": false,
        "arrow-parens": false,
        "array-type": [
            true,
            "array"
        ],
        "max-classes-per-file": [
            false
        ],
        "interface-over-type-literal": false
    }
}`;

export const npmignore = `.vscode
tslint.json
.travis.yml
tsconfig.json
webpack.config.js
src
rev-static.config.js
spec`;

export const travis = `language: node_js
node_js:
  - "6.0"
before_install:
  - sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
before_script:
  - npm i
script:
  - npm run build
  - npm run lint
  - npm run test
env:
  - CXX=g++-4.8
addons:
  apt:
    sources:
      - ubuntu-toolchain-r-test
    packages:
      - g++-4.8`;

export function getBadge(repositoryName: string, author: string, hasTravis: boolean, hasNpm: boolean) {
    let result = `[![Dependency Status](https://david-dm.org/${author}/${repositoryName}.svg)](https://david-dm.org/${author}/${repositoryName})
[![devDependency Status](https://david-dm.org/${author}/${repositoryName}/dev-status.svg)](https://david-dm.org/${author}/${repositoryName}#info=devDependencies)`;
    if (hasTravis) {
        result += `
[![Build Status](https://travis-ci.org/${author}/${repositoryName}.svg?branch=master)](https://travis-ci.org/${author}/${repositoryName})`;
    }
    if (hasNpm) {
        result += `
[![npm version](https://badge.fury.io/js/${repositoryName}.svg)](https://badge.fury.io/js/${repositoryName})
[![Downloads](https://img.shields.io/npm/dm/${repositoryName}.svg)](https://www.npmjs.com/package/${repositoryName})`;
    }
    return result;
}

export const gitIgnore = `
# Custom
.vscode
dist
demo/**/*.js
demo/**/index.html
!*.config.js
`;

export const webpack = `const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        index: "./index",
        vendor: "./vendor"
    },
    output: {
        path: path.join(__dirname, "static/"),
        filename: "[name].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["index", "vendor"]
        }),
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.min.js"
        }
    }
};`;

export const cli = `#!/usr/bin/env node
require("../dist/index.js");`;

export const babel = `{
  "presets": ["env"]
}`;

export const stylelint = `{
  "extends": "stylelint-config-standard"
}`;

export const swPrecache = `module.exports = {
  staticFileGlobs: [
    'app/css/**.css',
    'app/**.html',
    'app/images/**.*',
    'app/js/**.js',
  ],
  stripPrefix: 'app/',
  runtimeCaching: [{
    urlPattern: /this\\.is\\.a\\.regex/,
    handler: 'networkFirst'
  }],
  root: 'static/',
};
`;

export const githubIssueTemplate = `## Version(if relevant): 1.0.0

## Environment(if relevant):

## Code(if relevant):

\`\`\`
// code here
\`\`\`

## Expected:

## Actual:
`;

export const githubPullRequestTemplate = `## Fixed(if relevant): #1
`;
