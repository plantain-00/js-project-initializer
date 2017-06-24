import * as libs from "./libs";
import { Choices, ProjectKind, printInConsole } from "./libs";

export async function runUIComponent(scripts: { [name: string]: string }, repositoryName: string, author: string, componentShortName: string, componentTypeName: string) {
    const answer = await libs.inquirer.prompt({
        type: "checkbox",
        name: "options",
        message: "Choose options:",
        default: [
        ],
        choices: [
            Choices.angularChoice,
        ],
    });
    const options: Choices[] = answer.options;

    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    const hasAngularChoice = options.some(o => o === Choices.angularChoice);

    await libs.mkdir("demo");
    await libs.mkdir("src");

    buildScripts.push("npm run file2variable");

    printInConsole(`setting src/tsconfig.json...`);
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);
    scripts.tsc = `tsc -p src/ && tsc -p demo/`;
    buildScripts.push("npm run tsc");
    await libs.writeFile(`demo/tsconfig.json`, demoTsconfig);
    printInConsole("installing tslib...");
    await libs.exec(`npm i -SE tslib`);

    scripts.tslint = `tslint "src/**/*.ts" "src/**/*.tsx"`;
    lintScripts.push("npm run tslint");

    printInConsole("setting .npmignore...");
    await libs.writeFile(".npmignore", npmignore);

    printInConsole("setting badges...");
    await libs.prependFile("README.md", getBadge(repositoryName, author));

    printInConsole("setting UI component usage choice...");
    await libs.appendFile("README.md", getUIComponentUsage(author, repositoryName, componentShortName, componentTypeName, hasAngularChoice));

    printInConsole("installing github-fork-ribbon-css...");
    await libs.exec(`npm i -DE github-fork-ribbon-css`);

    printInConsole("installing less...");
    await libs.exec(`npm i -DE less`);
    printInConsole(`setting src/${componentShortName}.less...`);
    await libs.writeFile(`src/${componentShortName}.less`, getLessConfig(componentShortName));
    scripts.lessc = `lessc src/${componentShortName}.less > dist/${componentShortName}.css`;
    buildScripts.push("npm run lessc");

    printInConsole("installing stylelint stylelint-config-standard...");
    await libs.exec(`npm i -DE stylelint stylelint-config-standard`);
    printInConsole("setting .stylelintrc...");
    await libs.writeFile(".stylelintrc", stylelint);
    scripts.stylelint = `stylelint "src/**/*.less"`;
    lintScripts.push("npm run stylelint");

    printInConsole("installing vue vue-class-component...");
    await libs.exec(`npm i -DE vue vue-class-component`);
    printInConsole(`setting src/vue.ts`);
    await libs.writeFile(`src/vue.ts`, getVueStarter(repositoryName, componentShortName, componentTypeName));
    printInConsole(`setting src/vue.template.html`);
    await libs.writeFile(`src/vue.template.html`, `<div class="${componentShortName}"></div>`);
    await libs.mkdir(`demo/vue`);
    printInConsole(`setting demo/vue/index.ts`);
    await libs.writeFile(`demo/vue/index.ts`, getVueStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
    printInConsole(`setting demo/vue/index.ejs.html`);
    await libs.writeFile(`demo/vue/index.ejs.html`, getVueStarterDemoHtml(repositoryName));

    printInConsole("installing react react-dom...");
    await libs.exec(`npm i -DE react react-dom`);
    printInConsole("installing @types/react @types/react-dom...");
    await libs.exec(`npm i -DE @types/react @types/react-dom`);
    printInConsole(`setting src/react.tsx`);
    await libs.writeFile(`src/react.tsx`, getReactStarter(repositoryName, componentShortName, componentTypeName));
    await libs.mkdir(`demo/react`);
    printInConsole(`setting demo/react/index.tsx`);
    await libs.writeFile(`demo/react/index.tsx`, getReactStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
    printInConsole(`setting demo/react/index.ejs.html`);
    await libs.writeFile(`demo/react/index.ejs.html`, getReactStarterDemoHtml(repositoryName));

    if (hasAngularChoice) {
        printInConsole("installing @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js...");
        await libs.exec(`npm i -DE @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
        printInConsole(`setting src/angular.ts`);
        await libs.writeFile(`src/angular.ts`, getAngularStarter(repositoryName, componentShortName, componentTypeName));
        printInConsole(`setting src/angular.template.html`);
        await libs.writeFile(`src/angular.template.html`, `<div class="${componentShortName}"></div>`);
        await libs.mkdir(`demo/angular`);
        printInConsole(`setting demo/angular/index.ts`);
        await libs.writeFile(`demo/angular/index.ts`, getAngularStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        printInConsole(`setting demo/angular/index.ejs.html`);
        await libs.writeFile(`demo/angular/index.ejs.html`, getAngularStarterDemoHtml(repositoryName));
    }

    printInConsole("setting starter common.ts...");
    await libs.writeFile(`src/common.ts`, getStarterCommonSource(repositoryName, componentShortName, componentTypeName));

    printInConsole("installing clean-css-cli...");
    await libs.exec(`npm i -DE clean-css-cli`);
    scripts.cleancss = `cleancss -o dist/${componentShortName}.min.css dist/${componentShortName}.css`;
    buildScripts.push("npm run cleancss");
    scripts["cleancss-demo"] = `cleancss -o demo/index.bundle.css dist/${componentShortName}.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`;
    buildScripts.push("npm run cleancss-demo");

    scripts.clean = `rimraf dist/`;
    buildScripts.unshift("npm run clean");

    printInConsole("installing file2variable-cli...");
    await libs.exec(`npm i -DE file2variable-cli`);
    const commands: string[] = [];
    commands.push(`file2variable-cli src/vue.template.html -o src/vue-variables.ts --html-minify`);
    if (hasAngularChoice) {
        commands.push(`file2variable-cli src/angular.template.html -o src/angular-variables.ts --html-minify`);
    }
    if (commands.length === 0) {
        commands.push(`file2variable-cli src/index.html -o src/variables.ts --html-minify`);
    }
    scripts.file2variable = commands.join(" && ");

    printInConsole("installing webpack...");
    await libs.exec(`npm i -DE webpack`);
    printInConsole("setting webpack.config.js...");
    const webpackConfig = getWebpackConfig(ProjectKind.UIComponent, hasAngularChoice);
    await libs.writeFile(`demo/webpack.config.js`, webpackConfig);
    scripts.webpack = `webpack --config demo/webpack.config.js`;
    buildScripts.push("npm run webpack");

    printInConsole("installing rev-static...");
    await libs.exec(`npm i -DE rev-static`);
    printInConsole("setting rev-static.config.js...");
    await libs.writeFile(`demo/rev-static.config.js`, revStaticConfig);
    scripts["rev-static"] = `rev-static --config demo/rev-static.config.js`;
    buildScripts.push("npm run rev-static");
    printInConsole("setting index.ejs.html...");
    await libs.writeFile("index.ejs.html", getRevStaticHtml(author, repositoryName));
    scripts["clean-rev"] = `rimraf demo/**/index.bundle-*.js demo/*.bundle-*.css`;
    buildScripts.unshift("npm run clean-rev");

    if (!scripts.build) {
        scripts.build = buildScripts.join(" && ");
    }
    if (!scripts.lint) {
        scripts.lint = lintScripts.join(" && ");
    }

    const packages = await libs.readFile("package.json");
    const packageJson = JSON.parse(packages);
    packageJson.scripts = scripts;
    packageJson.dependencies.tslib = "1";
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    printInConsole("success.");
}

const revStaticConfig = `module.exports = {
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

function getVueStarter(componentName: string, componentShortName: string, componentTypeName: string) {
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

function getReactStarter(componentName: string, componentShortName: string, componentTypeName: string) {
    return `import * as React from "react";
import * as common from "./common";

export class ${componentTypeName} extends React.PureComponent<{
    data: common.${componentTypeName}Data;
}, { }> {
    render() {
        return (
            <div className="${componentShortName}">
            </div>
        );
    }
}
`;
}

function getAngularStarter(componentName: string, componentShortName: string, componentTypeName: string) {
    return `import { Component, Input } from "@angular/core";
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

function getStarterCommonSource(componentName: string, componentShortName: string, componentTypeName: string) {
    return `export type ${componentTypeName}Data = {
    // tslint:disable-next-line:ban-types
    component: string | Function;
    data: any;
};
`;
}

function getUIComponentUsage(authorName: string, componentName: string, componentShortName: string, componentTypeName: string, hasAngularChoice: boolean) {
    const angularFeature = hasAngularChoice ? `
+ angular component` : "";
    const angularComponentDemo = hasAngularChoice ? `#### angular component demo

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

the online demo: https://${authorName}.github.io/${componentName}/demo/angular/index.html` : "";
    return `
#### features

+ vuejs component
+ reactjs component${angularFeature}
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

${angularComponentDemo}

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

const srcTsconfig = `{
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

const demoTsconfig = `{
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

function getBadge(repositoryName: string, author: string) {
    return `[![Dependency Status](https://david-dm.org/${author}/${repositoryName}.svg)](https://david-dm.org/${author}/${repositoryName})
[![devDependency Status](https://david-dm.org/${author}/${repositoryName}/dev-status.svg)](https://david-dm.org/${author}/${repositoryName}#info=devDependencies)
[![Build Status](https://travis-ci.org/${author}/${repositoryName}.svg?branch=master)](https://travis-ci.org/${author}/${repositoryName})
[![npm version](https://badge.fury.io/js/${repositoryName}.svg)](https://badge.fury.io/js/${repositoryName})
[![Downloads](https://img.shields.io/npm/dm/${repositoryName}.svg)](https://www.npmjs.com/package/${repositoryName})

`;
}

const npmignore = `.vscode
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

function getLessConfig(componentShortName: string) {
    return `.${componentShortName} {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", "sans-serif";
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }
}
`;
}

const stylelint = `{
  "extends": "stylelint-config-standard"
}`;

function getWebpackConfig(kind: ProjectKind, hasAngularChoice: boolean) {
    const angularEntry = hasAngularChoice ? `
        angular: "./demo/angular/index",` : "";
    return kind === ProjectKind.UIComponent ? `const webpack = require("webpack");

module.exports = {
    entry: {
        vue: "./demo/vue/index",
        react: "./demo/react/index",${angularEntry}
    },
    output: {
        path: __dirname,
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

function getRevStaticHtml(authorName: string, repositoryName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<link rel="stylesheet" href="<%=indexMinCss %>" crossOrigin="anonymous" integrity="<%=sri.indexMinCss %>" />
<a class="github-fork-ribbon right-bottom" href="https://github.com/${authorName}/${repositoryName}" title="Fork me on GitHub" target="_blank">Fork me on GitHub</a>
<div id="container"></div>
<script src="<%=indexMinJs %>" crossOrigin="anonymous" integrity="<%=sri.indexMinJs %>"></script>
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
