import * as inquirer from 'inquirer'
import * as childProcess from 'child_process'
import * as fs from 'fs'
import upperCamelCase from 'uppercamelcase'
import minimist from 'minimist'
import { promisify } from 'util'

export { inquirer, upperCamelCase, minimist }

export function exec(command: string) {
  return new Promise<void>((resolve, reject) => {
    console.log(`${command}...`)
    const subProcess = childProcess.exec(command, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
    if (subProcess.stdout) {
      subProcess.stdout.pipe(process.stdout)
    }
    if (subProcess.stderr) {
      subProcess.stderr.pipe(process.stderr)
    }
  })
}

export function writeFile(filename: string, data: string) {
  return new Promise<void>((resolve, reject) => {
    console.log(`setting ${filename}...`)
    fs.writeFile(filename, data, error => error ? reject(error) : resolve())
  })
}

export function readFile(filename: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filename, 'utf8', (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

export function appendFile(filename: string, data: string) {
  return new Promise<void>((resolve, reject) => {
    console.log(`setting ${filename}...`)
    fs.appendFile(filename, data, error => error ? reject(error) : resolve())
  })
}

const mkdirp = promisify(fs.mkdir)
export const mkdir = async (p: string) => {
  await mkdirp(p, { recursive: true })
}

export const enum ProjectKind {
  CLI = 'CLI',
  CLIMonorepo = 'CLI Monorepo',
  UIComponent = 'UI Component',
  frontend = 'frontend',
  backend = 'backend',
  backendWithFrontend = 'backend with frontend',
  library = 'library',
  electron = 'electron'
}

export function getComponentShortName(componentName: string) {
  return (componentName.endsWith('component') && componentName.length - 'component'.length - 1 > 0)
    ? componentName.substring(0, componentName.length - 'component'.length - 1)
    : componentName
}

export interface Context {
  kind?: ProjectKind;
  repositoryName: string;
  componentShortName: string;
  componentTypeName: string;
  author: string;
  authorName: string;
  description: string;
}
