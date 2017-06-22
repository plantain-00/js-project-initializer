export const tsconfigFrontEnd = `{
    "compilerOptions": {
        "target": "es5",
        "outDir": "../dist",
        "declaration": true,

        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "jsx": "react",
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "downlevelIteration": true
    }
}`;

export const tsconfigDemo = `{
    "compilerOptions": {
        "target": "es5",

        "module": "esnext",
        "moduleResolution": "node",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "jsx": "react",
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "downlevelIteration": true
    }
}`;

export const tsconfigNodejs = `{
    "compilerOptions": {
        "target": "esnext",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
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
        "allowSyntheticDefaultImports": true,
        "downlevelIteration": true
    }
}`;
export const revStaticConfig = `module.exports = {
    inputFiles: [
        "index.min.js",
        "index.min.css",
        "index.ejs.html",
    ],
    outputFiles: file => file.replace(".ejs", ""),
    ejsOptions: {
        rmWhitespace: true
    },
    sha: 256,
    customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + "-" + md5String + extensionName,
};
`;

export const revStaticConfigDemo = `module.exports = {
    inputFiles: [
        "demo/**/index.bundle.js",
        "demo/*.bundle.css",
        "demo/**/index.ejs.html",
    ],
    outputFiles: file => file.replace(".ejs", ""),
    ejsOptions: {
        rmWhitespace: true
    },
    sha: 256,
    customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + "-" + md5String + extensionName,
};
`;

export const tssdk = `{
    "typescript.tsdk": "./node_modules/typescript/lib"
}`;

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

export const travis = `language: node_js
node_js:
  - "8"
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
# Source
.vscode
dist
**/*.js
**/*.css
!*.config.js
!**/*-*.js
!**/*-*.css
service-worker.js
`;

