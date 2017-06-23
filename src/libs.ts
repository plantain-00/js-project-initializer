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

export const enum Choices {
    lessChoice = "css: less",
    stylelintChoice = "css: stylelint",
    cleanCssCliChoice = "css: clean-css-cli",

    publishToNpmChoice = "npm: publish to npm",

    forkMeOnGithubChoice = "doc: fork me on Github",

    jasmineChoice = "test: jasmine",

    webpackChoice = "bundle: webpack",

    vueChoice = "UI: vue",
    reactChoice = "UI: react",
    angularChoice = "UI: angular",

    cpyChoice = "script: cpy-cli",
    mkdirpChoice = "script: mkdirp",
    revStaticChoice = "script: rev-static",
    htmlMinifierChoice = "script: html-minifier",
    image2base64Choice = "script: image2base64-cli",
    file2variableChoice = "script: file2variable-cli",
    swPrecacheChoice = "script: sw-precache",
    uglifyjsChoice = "script: uglify-js",
}
