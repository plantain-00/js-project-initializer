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

    await libs.appendFile(".gitignore", libs.gitignore(context));

    await libs.exec(`yarn add -E tslib@1`);
    await libs.exec(`yarn add -DE github-fork-ribbon-css`);
    await libs.exec(`yarn add -DE less`);
    await libs.exec(`yarn add -DE stylelint stylelint-config-standard`);
    await libs.exec(`yarn add -DE clean-css-cli`);
    await libs.exec(`yarn add -DE file2variable-cli`);
    await libs.exec(`yarn add -DE rev-static`);
    await libs.exec(`yarn add -DE webpack`);
    if (hasAngularChoice) {
        await libs.exec(`yarn add -DE @angular/compiler @angular/core @angular/compiler-cli`);
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

    await libs.exec(`lerna init`);

    await libs.mkdir("packages/core/demo/");
    await libs.writeFile(`packages/core/demo/index.ts`, "");
    await libs.writeFile(`packages/core/demo/tsconfig.json`, coreDemoTsconfigJson);

    await libs.mkdir("packages/core/src/");
    await libs.writeFile(`packages/core/src/${context.componentShortName}.less`, srcLess(context));
    await libs.writeFile(`packages/core/src/index.ts`, srcCommon(context));
    await libs.writeFile(`packages/core/src/tsconfig.json`, coreSrcTsconfigJson);

    await libs.writeFile(`packages/core/.npmignore`, npmignore);
    await libs.writeFile(`packages/core/package.json`, corePackageJson(context));

    await libs.mkdir("packages/react/demo/");
    await libs.writeFile(`packages/react/demo/index.ejs.html`, demoReactIndexEjsHtml);
    await libs.writeFile(`packages/react/demo/index.ts`, demoReactIndex(context));
    await libs.writeFile(`packages/react/demo/tsconfig.json`, reactDemoTsconfigJson);

    await libs.mkdir("packages/react/src/");
    await libs.writeFile(`packages/react/src/index.ts`, reactSrcIndexTs(context));
    await libs.writeFile(`packages/react/src/tsconfig.json`, reactSrcTsconfigJson);

    await libs.writeFile(`packages/react/.npmignore`, npmignore);
    await libs.writeFile(`packages/react/package.json`, reactPackageJson(context));

    await libs.mkdir("packages/vue/demo/");
    await libs.writeFile(`packages/vue/demo/index.ejs.html`, demoVueIndexEjsHtml);
    await libs.writeFile(`packages/vue/demo/index.ts`, demoVueIndex(context));
    await libs.writeFile(`packages/vue/demo/tsconfig.json`, vueDemoTsconfigJson);

    await libs.mkdir("packages/vue/src/");
    await libs.writeFile(`packages/vue/src/index.template.html`, `<div class="${context.componentShortName}"></div>`);
    await libs.writeFile(`packages/vue/src/index.ts`, vueSrcIndexTs(context));
    await libs.writeFile(`packages/vue/src/tsconfig.json`, vueSrcTsconfigJson);

    await libs.writeFile(`packages/vue/.npmignore`, npmignore);
    await libs.writeFile(`packages/vue/package.json`, vuePackageJson(context));

    await libs.writeFile(`packages/tsconfig.json`, tsconfigJson);

    if (hasAngularChoice) {
        await libs.mkdir("packages/angular/demo/aot/");
        await libs.writeFile(`packages/angular/demo/aot/index.ejs.html`, demoAotIndexEjsHtml);
        await libs.writeFile(`packages/angular/demo/aot/index.ts`, demoAotIndex(context));

        await libs.mkdir("packages/angular/demo/jit/");
        await libs.writeFile(`packages/angular/demo/jit/index.ejs.html`, demoJitIndexEjsHtml);
        await libs.writeFile(`packages/angular/demo/jit/index.ts`, demoJitIndex(context));

        await libs.writeFile(`packages/angular/demo/main.component.ts`, demoAngularMainComponent(context));
        await libs.writeFile(`packages/angular/demo/main.module.ts`, demoAngularMainModule(context));
        await libs.writeFile(`packages/angular/demo/tsconfig.json`, angularDemoTsconfigJson);

        await libs.mkdir("packages/angular/src/");
        await libs.writeFile(`packages/angular/src/index.template.html`, `<div class="${context.componentShortName}"></div>`);
        await libs.writeFile(`packages/angular/src/index.ts`, angularSrcIndexTs(context));
        await libs.writeFile(`packages/angular/src/index.component.ts`, angularSrcIndexComponentTs(context));
        await libs.writeFile(`packages/angular/src/tsconfig.json`, angularSrcTsconfigJson);

        await libs.writeFile(`packages/angular/.npmignore`, npmignore);
        await libs.writeFile(`packages/angular/package.json`, angularPackageJson(context));
    }

    await libs.writeFile(`webpack.config.js`, demoWebpackConfig(hasAngularChoice));
    await libs.writeFile(`rev-static.config.js`, demoRevStaticConfig);

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
    await libs.writeFile("appveyor.yml", libs.appveyorYml(context));
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(hasAngularChoice, context));
    await libs.writeFile(".browserslistrc", libs.browsersList);
    await libs.writeFile("postcss.config.js", libs.postcssConfig);

    const lernaString = await libs.readFile("lerna.json");
    const lernaJson: { [name: string]: any } = JSON.parse(lernaString);
    lernaJson.npmClient = "yarn";
    lernaJson.command = {
        publish: {
            message: "feat: publish %s",
        },
    };
    await libs.writeFile("lerna.json", JSON.stringify(lernaJson, null, 2));

    return {
        scripts: {
            bootstrap: "lerna bootstrap -- --frozen-lockfile",
            build: `clean-scripts build`,
            lint: `clean-scripts lint`,
            test: "clean-scripts test",
            fix: `clean-scripts fix`,
            watch: "clean-scripts watch",
            screenshot: "clean-scripts screenshot",
        },
        dependencies: {
            tslib: "1",
        },
        private: true,
    };
}

