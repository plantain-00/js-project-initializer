import * as inquirer from "inquirer";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import upperCamelCase = require("uppercamelcase");

export { inquirer, upperCamelCase };

export function exec(command: string) {
    return new Promise<void>((resolve, reject) => {
        printInConsole(`${command}...`);
        const subProcess = childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
        subProcess.stdout.pipe(process.stdout);
        subProcess.stderr.pipe(process.stderr);
    });
}

export function writeFile(filename: string, data: string) {
    return new Promise<void>((resolve, reject) => {
        printInConsole(`setting ${filename}...`);
        fs.writeFile(filename, data, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export function readFile(filename: string) {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filename, "utf8", (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export function appendFile(filename: string, data: string) {
    return new Promise<void>((resolve, reject) => {
        printInConsole(`setting ${filename}...`);
        fs.appendFile(filename, data, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export function prependFile(filename: string, data: string) {
    return readFile(filename).then(context => writeFile(filename, data + context));
}

export function mkdir(dir: string) {
    return new Promise<void>((resolve, reject) => {
        mkdirp(dir, error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

export const enum ProjectKind {
    CLI = "CLI",
    UIComponent = "UI Component",
    frontend = "frontend",
    backend = "backend",
    backendWithFrontend = "backend with frontend",
    library = "library",
    electron = "electron",
}

export function getComponentShortName(componentName: string) {
    return (componentName.endsWith("component") && componentName.length - "component".length - 1 > 0)
        ? componentName.substring(0, componentName.length - "component".length - 1)
        : componentName;
}

export const tslint = `{
    "extends": "tslint:latest",
    "rules": {
        "max-line-length": [
            false
        ],
        "ordered-imports": [
            false
        ],
        "object-literal-sort-keys": false,
        "member-access": false,
        "arrow-parens": false,
        "array-type": [
            true,
            "array"
        ],
        "max-classes-per-file": [
            false
        ],
        "interface-over-type-literal": false,
        "interface-name": [
            true,
            "never-prefix"
        ],
        "no-unused-expression": [
            true,
            "allow-new"
        ],
        "no-submodule-imports": false
    }
}`;

export type Context = {
    repositoryName: string;
    componentShortName: string;
    componentTypeName: string;
    author: string;
    isNpmPackage?: boolean;
    hasKarma?: boolean;
};

export function readMeBadge(context: Context) {
    const npmBadge = context.isNpmPackage
        ? `[![npm version](https://badge.fury.io/js/${context.repositoryName}.svg)](https://badge.fury.io/js/${context.repositoryName})
[![Downloads](https://img.shields.io/npm/dm/${context.repositoryName}.svg)](https://www.npmjs.com/package/${context.repositoryName})
`
        : "";
    return `[![Dependency Status](https://david-dm.org/${context.author}/${context.repositoryName}.svg)](https://david-dm.org/${context.author}/${context.repositoryName})
[![devDependency Status](https://david-dm.org/${context.author}/${context.repositoryName}/dev-status.svg)](https://david-dm.org/${context.author}/${context.repositoryName}#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/${context.author}/${context.repositoryName}.svg?branch=master)](https://travis-ci.org/${context.author}/${context.repositoryName})
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/${context.author}/${context.repositoryName}?branch=master&svg=true)](https://ci.appveyor.com/project/${context.author}/${context.repositoryName}/branch/master)
${npmBadge}
`;
}

export const stylelint = `{
  "extends": "stylelint-config-standard"
}`;

export function getTravisYml(context: Context) {
    return context.hasKarma ? `language: node_js
dist: trusty
node_js:
  - "8"
before_install:
  - sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
  - "export DISPLAY=:99.0"
  - "sh -e /etc/init.d/xvfb start"
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
      - g++-4.8
      - libnss3
  firefox: latest
` : `language: node_js
dist: trusty
node_js:
  - "8"
before_install:
  - sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
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
      - g++-4.8
      - libnss3
`;
}

export const appveyorYml = `environment:
  nodejs_version: "8"

install:
  - ps: Install-Product node $env:nodejs_version
  - yarn install --pure-lockfile

test_script:
  - node --version
  - npm --version
  - npm run build
  - npm run lint
  - npm run test

build: off
`;

export const specIndexSpecTs = `it("", () => {
    // expect(true).toEqual(true);
});
`;

export const specKarmaConfigJs = `const webpackConfig = require('./webpack.config.js')

const ChromiumRevision = require('puppeteer/package.json').puppeteer.chromium_revision
const Downloader = require('puppeteer/utils/ChromiumDownloader')
const revisionInfo = Downloader.revisionInfo(Downloader.currentPlatform(), ChromiumRevision)
process.env.CHROME_BIN = revisionInfo.executablePath

module.exports = function (karma) {
  const config = {
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '**/*Spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: karma.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    webpack: webpackConfig,
    preprocessors: {
      '**/*Spec.js': ['webpack']
    }
  }

  if (!process.env.APPVEYOR) {
    config.browsers.push('Firefox')
  }

  karma.set(config)
}
`;

export const specWebpackConfigJs = `const webpack = require('webpack')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.NoEmitOnErrorsPlugin()
]

const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.js'
  }
}

module.exports = {
  plugins,
  resolve
}
`;
