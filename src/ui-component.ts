import * as libs from "./libs";

export async function runUIComponent(context: libs.Context) {
    const answer = await libs.inquirer.prompt({
        type: "checkbox",
        name: "options",
        message: "Choose options:",
        default: [
        ],
        choices: [
            "angular",
        ],
    });
    const options: string[] = answer.options;

    const hasAngularChoice = options.some(o => o === "angular");

    await libs.mkdir("demo");
    await libs.mkdir("src");
    await libs.mkdir(`demo/vue`);
    await libs.mkdir(`demo/react`);
    if (hasAngularChoice) {
        await libs.mkdir(`demo/angular`);
    }

    await libs.exec(`npm i -SE tslib`);
    await libs.exec(`npm i -DE github-fork-ribbon-css`);
    await libs.exec(`npm i -DE less`);
    await libs.exec(`npm i -DE stylelint stylelint-config-standard`);
    await libs.exec(`npm i -DE clean-css-cli`);
    await libs.exec(`npm i -DE file2variable-cli`);
    await libs.exec(`npm i -DE rev-static`);
    await libs.exec(`npm i -DE webpack`);
    await libs.exec(`npm i -DE vue vue-class-component`);
    await libs.exec(`npm i -DE react react-dom`);
    await libs.exec(`npm i -DE @types/react @types/react-dom`);
    if (hasAngularChoice) {
        await libs.exec(`npm i -DE @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
    }

    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);
    await libs.writeFile(`src/${context.componentShortName}.less`, getLessConfig(context.componentShortName));
    await libs.writeFile(`src/common.ts`, getStarterCommonSource(context.repositoryName, context.componentShortName, context.componentTypeName));
    await libs.writeFile(`src/vue.ts`, getVueStarter(context.repositoryName, context.componentShortName, context.componentTypeName));
    await libs.writeFile(`src/vue.template.html`, `<div class="${context.componentShortName}"></div>`);
    await libs.writeFile(`src/react.tsx`, getReactStarter(context.repositoryName, context.componentShortName, context.componentTypeName));
    if (hasAngularChoice) {
        await libs.writeFile(`src/angular.ts`, getAngularStarter(context.repositoryName, context.componentShortName, context.componentTypeName));
        await libs.writeFile(`src/angular.template.html`, `<div class="${context.componentShortName}"></div>`);
    }

    await libs.writeFile(`demo/tsconfig.json`, demoTsconfig);
    await libs.writeFile(`demo/webpack.config.js`, getWebpackConfig(hasAngularChoice));
    await libs.writeFile(`demo/rev-static.config.js`, revStaticConfig);
    await libs.writeFile(`demo/vue/index.ts`, getVueStarterDemoSource(context.author, context.repositoryName, context.componentShortName, context.componentTypeName));
    await libs.writeFile(`demo/vue/index.ejs.html`, getVueStarterDemoHtml(context.repositoryName));
    await libs.writeFile(`demo/react/index.tsx`, getReactStarterDemoSource(context.author, context.repositoryName, context.componentShortName, context.componentTypeName));
    await libs.writeFile(`demo/react/index.ejs.html`, getReactStarterDemoHtml(context.repositoryName));
    if (hasAngularChoice) {
        await libs.writeFile(`demo/angular/index.ts`, getAngularStarterDemoSource(context.author, context.repositoryName, context.componentShortName, context.componentTypeName));
        await libs.writeFile(`demo/angular/index.ejs.html`, getAngularStarterDemoHtml(context.repositoryName));
    }

    await libs.writeFile(".npmignore", npmignore);
    await libs.prependFile("README.md", getBadge(context.repositoryName, context.author));
    await libs.appendFile("README.md", getUIComponentUsage(context.author, context.repositoryName, context.componentShortName, context.componentTypeName, hasAngularChoice));
    await libs.writeFile(".stylelintrc", stylelint);

    const commands = [
        `file2variable-cli src/vue.template.html -o src/vue-variables.ts --html-minify`,
    ];
    if (hasAngularChoice) {
        commands.push(`file2variable-cli src/angular.template.html -o src/angular-variables.ts --html-minify`);
    }

    return {
        scripts: {
            cleanRev: `rimraf demo/**/index.bundle-*.js demo/*.bundle-*.css`,
            clean: `rimraf dist/`,
            file2variable: commands.join(" && "),
            tsc: `tsc -p src/ && tsc -p demo/`,
            lessc: `lessc src/${context.componentShortName}.less > dist/${context.componentShortName}.css`,
            cleancss: `cleancss -o dist/${context.componentShortName}.min.css dist/${context.componentShortName}.css`,
            cleancssDemo: `cleancss -o demo/index.bundle.css dist/${context.componentShortName}.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`,
            webpack: `webpack --config demo/webpack.config.js`,
            revStatic: `rev-static --config demo/rev-static.config.js`,
            tslint: `tslint "src/**/*.ts" "src/**/*.tsx"`,
            stylelint: `stylelint "src/**/*.less"`,
            build: [
                "npm run cleanRev",
                "npm run clean",
                "npm run file2variable",
                "npm run tsc",
                "npm run lessc",
                "npm run cleancss",
                "npm run cleancssDemo",
                "npm run webpack",
                "npm run revStatic",
            ].join(" && "),
            lint: [
                "npm run tslint",
                "npm run stylelint",
            ].join(" && "),
        },
        dependencies: {
            tslib: "1",
        },
    };
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

function getWebpackConfig(hasAngularChoice: boolean) {
    const angularEntry = hasAngularChoice ? `
        angular: "./demo/angular/index",` : "";
    return `const webpack = require("webpack");

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
};`;
}

function getVueStarterDemoSource(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
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

function getVueStarterDemoHtml(componentName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../<%=demoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.demoIndexBundleCss %>" />
<div id="container"></div>
<script src="./<%=demoVueIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.demoVueIndexBundleJs %>"></script>
`;
}

function getReactStarterDemoSource(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
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

function getReactStarterDemoHtml(componentName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../<%=demoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.demoIndexBundleCss %>" />
<div id="container"></div>
<script src="./<%=demoReactIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.demoReactIndexBundleJs %>"></script>
`;
}

function getAngularStarterDemoSource(authorName: string, componentName: string, componentShortName: string, componentTypeName: string) {
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

function getAngularStarterDemoHtml(componentName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../<%=demoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.demoIndexBundleCss %>" />
<app></app>
<script src="./<%=demoAngularIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.demoAngularIndexBundleJs %>"></script>
`;
}