const tsconfigJson = `{
    "compilerOptions": {
        "target": "es5",
        "declaration": true,

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
        "emitDecoratorMetadata": true,
        "newLine": "LF"
    }
}
`;

function corePackageJson(context: libs.Context) {
    return `{
  "name": "${context.repositoryName}",
  "version": "1.0.0",
  "description": "${context.description}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${context.author}/${context.repositoryName}.git"
  },
  "author": "${context.authorName}",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/${context.author}/${context.repositoryName}/issues"
  },
  "homepage": "https://github.com/${context.author}/${context.repositoryName}#readme",
  "dependencies": {
    "tslib": "1"
  }
}
`;
}

function angularPackageJson(context: libs.Context) {
    return `{
  "name": "${context.componentShortName}-angular-component",
  "version": "1.0.0",
  "description": "${context.description}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${context.author}/${context.repositoryName}.git"
  },
  "author": "${context.authorName}",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/${context.author}/${context.repositoryName}/issues"
  },
  "homepage": "https://github.com/${context.author}/${context.repositoryName}#readme",
  "dependencies": {
    "@angular/common": "5",
    "@angular/core": "5",
    "@angular/forms": "5",
    "${context.repositoryName}": "^1.0.0"
  },
  "devDependencies": {
    "@angular/platform-browser": "5.0.3",
    "@angular/platform-browser-dynamic": "5.0.3",
    "core-js": "2.5.1",
    "rxjs": "5.5.2",
    "zone.js": "0.8.18"
  }
}
`;
}

function reactPackageJson(context: libs.Context) {
    return `{
  "name": "${context.componentShortName}-react-component",
  "version": "1.0.0",
  "description": "${context.description}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${context.author}/${context.repositoryName}.git"
  },
  "author": "${context.authorName}",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/${context.author}/${context.repositoryName}/issues"
  },
  "homepage": "https://github.com/${context.author}/${context.repositoryName}#readme",
  "dependencies": {
    "react": "16",
    "react-dom": "16",
    "${context.repositoryName}": "^1.0.0"
  },
  "devDependencies": {
    "@types/react": "16.0.25",
    "@types/react-dom": "16.0.3"
  }
}
`;
}

function vuePackageJson(context: libs.Context) {
    return `{
  "name": "${context.componentShortName}-vue-component",
  "version": "1.0.0",
  "description": "${context.description}",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${context.author}/${context.repositoryName}.git"
  },
  "author": "${context.authorName}",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/${context.author}/${context.repositoryName}/issues"
  },
  "homepage": "https://github.com/${context.author}/${context.repositoryName}#readme",
  "dependencies": {
    "vue": "2",
    "vue-class-component": "6",
    "${context.repositoryName}": "^1.0.0"
  }
}
`;
}

