import * as libs from "./libs";

export async function runUIComponent(context: libs.Context) {
    context.isNpmPackage = true;
    context.hasKarma = true;

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

    await libs.mkdir("src");
    await libs.mkdir("demo");
    await libs.mkdir(`demo/vue`);
    await libs.mkdir(`demo/react`);
    if (hasAngularChoice) {
        await libs.mkdir(`demo/angular`);
    }
    await libs.mkdir(`spec`);

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
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);

    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);
    await libs.writeFile(`src/${context.componentShortName}.less`, srcLess(context));
    await libs.writeFile(`src/common.ts`, srcCommon(context));
    await libs.writeFile(`src/vue.ts`, srcVue(context));
    await libs.writeFile(`src/vue.template.html`, `<div class="${context.componentShortName}"></div>`);
    await libs.writeFile(`src/react.tsx`, srcReact(context));
    if (hasAngularChoice) {
        await libs.writeFile(`src/angular.ts`, srcAngular(context));
        await libs.writeFile(`src/angular.template.html`, `<div class="${context.componentShortName}"></div>`);
    }

    await libs.writeFile(`demo/tsconfig.json`, demoTsconfig);
    await libs.writeFile(`demo/webpack.config.js`, demoWebpackConfig(hasAngularChoice));
    await libs.writeFile(`demo/rev-static.config.js`, demoRevStaticConfig);
    await libs.writeFile(`demo/vue/index.ts`, demoVueIndex(context));
    await libs.writeFile(`demo/vue/index.ejs.html`, demoVueIndexEjsHtml);
    await libs.writeFile(`demo/react/index.tsx`, demoReactIndex(context));
    await libs.writeFile(`demo/react/index.ejs.html`, demoReactIndexEjsHtml);
    if (hasAngularChoice) {
        await libs.writeFile(`demo/angular/index.ts`, demoAngularIndex(context));
        await libs.writeFile(`demo/angular/index.ejs.html`, demoAngularIndexEjsHtml);
    }

    await libs.writeFile(`spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`spec/tsconfig.json`, specTsconfig);
    await libs.writeFile(`spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`spec/indexSpec.ts`, specIndexSpecTs);

    await libs.writeFile(".npmignore", libs.npmignore);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context, hasAngularChoice));
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));

    const commands = [
        `file2variable-cli src/vue.template.html -o src/vue-variables.ts --html-minify --base src`,
    ];
    if (hasAngularChoice) {
        commands.push(`file2variable-cli src/angular.template.html -o src/angular-variables.ts --html-minify --base src`);
    }

    return {
        scripts: {
            cleanRev: `rimraf demo/**/*.bundle-*.js demo/*.bundle-*.css`,
            clean: `rimraf dist/`,
            file2variable: commands.join(" && "),
            tsc: `tsc -p src/ && tsc -p demo/`,
            lessc: `lessc src/${context.componentShortName}.less > dist/${context.componentShortName}.css`,
            cleancss: `cleancss -o dist/${context.componentShortName}.min.css dist/${context.componentShortName}.css`,
            cleancssDemo: `cleancss -o demo/index.bundle.css dist/${context.componentShortName}.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`,
            webpack: `webpack --config demo/webpack.config.js`,
            revStatic: `rev-static --config demo/rev-static.config.js`,
            tslint: `tslint "src/**/*.ts" "src/**/*.tsx" "spec/**/*.ts" "demo/**/*.ts" "demo/**/*.tsx"`,
            stylelint: `stylelint "src/**/*.less"`,
            standard: `standard "**/*.config.js"`,
            fix: `standard --fix "**/*.config.js"`,
            test: "tsc -p spec && karma start spec/karma.config.js",
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
                "npm run standard",
            ].join(" && "),
        },
        dependencies: {
            tslib: "1",
        },
    };
}

const demoRevStaticConfig = `module.exports = {
  inputFiles: [
    'demo/**/index.bundle-*.js',
    'demo/**/*.index.bundle-*.js',
    'demo/*.bundle.css',
    'demo/**/index.ejs.html'
  ],
  revisedFiles: [
    'demo/**/index.bundle-*.js',
    'demo/**/*.index.bundle-*.js'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'demo',
  fileSize: 'demo/file-size.json'
}
`;

function srcVue(context: libs.Context) {
    return `import Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";
export * from "./common";
import { vueTemplateHtml } from "./vue-variables";

@Component({
    template: vueTemplateHtml,
    props: ["data"],
})
class ${context.componentTypeName} extends Vue {
    data: common.${context.componentTypeName}Data;
}

Vue.component("${context.componentShortName}", ${context.componentTypeName});
`;
}

function srcReact(context: libs.Context) {
    return `import * as React from "react";
import * as common from "./common";
export * from "./common";

export class ${context.componentTypeName} extends React.Component<{
    data: common.${context.componentTypeName}Data;
}, { }> {
    render() {
        return (
            <div className="${context.componentShortName}">
            </div>
        );
    }
}
`;
}

function srcAngular(context: libs.Context) {
    return `import { Component, Input } from "@angular/core";
import * as common from "./common";
export * from "./common";
import { angularTemplateHtml } from "./angular-variables";

@Component({
    selector: "${context.componentShortName}",
    template: angularTemplateHtml,
})
export class ${context.componentTypeName}Component {
    @Input()
    data: common.${context.componentTypeName}Data;
}
`;
}

function srcCommon(context: libs.Context) {
    return `export type ${context.componentTypeName}Data = {
    // tslint:disable-next-line:ban-types
    component: string | Function;
    data: any;
};
`;
}

