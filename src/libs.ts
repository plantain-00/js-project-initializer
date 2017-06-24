import * as inquirer from "inquirer";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import upperCamelCase = require("uppercamelcase");

export { inquirer, upperCamelCase };

export function exec(command: string) {
    return new Promise<void>((resolve, reject) => {
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
