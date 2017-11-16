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

    await libs.exec(`yarn add -E tslib@1`);
    await libs.exec(`yarn add -DE github-fork-ribbon-css`);
    await libs.exec(`yarn add -DE less`);
    await libs.exec(`yarn add -DE stylelint stylelint-config-standard`);
    await libs.exec(`yarn add -DE clean-css-cli`);
    await libs.exec(`yarn add -DE file2variable-cli`);
    await libs.exec(`yarn add -DE rev-static`);
    await libs.exec(`yarn add -DE clean-release`);
    await libs.exec(`yarn add -DE webpack`);
    await libs.exec(`yarn add -DE vue vue-class-component`);
    await libs.exec(`yarn add -DE react react-dom`);
    await libs.exec(`yarn add -DE @types/react @types/react-dom`);
    if (hasAngularChoice) {
        await libs.exec(`yarn add -DE @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic @angular/compiler-cli core-js rxjs zone.js`);
    }
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE mkdirp`);
    await libs.exec(`yarn add -DE no-unused-export`);
    await libs.exec(`yarn add -DE watch-then-execute`);
    await libs.exec(`yarn add -DE http-server`);
    await libs.exec(`yarn add -DE puppeteer @@types/puppeteer`);
    await libs.exec(`yarn add -DE autoprefixer postcss-cli`);

    await libs.mkdir("src");
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);
    await libs.writeFile(`src/${context.componentShortName}.less`, srcLess(context));
    await libs.writeFile(`src/common.ts`, srcCommon(context));
    await libs.writeFile(`src/vue.ts`, srcVue(context));
    await libs.writeFile(`src/vue.template.html`, `<div class="${context.componentShortName}"></div>`);
    await libs.writeFile(`src/react.tsx`, srcReact(context));
    if (hasAngularChoice) {
        await libs.writeFile(`src/tsconfig.aot.json`, srcTsconfigAot);
        await libs.writeFile(`src/angular.ts`, srcAngular(context));
        await libs.writeFile(`src/angular.template.html`, `<div class="${context.componentShortName}"></div>`);
    }

    await libs.mkdir("demo");
    await libs.writeFile(`demo/tsconfig.json`, demoTsconfig);
    await libs.writeFile(`demo/webpack.config.js`, demoWebpackConfig(hasAngularChoice));
    await libs.writeFile(`demo/rev-static.config.js`, demoRevStaticConfig);
    await libs.mkdir(`demo/vue`);
    await libs.writeFile(`demo/vue/index.ts`, demoVueIndex(context));
    await libs.writeFile(`demo/vue/index.ejs.html`, demoVueIndexEjsHtml);
    await libs.mkdir(`demo/react`);
    await libs.writeFile(`demo/react/index.tsx`, demoReactIndex(context));
    await libs.writeFile(`demo/react/index.ejs.html`, demoReactIndexEjsHtml);
    if (hasAngularChoice) {
        await libs.mkdir(`demo/angular`);
        await libs.writeFile(`demo/angular/index.ts`, demoAngularIndex(context));
        await libs.writeFile(`demo/angular/index.ejs.html`, demoAngularIndexEjsHtml);
    }

    await libs.mkdir(`spec`);
    await libs.writeFile(`spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`spec/tsconfig.json`, specTsconfig);
    await libs.writeFile(`spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`spec/indexSpec.ts`, specIndexSpecTs);

    await libs.mkdir(`screenshots`);
    await libs.writeFile(`screenshots/tsconfig.json`, libs.tsconfigJson);
    await libs.writeFile(`screenshots/index.ts`, screenshotsIndexTs(hasAngularChoice));

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context, hasAngularChoice));
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml);
    await libs.writeFile("clean-release.config.js", cleanReleaseConfigJs);
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(hasAngularChoice, context));
    await libs.writeFile(".browserslistrc", libs.browsersList);
    await libs.writeFile("postcss.config.js", libs.postcssConfig);

    return {
        scripts: {
            build: `clean-scripts build`,
            lint: `clean-scripts lint`,
            test: "clean-scripts test",
            fix: `clean-scripts fix`,
            release: "clean-scripts release",
            watch: "clean-scripts watch",
            screenshot: "clean-scripts screenshot",
        },
        dependencies: {
            tslib: "1",
        },
    };
}

function screenshotsIndexTs(hasAngularChoice: boolean) {
    return `import * as puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });

    for (const type of ["vue", "react"${hasAngularChoice ? `, "angular"` : ``}]) {
        await page.goto(\`http://localhost:8000/demo/\${type}\`);
        await page.screenshot({ path: \`screenshots/\${type}-initial.png\` });
    }

    browser.close();
})();
`;
}

function cleanScriptsConfigJs(hasAngularChoice: boolean, context: libs.Context) {
    const angularTemplateCommand = hasAngularChoice ? "const angularTemplateCommand = 'file2variable-cli src/angular.template.html -o src/angular-variables.ts --html-minify --base src'\n" : "";
    const angularScript = hasAngularChoice ? "        angularTemplateCommand,\n" : "";
    const angularWatchScript = hasAngularChoice ? "    angular: \`\${angularTemplateCommand} --watch\`,\n" : "";
    const tscSrcCommand = hasAngularChoice ? `const tscSrcCommand = [
  'tsc -p src',
  'ngc -p src/tsconfig.aot.json'
]` : `const tscSrcCommand = 'tsc -p src'`;
    return `const { Service, checkGitStatus, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = \`"src/**/*.ts" "src/**/*.tsx" "spec/**/*.ts" "demo/**/*.ts" "demo/**/*.tsx" "screenshots/**/*.ts"\`
const lessFiles = \`"src/**/*.less"\`
const jsFiles = \`"*.config.js" "demo/*.config.js" "spec/*.config.js"\`

const vueTemplateCommand = 'file2variable-cli src/vue.template.html -o src/vue-variables.ts --html-minify --base src'
${angularTemplateCommand}${tscSrcCommand}
const tscDemoCommand = 'tsc -p demo/'
const webpackCommand = 'webpack --display-modules --config demo/webpack.config.js'
const revStaticCommand = 'rev-static --config demo/rev-static.config.js'
const cssCommand = [
  \`lessc src/${context.componentShortName}.less > src/${context.componentShortName}.css\`,
  \`postcss src/${context.componentShortName}.css -o dist/${context.componentShortName}.css\`,
  \`cleancss -o dist/${context.componentShortName}.min.css dist/${context.componentShortName}.css\`,
  \`cleancss -o demo/index.bundle.css dist/${context.componentShortName}.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css\`
]

module.exports = {
  build: [
    'rimraf dist/',
    'mkdirp dist/',
    {
      js: [
        vueTemplateCommand,
        ${angularScript}'tscSrcCommand,
        tscDemoCommand,
        webpackCommand
      ],
      css: cssCommand,
      clean: 'rimraf demo/**/*.bundle-*.js demo/*.bundle-*.css'
    },
    revStaticCommand
  ],
  lint: {
    ts: \`tslint \${tsFiles}\`,
    js: \`standard \${jsFiles}\`,
    less: \`stylelint \${lessFiles}\`,
    export: \`no-unused-export \${tsFiles} \${lessFiles} --exclude "src/compiled/**/*"\`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: \`tslint --fix \${tsFiles}\`,
    js: \`standard --fix \${jsFiles}\`,
    less: \`stylelint --fix \${lessFiles}\`
  },
  release: \`clean-release\`,
  watch: {
    vue: \`\${vueTemplateCommand} --watch\`,
    ${angularWatchScript}src: \`\${tscSrcCommand} --watch\`,
    demo: \`\${tscDemoCommand} --watch\`,
    webpack: \`\${webpackCommand} --watch\`,
    less: () => watch(['src/**/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: \`\${revStaticCommand} --watch\`
  },
  screenshot: [
    new Service('http-server -p 8000'),
    'tsc -p screenshots',
    'node screenshots/index.js'
  ]
}
`;
}

const cleanReleaseConfigJs = `module.exports = {
  include: [
    'dist/**/*',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  base: 'dist',
  postScript: 'npm publish [dir] --access public'
}
`;

const demoRevStaticConfig = `module.exports = {
  inputFiles: [
    'demo/**/index.bundle.js',
    'demo/*.bundle.css',
    'demo/**/index.ejs.html'
  ],
  revisedFiles: [
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

/**
 * @public
 */
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
    return `import { Component, Input, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as common from "./common";
export * from "./common";
import { angularTemplateHtml } from "./angular-variables";

/**
 * @public
 */
@Component({
    selector: "${context.componentShortName}",
    template: angularTemplateHtml,
})
export class ${context.componentTypeName}Component {
    @Input()
    data: common.${context.componentTypeName}Data;
}

/**
 * @public
 */
@NgModule({
    declarations: [
        ${context.componentTypeName}Component,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ${context.componentTypeName}Component,
    ],
})
export class ${context.componentTypeName}Module { }
`;
}

function srcCommon(context: libs.Context) {
    return `/**
 * @public
 */
export type ${context.componentTypeName}Data<T = any> = {
    // tslint:disable-next-line:ban-types
    component: string | Function;
    data: T;
};
`;
}

function readMeDocument(context: libs.Context, hasAngularChoice: boolean) {
    const angularFeature = hasAngularChoice ? `
+ angular component` : "";
    const angularComponentDemo = hasAngularChoice ? `#### angular component demo

\`\`\`ts
import { ${context.componentTypeName}Module } from "${context.repositoryName}/angular";

// for angular AOT:
// import { ${context.componentTypeName}Module } from "${context.repositoryName}/aot/angular";

@NgModule({
    imports: [BrowserModule, FormsModule, ${context.componentTypeName}Module],
    declarations: [MainComponent],
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

\`yarn add ${context.repositoryName}\`

#### link css

\`\`\`html
<link rel="stylesheet" href="./node_modules/${context.repositoryName}/${context.componentShortName}.min.css" />
\`\`\`

#### vuejs component demo

\`yarn add vue vue-class-component\`

\`\`\`ts
import "${context.repositoryName}/vue";
\`\`\`

\`\`\`html
<${context.componentShortName} :data="data">
</${context.componentShortName}>
\`\`\`

the online demo: https://${context.author}.github.io/${context.repositoryName}/demo/vue/index.html

#### reactjs component demo

\`\`\`ts
import { ${context.componentTypeName} } from "${context.repositoryName}/react";
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
type ${context.componentTypeName}Data<T = any> = {
    component: string | Function; // the item component, for vuejs, it is the component name, for reactjs, it is the class object
    data: T; // the data will be passed to the component as \`data\` props
};
\`\`\`
`;
}

const srcTsconfigAot = `{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "outDir": "../dist/aot",
        "rootDir": "."
    },
    "angularCompilerOptions": {
        "strictMetadataEmit": true,
        "genDir": "compiled"
    },
    "include": [
        "angular-variables.ts",
        "angular.ts",
        "common.ts",
        "locales/"
    ]
}`;

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
        "downlevelIteration": true,
        "emitDecoratorMetadata": true,
        "newLine": "LF"
    },
    "exclude": [
        "./compiled/"
    ]
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
        "downlevelIteration": true,
        "emitDecoratorMetadata": true,
        "newLine": "LF"
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
        "downlevelIteration": true,
        "emitDecoratorMetadata": true,
        "newLine": "LF"
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
    output: {
      comments: false
    },
    exclude: [
    ]
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
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/react/index',
    output: {
      path: path.resolve(__dirname, 'react'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/angular/index',
    output: {
      path: path.resolve(__dirname, 'angular'),
      filename: 'index.bundle.js'
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
    output: {
      comments: false
    },
    exclude: [
    ]
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
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './demo/react/index',
    output: {
      path: path.resolve(__dirname, 'react'),
      filename: 'index.bundle.js'
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
// tslint:disable:no-duplicate-imports
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
    private data: ${context.componentTypeName}Data;

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
import { enableProdMode, Component, NgModule } from "@angular/core";

enableProdMode();

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
class MainComponent {
    data: ${context.componentTypeName}Data;
}

import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ${context.componentTypeName}Module, ${context.componentTypeName}Data } from "../../dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule, ${context.componentTypeName}Module],
    declarations: [MainComponent],
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