export function getWebpackConfig(hasUIStarter: boolean) {
    return hasUIStarter ? `const webpack = require("webpack");

module.exports = {
    entry: {
        vue: "./demo/vue/index",
        react: "./demo/react/index",
        angular: "./demo/angular/index",
    },
    output: {
        filename: "[name]/index.bundle.js"
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
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.min.js"
        }
    }
};` : `const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        index: "./index",
        vendor: "./vendor",
    },
    output: {
        path: path.join(__dirname, "static/"),
        filename: "[name].min.js"
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
}

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

export const githubIssueTemplate = `#### Version(if relevant): 1.0.0

#### Environment(if relevant):

#### Code(if relevant):

\`\`\`
// code here
\`\`\`

#### Expected:

#### Actual:
`;

export const githubPullRequestTemplate = `#### Fixes(if relevant): #1
`;

export function getComponentShortName(componentName: string) {
    return (componentName.endsWith("component") && componentName.length - "component".length - 1 > 0)
        ? componentName.substring(0, componentName.length - "component".length - 1)
        : componentName;
}

export function getComponentTypeName(componentShortName: string) {
    return componentShortName[0].toUpperCase() + componentShortName.substring(1);
}

export function getUIComponentUsage(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
    return `
#### features

+ vuejs component
+ reactjs component
+ angular component
+ custom component

#### install

\`npm i ${componentName}\`

#### link css

\`\`\`html
<link rel="stylesheet" href="./node_modules/${componentName}/dist/${componentShortName}.min.css" />
\`\`\`

#### vuejs component demo

\`npm i vue vue-class-component\`

\`\`\`ts
import "${componentName}/dist/vue";
\`\`\`

\`\`\`html
<${componentShortName} :data="data">
</${componentShortName}>
\`\`\`

the online demo: https://${authorName}.github.io/${componentName}/demo/vue/index.html

#### reactjs component demo

\`\`\`ts
import { ${componentTypeName} } from "${componentName}/dist/react";
\`\`\`

\`\`\`jsx
<${componentTypeName} data={this.data}>
</${componentTypeName}>
\`\`\`

the online demo: https://${authorName}.github.io/${componentName}/demo/react/index.html

#### angular component demo

\`\`\`ts
import { ${componentTypeName}Component } from "${componentName}/dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, ${componentTypeName}Component],
    bootstrap: [MainComponent],
})
class MainModule { }
\`\`\`

\`\`\`html
<${componentShortName} [data]="data">
</${componentShortName}>
\`\`\`

the online demo: https://${authorName}.github.io/${componentName}/demo/angular/index.html

#### properties and events of the component

name | type | description
--- | --- | ---
data | [${componentTypeName}Data](#${componentShortName}-data-structure)[] | the data of the ${componentShortName}

#### ${componentShortName} data structure

\`\`\`ts
type ${componentTypeName}Data = {
    component: string | Function; // the item component, for vuejs, it is the component name, for reactjs, it is the class object
    data: any; // the data will be passed to the component as \`data\` props
};
\`\`\`
`;
}

export function getVueStarter(componentName: string, componentShortName: string, componentTypeName: string) {
    return `import Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";
import { srcVueTemplateHtml } from "./vue-variables";

@Component({
    template: srcVueTemplateHtml,
    props: ["data"],
})
class ${componentTypeName} extends Vue {
    data: common.${componentTypeName}Data;
}

Vue.component("${componentShortName}", ${componentTypeName});
`;
}

export function getVueStarterDemoSource(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
    return `import Vue from "vue";
import Component from "vue-class-component";
import "../../dist/vue";
import * as common from "../../dist/common";

@Component({
    template: \`
    <div>
        <a href="https://github.com/${authorName}/${componentName}/tree/master/demo/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <${componentShortName} :data="data">
        </${componentShortName}>
    </div>
    \`,
})
class App extends Vue {
    data: common.${componentTypeName}Data;
}

// tslint:disable-next-line:no-unused-expression
new App({ el: "#container" });
`;
}

export function getVueStarterDemoHtml(componentName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<link rel="stylesheet" href="../<%=demoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.demoIndexBundleCss %>" />
<div id="container"></div>
<script src="./<%=demoVueIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.demoVueIndexBundleJs %>"></script>
`;
}

export function getReactStarter(componentName: string, componentShortName: string, componentTypeName: string) {
    return `import * as React from "react";
import * as common from "./common";

export class ${componentTypeName} extends React.PureComponent<{
    data: common.${componentTypeName}Data;
}, { }> {
    render() {
        return (
            <div>
            </div>
        );
    }
}
`;
}

export function getReactStarterDemoSource(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
    return `import * as React from "react";
import * as ReactDOM from "react-dom";
import { ${componentTypeName} } from "../../dist/react";
import * as common from "../../dist/common";

class Main extends React.Component<{}, {}> {
    data: common.${componentTypeName}Data;

    render() {
        return (
            <div>
                <a href="https://github.com/${authorName}/${componentName}/tree/master/demo/react/index.tsx" target="_blank">the source code of the demo</a>
                <br/>
                <${componentTypeName} data={this.data}>
                </${componentTypeName}>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
`;
}

export function getReactStarterDemoHtml(componentName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<link rel="stylesheet" href="../<%=demoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.demoIndexBundleCss %>" />
<div id="container"></div>
<script src="./<%=demoReactIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.demoReactIndexBundleJs %>"></script>
`;
}

export function getAngularStarter(componentName: string, componentShortName: string, componentTypeName: string) {
    return `import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as common from "./common";
import { srcAngularTemplateHtml } from "./angular-variables";

@Component({
    selector: "${componentShortName}",
    template: srcAngularTemplateHtml,
})
export class ${componentTypeName}Component {
    @Input()
    data: common.${componentTypeName}Data;
}
`;
}

export function getAngularStarterDemoSource(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
    return `import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

enableProdMode();

import { Component } from "@angular/core";

import * as common from "../../dist/common";

@Component({
    selector: "app",
    template: \`
    <div>
        <a href="https://github.com/${authorName}/${componentName}/tree/master/demo/angular/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <${componentShortName} [data]="data">
        </${componentShortName}>
    </div>
    \`,
})
export class MainComponent {
    data: common.${componentTypeName}Data;
}

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ${componentTypeName}Component } from "../../dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, ${componentTypeName}Component],
    bootstrap: [MainComponent],
})
class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
`;
}

export function getAngularStarterDemoHtml(componentName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<link rel="stylesheet" href="../<%=demoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.demoIndexBundleCss %>" />
<app></app>
<script src="./<%=demoAngularIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.demoAngularIndexBundleJs %>"></script>
`;
}

export function getStarterCommonSource(componentName: string, componentShortName: string, componentTypeName: string) {
    return `export type ${componentTypeName}Data = {
    // tslint:disable-next-line:ban-types
    component: string | Function;
    data: any;
};
`;
}

export function getRevStaticHtml(hasForkMeOnGithubChoice: boolean, authorName: string, repositoryName: string) {
    const forkMeOnGithub = hasForkMeOnGithubChoice ? `<a class="github-fork-ribbon right-bottom" href="https://github.com/${authorName}/${repositoryName}" title="Fork me on GitHub" target="_blank">Fork me on GitHub</a>` : "";
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<link rel="stylesheet" href="<%=indexMinCss %>" crossOrigin="anonymous" integrity="<%=sri.indexMinCss %>" />
${forkMeOnGithub}
<div id="container"></div>
<script src="<%=indexMinJs %>" crossOrigin="anonymous" integrity="<%=sri.indexMinJs %>"></script>
`;
}