const npmignore = `
src
demo
`;

const vueSrcTsconfigJson = `{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "outDir": "../dist"
    }
}`;

const reactSrcTsconfigJson = `{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "outDir": "../dist"
    }
}`;

const angularSrcTsconfigJson = `{
    "extends": "../../tsconfig.json",
    "angularCompilerOptions": {
        "strictMetadataEmit": true
    },
    "compilerOptions": {
        "outDir": "../dist",
        "rootDir": "."
    }
}`;

const coreSrcTsconfigJson = `{
    "extends": "../../tsconfig.json",
    "angularCompilerOptions": {
        "strictMetadataEmit": true
    },
    "compilerOptions": {
        "outDir": "../dist"
    }
}`;

const coreDemoTsconfigJson = `{
    "extends": "../../tsconfig.json",
    "angularCompilerOptions": {
        "strictMetadataEmit": true
    }
}`;

const reactDemoTsconfigJson = `{
    "extends": "../../tsconfig.json"
}`;

const vueDemoTsconfigJson = `{
    "extends": "../../tsconfig.json"
}`;

const angularDemoTsconfigJson = `{
    "extends": "../../tsconfig.json",
    "angularCompilerOptions": {
        "strictMetadataEmit": true
    }
}`;

function demoAngularMainComponent(context: libs.Context) {
    return `import { Component } from "@angular/core";

import { ${context.componentTypeName}Data } from "../dist/";

@Component({
    selector: "app",
    template: \`
    <div>
        <a href="https://github.com/${context.author}/${context.repositoryName}/tree/master/packages/angular/demo" target="_blank">the source code of the demo</a>
        <br/>
        <${context.componentShortName} [data]="data">
        </${context.componentShortName}>
    </div>
    \`,
})
export class MainComponent {
    data: ${context.componentTypeName}Data;
}
`;
}

function demoAngularMainModule(context: libs.Context) {
    return `import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { ${context.componentTypeName}Module } from "../dist/";
import { MainComponent } from "./main.component";

@NgModule({
    imports: [BrowserModule, FormsModule, ${context.componentTypeName}Module],
    declarations: [MainComponent],
    bootstrap: [MainComponent],
})
export class MainModule { }
`;
}

function screenshotsIndexTs(hasAngularChoice: boolean) {
    return `import * as puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });

    const cases = [
        { type: "vue", url: "/packages/vue/demo" },
        { type: "react", url: "/packages/react/demo" },
        { type: "angular", url: "/packages/angular/demo/jit" },
        { type: "aot", url: "/packages/angular/demo/aot" },
    ];

    for (const { type, url } of cases) {
        await page.goto(\`http://localhost:8000\${url}\`);
        await page.screenshot({ path: \`screenshots/\${type}-initial.png\` });
    }

    browser.close();
})();
`;
}

