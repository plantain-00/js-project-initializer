import * as inquirer from "inquirer";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import upperCamelCase = require("uppercamelcase");

export { inquirer, upperCamelCase };

export function exec(command: string) {
    return new Promise<void>((resolve, reject) => {
        printInConsole(`${command}...`);
        childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
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

export function printInConsole(message: string) {
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
        "interface-over-type-literal": false
    }
}`;

export type Context = {
    repositoryName: string;
    componentShortName: string;
    componentTypeName: string;
    author: string;
    isNpmPackage?: boolean;
};

export function readMeBadge(context: Context) {
    const npmBadge = context.isNpmPackage
        ? `[![npm version](https://badge.fury.io/js/${context.repositoryName}.svg)](https://badge.fury.io/js/${context.repositoryName})
[![Downloads](https://img.shields.io/npm/dm/${context.repositoryName}.svg)](https://www.npmjs.com/package/${context.repositoryName})
`
        : "";
    return `[![Dependency Status](https://david-dm.org/${context.author}/${context.repositoryName}.svg)](https://david-dm.org/${context.author}/${context.repositoryName})
[![devDependency Status](https://david-dm.org/${context.author}/${context.repositoryName}/dev-status.svg)](https://david-dm.org/${context.author}/${context.repositoryName}#info=devDependencies)
[![Build Status](https://travis-ci.org/${context.author}/${context.repositoryName}.svg?branch=master)](https://travis-ci.org/${context.author}/${context.repositoryName})
${npmBadge}

`;
}

export const npmignore = `.vscode
.github
tslint.json
.travis.yml
tsconfig.json
webpack.config.js
src
rev-static.config.js
spec
demo
`;

export const stylelint = `{
  "extends": "stylelint-config-standard"
}`;
