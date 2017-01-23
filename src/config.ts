export const tsconfig = `{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "noImplicitAny": true,
        "sourceMap": true,
        "noUnusedLocals": true,
        "noImplicitThis": true,
        "strictNullChecks": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "jsx": "react",
        "outDir": "./dist",
        "declaration": true,
        "experimentalDecorators": true
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
rev-static.config.json
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

export const badge = `[![Dependency Status](https://david-dm.org/plantain-00/repository-name.svg)](https://david-dm.org/plantain-00/repository-name)
[![devDependency Status](https://david-dm.org/plantain-00/repository-name/dev-status.svg)](https://david-dm.org/plantain-00/repository-name#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/repository-name.svg?branch=master)](https://travis-ci.org/plantain-00/repository-name)
[![npm version](https://badge.fury.io/js/repository-name.svg)](https://badge.fury.io/js/repository-name)
[![Downloads](https://img.shields.io/npm/dm/repository-name.svg)](https://www.npmjs.com/package/repository-name)`;

export const revStatic = `{
    "inputFiles": [
        "demo/foo.js",
        "demo/bar.css",
        "demo/baz.ejs.html",
        "demo/qux.ejs.html"
    ],
    "outputFiles": [
        "demo/baz.html",
        "demo/qux.html"
    ],
    "json": false,
    "ejsOptions": {
        "rmWhitespace": true
    },
    "sha": 256
}`;

export const webpack = `const webpack = require("webpack");

module.exports = {
    entry: {
        index: "./index",
        vendor: "./vendor"
    },
    output: {
        filename: "[name].bundle.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
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