function readMeDocument(context: libs.Context, hasAngularChoice: boolean) {
    const angularFeature = hasAngularChoice ? `
+ angular component` : "";
    const angularComponentDemo = hasAngularChoice ? `#### angular component demo

\`\`\`ts
import { ${context.componentTypeName}Component } from "${context.repositoryName}/dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, ${context.componentTypeName}Component],
    bootstrap: [MainComponent],
})
class MainModule { }
\`\`\`

\`\`\`html
<${context.componentShortName} [data]="data">
</${context.componentShortName}>
\`\`\`

the online demo: https://${context.author}.github.io/${context.repositoryName}/demo/angular/index.html` : "";
    return `
#### features

+ vuejs component
+ reactjs component${angularFeature}
+ custom component

#### install

\`npm i ${context.repositoryName}\`

#### link css

\`\`\`html
<link rel="stylesheet" href="./node_modules/${context.repositoryName}/dist/${context.componentShortName}.min.css" />
\`\`\`

#### vuejs component demo

\`npm i vue vue-class-component\`

\`\`\`ts
import "${context.repositoryName}/dist/vue";
\`\`\`

\`\`\`html
<${context.componentShortName} :data="data">
</${context.componentShortName}>
\`\`\`

the online demo: https://${context.author}.github.io/${context.repositoryName}/demo/vue/index.html

#### reactjs component demo

\`\`\`ts
import { ${context.componentTypeName} } from "${context.repositoryName}/dist/react";
\`\`\`

\`\`\`jsx
<${context.componentTypeName} data={this.data}>
</${context.componentTypeName}>
\`\`\`

the online demo: https://${context.author}.github.io/${context.repositoryName}/demo/react/index.html

${angularComponentDemo}

#### properties and events of the component

name | type | description
--- | --- | ---
data | [${context.componentTypeName}Data](#${context.componentShortName}-data-structure)[] | the data of the ${context.componentShortName}

#### ${context.componentShortName} data structure

\`\`\`ts
type ${context.componentTypeName}Data = {
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

        "lib": [
            "dom",
            "es5",
            "es2015.promise"
        ],

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

const specTsconfig = `{
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

function srcLess(context: libs.Context) {
    return `.${context.componentShortName} {
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

function demoWebpackConfig(hasAngularChoice: boolean) {
    return hasAngularChoice ? `const webpack = require('webpack')
const path = require('path')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  })
]

const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.min.js'
  }
}

module.exports = [
  {
    entry: './demo/vue/index',
    output: {
      path: path.resolve(__dirname, 'vue'),
      filename: 'index.bundle-[hash].js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/react/index',
    output: {
      path: path.resolve(__dirname, 'react'),
      filename: 'index.bundle-[hash].js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/angular/index',
    output: {
      path: path.resolve(__dirname, 'angular'),
      filename: 'index.bundle-[hash].js'
    },
    plugins,
    resolve
  }
]
` : `const webpack = require('webpack')
const path = require('path')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  })
]

const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.min.js'
  }
}

module.exports = [
  {
    entry: './demo/vue/index',
    output: {
      path: path.resolve(__dirname, 'vue'),
      filename: 'index.bundle-[hash].js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/react/index',
    output: {
      path: path.resolve(__dirname, 'react'),
      filename: 'index.bundle-[hash].js'
    },
    plugins,
    resolve
  }
]
`;
}

function demoVueIndex(context: libs.Context) {
    return `import Vue from "vue";
import Component from "vue-class-component";
import "../../dist/vue";
import { ${context.componentTypeName}Data } from "../../dist/vue";

@Component({
    template: \`
    <div>
        <a href="https://github.com/${context.author}/${context.repositoryName}/tree/master/demo/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <${context.componentShortName} :data="data">
        </${context.componentShortName}>
    </div>
    \`,
})
class App extends Vue {
    data: ${context.componentTypeName}Data;
}

// tslint:disable-next-line:no-unused-expression
new App({ el: "#container" });
`;
}

const demoVueIndexEjsHtml = `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../<%=indexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleCss %>" />
<div id="container"></div>
<script src="./<%=vueIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.vueIndexBundleJs %>"></script>
`;

function demoReactIndex(context: libs.Context) {
    return `import * as React from "react";
import * as ReactDOM from "react-dom";
import { ${context.componentTypeName}, ${context.componentTypeName}Data } from "../../dist/react";

class Main extends React.Component<{}, {}> {
    data: ${context.componentTypeName}Data;

    render() {
        return (
            <div>
                <a href="https://github.com/${context.author}/${context.repositoryName}/tree/master/demo/react/index.tsx" target="_blank">the source code of the demo</a>
                <br />
                <${context.componentTypeName} data={this.data}>
                </${context.componentTypeName}>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
`;
}

const demoReactIndexEjsHtml = `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../<%=indexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleCss %>" />
<div id="container"></div>
<script src="./<%=reactIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.reactIndexBundleJs %>"></script>
`;

function demoAngularIndex(context: libs.Context) {
    return `import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

enableProdMode();

import { Component } from "@angular/core";

@Component({
    selector: "app",
    template: \`
    <div>
        <a href="https://github.com/${context.author}/${context.repositoryName}/tree/master/demo/angular/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <${context.componentShortName} [data]="data">
        </${context.componentShortName}>
    </div>
    \`,
})
export class MainComponent {
    data: ${context.componentTypeName}Data;
}

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ${context.componentTypeName}Component, ${context.componentTypeName}Data } from "../../dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, ${context.componentTypeName}Component],
    bootstrap: [MainComponent],
})
class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
`;
}

const demoAngularIndexEjsHtml = `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../<%=indexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleCss %>" />
<app></app>
<script src="./<%=angularIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.angularIndexBundleJs %>"></script>
`;

const specIndexSpecTs = `import "../dist/common";

it("", () => {
    // expect(true).toEqual(true);
});
`;
