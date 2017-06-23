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
