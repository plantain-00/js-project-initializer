import * as libs from "./libs";

export async function runFrontend(context: libs.Context) {
    await libs.exec(`npm i -DE tslib`);
    await libs.exec(`npm i -DE github-fork-ribbon-css`);
    await libs.exec(`npm i -DE less`);
    await libs.exec(`npm i -DE stylelint stylelint-config-standard`);
    await libs.exec(`npm i -DE vue vue-class-component`);
    await libs.exec(`npm i -DE clean-css-cli`);
    await libs.exec(`npm i -DE file2variable-cli`);
    await libs.exec(`npm i -DE webpack`);
    await libs.exec(`npm i -DE rev-static`);
    await libs.exec(`npm i -DE sw-precache uglify-js@2`);

    await libs.writeFile(`index.ts`, source);
    await libs.writeFile(`index.template.html`, getTemplate(context.author, context.repositoryName));
    await libs.writeFile(`vendor.ts`, vendorSource);
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.prependFile("README.md", getBadge(context.repositoryName, context.author));
    await libs.writeFile(`index.less`, getLessConfig(context.componentShortName));
    await libs.writeFile(".stylelintrc", stylelint);
    await libs.writeFile(`webpack.config.js`, webpackConfig);
    await libs.writeFile(`rev-static.config.js`, revStaticConfig);
    await libs.writeFile("index.ejs.html", getHtml(context.author, context.repositoryName));
    await libs.writeFile("sw-precache.config.js", swPrecache);

    return {
        scripts: {
            cleanRev: `rimraf **/index.bundle-*.js *.bundle-*.css`,
            file2variable: `file2variable-cli index.template.html -o variables.ts --html-minify`,
            tsc: `tsc`,
            lessc: `lessc index.less > index.css`,
            cleancss: `cleancss -o index.bundle.css index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`,
            webpack: `webpack --config webpack.config.js`,
            revStatic: `rev-static --config rev-static.config.js`,
            swPrecache: "sw-precache --config sw-precache.config.js --verbose && uglifyjs service-worker.js -o service-worker.bundle.js",
            tslint: `tslint "*.ts"`,
            stylelint: `stylelint "**/*.less"`,
            build: [
                "npm run cleanRev",
                "npm run file2variable",
                "npm run tsc",
                "npm run lessc",
                "npm run cleancss",
                "npm run webpack",
                "npm run revStatic",
                "npm run swPrecache",
            ].join(" && "),
            lint: [
                "npm run tslint",
                "npm run stylelint",
            ].join(" && "),
        },
    };
}

const source = `import Vue from "vue";
import Component from "vue-class-component";
import { indexTemplateHtml } from "./variables";

@Component({
    template: indexTemplateHtml,
})
class App extends Vue {
}

// tslint:disable-next-line:no-unused-expression
new App({ el: "#container" });
`;

function getTemplate(authorName: string, componentName: string) {
    return `<div>
</div>`;
}

const tsconfig = `{
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

`;
}

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

const webpackConfig = `const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        index: "./index",
        vendor: "./vendor",
    },
    output: {
        path: __dirname,
        filename: "[name].bundle.js"
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

const revStaticConfig = `module.exports = {
    inputFiles: [
        "index.bundle.js",
        "vendor.bundle.js",
        "index.bundle.css",
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

function getHtml(authorName: string, repositoryName: string) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="<%=indexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleCss %>" />
<a class="github-fork-ribbon right-bottom" href="https://github.com/${authorName}/${repositoryName}" title="Fork me on GitHub" target="_blank">Fork me on GitHub</a>
<div id="container"></div>
<script src="<%=vendorBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.vendorBundleJs %>"></script>
<script src="<%=indexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleJs %>"></script>
`;
}

const swPrecache = `module.exports = {
  staticFileGlobs: [
    'index.bundle-*.css',
    'index.bundle-*.js',
    'vendor.bundle-*.css',
    'vendor.bundle-*.js',
    'index.html',
  ],
};
`;

const vendorSource = `import "vue";
import "vue-class-component";
`;