function cleanScriptsConfigJs(hasAngularChoice: boolean, context: libs.Context) {
    const angularTemplateCommand = hasAngularChoice ? "const angularTemplateCommand = \`file2variable-cli packages/angular/src/*.template.html -o packages/angular/src/variables.ts --html-minify --base packages/angular/src\`\n" : "";
    const angularScript = hasAngularChoice ? "        angularTemplateCommand,\n" : "";
    const angularWatchScript = hasAngularChoice ? "    angular: \`\${angularTemplateCommand} --watch\`,\n" : "";
    return `const { Service, checkGitStatus, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = \`"packages/@(core|vue|react|angular)/@(src|demo)/**/*.@(ts|tsx)" "spec/**/*.ts" "screenshots/**/*.ts"\`
const lessFiles = \`"packages/core/src/**/*.less"\`
const jsFiles = \`"*.config.js" "spec/**/*.config.js"\`
const excludeTsFiles = \`"packages/@(core|vue|react|angular)/@(src|demo)/**/*.d.ts"\`

const vueTemplateCommand = \`file2variable-cli packages/vue/src/*.template.html -o packages/vue/src/variables.ts --html-minify --base packages/vue/src/\`
${angularTemplateCommand}
const ngcSrcCommand = [
  \`${hasAngularChoice ? "ngc" : "tsc"} -p packages/core/src\`,
  \`tsc -p packages/vue/src\`,
  \`tsc -p packages/react/src\`,
  \`ngc -p packages/angular/src\`
]
const tscDemoCommand = [
  \`ngc -p packages/core/demo\`,
  \`tsc -p packages/vue/demo\`,
  \`tsc -p packages/react/demo\`,
  \`ngc -p packages/angular/demo\`
]
const webpackCommand = \`webpack\`
const revStaticCommand = \`rev-static\`
const cssCommand = [
  \`lessc packages/core/src/${context.componentShortName}.less -sm=on > packages/core/src/${context.componentShortName}.css\`,
  \`postcss packages/core/src/${context.componentShortName}.css -o packages/core/dist/${context.componentShortName}.css\`,
  \`cleancss packages/core/dist/${context.componentShortName}.css -o packages/core/dist/${context.componentShortName}.min.css\`,
  \`cleancss packages/core/dist/${context.componentShortName}.min.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css -o packages/core/demo/index.bundle.css\`
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
      clean: \`rimraf "packages/@(core|vue|react|angular)/demo/**/@(*.bundle-*.js|*.bundle-*.css)"\`
    },
    revStaticCommand
  ],
  lint: {
    ts: \`tslint \${tsFiles} --exclude \${excludeTsFiles}\`,
    js: \`standard \${jsFiles}\`,
    less: \`stylelint \${lessFiles}\`,
    export: \`no-unused-export \${tsFiles} \${lessFiles} --exclude \${excludeTsFiles}\`,
    commit: \`commitlint --from=HEAD~1\`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: \`tslint --fix \${tsFiles} --exclude \${excludeTsFiles}\`,
    js: \`standard --fix \${jsFiles}\`,
    less: \`stylelint --fix \${lessFiles}\`
  },
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

const demoRevStaticConfig = `module.exports = {
  inputFiles: [
    'packages/@(vue|react|angular)/demo/**/index.bundle.js',
    'packages/@(vue|react|angular)/demo/**/*.ejs.html',
    'packages/core/demo/*.bundle.css'
  ],
  revisedFiles: [
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'packages',
  fileSize: 'file-size.json'
}
`;

function vueSrcIndexTs(context: libs.Context) {
    return `import Vue from "vue";
import Component from "vue-class-component";
import * as common from "${context.repositoryName}";
export * from "${context.repositoryName}";
import { indexTemplateHtml } from "./variables";

@Component({
    template: indexTemplateHtml,
    props: ["data"],
})
class ${context.componentTypeName} extends Vue {
    data: common.${context.componentTypeName}Data;
}

Vue.component("${context.componentShortName}", ${context.componentTypeName});
`;
}

function reactSrcIndexTs(context: libs.Context) {
    return `import * as React from "react";
import * as common from "${context.repositoryName}";
export * from "${context.repositoryName}";

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

function angularSrcIndexTs(context: libs.Context) {
    return `import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ${context.componentTypeName}Component } from "./index.component";
export * from "./index.component";
export * from "${context.repositoryName}";

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

function angularSrcIndexComponentTs(context: libs.Context) {
    return `import { Component, Input } from "@angular/core";
import * as common from "${context.repositoryName}";
import { indexTemplateHtml } from "./variables";

/**
 * @public
 */
@Component({
    selector: "${context.componentShortName}",
    template: indexTemplateHtml,
})
export class ${context.componentTypeName}Component {
    @Input()
    data: common.${context.componentTypeName}Data;
}
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
    const angularComponentDemo = hasAngularChoice ? `#### angular component

\`yarn add ${context.componentShortName}-angular-component\`

\`\`\`ts
import { ${context.componentTypeName}Module } from "${context.componentShortName}-angular-component";

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

the online demo: https://${context.author}.github.io/${context.repositoryName}/packages/angular/demo/jit

the AOT online demo: https://${context.author}.github.io/${context.repositoryName}/packages/angular/demo/aot` : "";
    return `
#### features

+ vuejs component
+ reactjs component${angularFeature}
+ custom component

#### link css

\`\`\`html
<link rel="stylesheet" href="./node_modules/${context.repositoryName}/dist/${context.componentShortName}.min.css" />
\`\`\`

#### vuejs component

\`yarn add ${context.componentShortName}-vue-component\`

\`\`\`ts
import "${context.componentShortName}-vue-component";
\`\`\`

\`\`\`html
<${context.componentShortName} :data="data">
</${context.componentShortName}>
\`\`\`

the online demo: https://${context.author}.github.io/${context.repositoryName}/packages/vue/demo

#### reactjs component

\`yarn add ${context.componentShortName}-react-component\`

\`\`\`ts
import { ${context.componentTypeName} } from "${context.componentShortName}-react-component";
\`\`\`

\`\`\`jsx
<${context.componentTypeName} data={this.data}>
</${context.componentTypeName}>
\`\`\`

the online demo: https://${context.author}.github.io/${context.repositoryName}/packages/react/demo

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
    font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", sans-serif;
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
    'vue$': 'vue/dist/vue.esm.js'
  }
}

module.exports = [
  {
    entry: './packages/vue/demo/index',
    output: {
      path: path.resolve(__dirname, 'packages/vue/demo'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './packages/react/demo/index',
    output: {
      path: path.resolve(__dirname, 'packages/react/demo'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './packages/angular/demo/jit/index',
    output: {
      path: path.resolve(__dirname, 'packages/angular/demo/jit'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './packages/angular/demo/aot/index',
    output: {
      path: path.resolve(__dirname, 'packages/angular/demo/aot'),
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
    'vue$': 'vue/dist/vue.esm.js'
  }
}

module.exports = [
  {
    entry: './packages/vue/demo/index',
    output: {
      path: path.resolve(__dirname, 'packages/vue/demo'),
      filename: 'index.bundle.js'
    },
    plugins,
    resolve
  },
  {
    entry: './packages/react/demo/index',
    output: {
      path: path.resolve(__dirname, 'packages/react/demo'),
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
import "../dist/";
import { ${context.componentTypeName}Data } from "../dist/";

@Component({
    template: \`
    <div>
        <a href="https://github.com/${context.author}/${context.repositoryName}/tree/master/packages/vue/demo" target="_blank">the source code of the demo</a>
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
<link rel="stylesheet" href="../../core/demo/<%=coreDemoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.coreDemoIndexBundleCss %>" />
<style>
    .github-fork-ribbon {
        position: fixed;
    }
</style>
<div id="container"></div>
<script src="./<%=vueDemoIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.vueDemoIndexBundleJs %>"></script>
`;

function demoReactIndex(context: libs.Context) {
    return `import * as React from "react";
import * as ReactDOM from "react-dom";
import { ${context.componentTypeName}, ${context.componentTypeName}Data } from "../dist/";

class Main extends React.Component<{}, {}> {
    private data: ${context.componentTypeName}Data;

    render() {
        return (
            <div>
                <a href="https://github.com/${context.author}/${context.repositoryName}/tree/master/packages/react/demo" target="_blank">the source code of the demo</a>
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
<link rel="stylesheet" href="../../core/demo/<%=coreDemoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.coreDemoIndexBundleCss %>" />
<style>
    .github-fork-ribbon {
        position: fixed;
    }
</style>
<div id="container"></div>
<script src="./<%=reactDemoIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.reactDemoIndexBundleJs %>"></script>
`;

function demoJitIndex(context: libs.Context) {
    return `
import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

import { MainModule } from "../main.module";

enableProdMode();

platformBrowserDynamic().bootstrapModule(MainModule);
`;
}

function demoAotIndex(context: libs.Context) {
    return `
import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowser } from "@angular/platform-browser";
import { enableProdMode } from "@angular/core";

import { MainModuleNgFactory } from "../main.module.ngfactory";

enableProdMode();

platformBrowser().bootstrapModuleFactory(MainModuleNgFactory);
`;
}

const demoJitIndexEjsHtml = `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../../../core/demo/<%=coreDemoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.coreDemoIndexBundleCss %>" />
<style>
    .github-fork-ribbon {
        position: fixed;
    }
</style>
<app></app>
<script src="./<%=angularDemoJitIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.angularDemoJitIndexBundleJs %>"></script>
`;

const demoAotIndexEjsHtml = `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../../../core/demo/<%=coreDemoIndexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.coreDemoIndexBundleCss %>" />
<style>
    .github-fork-ribbon {
        position: fixed;
    }
</style>
<app></app>
<script src="./<%=angularDemoAotIndexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.angularDemoAotIndexBundleJs %>"></script>
`;

const specIndexSpecTs = `import "../packages/core/dist";

it("", () => {
    // expect(true).toEqual(true);
});
`;
