import { ProjectKind } from "./libs";

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

export function getBadge(repositoryName: string, author: string, hasNpm: boolean) {
    let result = `[![Dependency Status](https://david-dm.org/${author}/${repositoryName}.svg)](https://david-dm.org/${author}/${repositoryName})
[![devDependency Status](https://david-dm.org/${author}/${repositoryName}/dev-status.svg)](https://david-dm.org/${author}/${repositoryName}#info=devDependencies)
[![Build Status](https://travis-ci.org/${author}/${repositoryName}.svg?branch=master)](https://travis-ci.org/${author}/${repositoryName})`;
    if (hasNpm) {
        result += `
[![npm version](https://badge.fury.io/js/${repositoryName}.svg)](https://badge.fury.io/js/${repositoryName})
[![Downloads](https://img.shields.io/npm/dm/${repositoryName}.svg)](https://www.npmjs.com/package/${repositoryName})

`;
    } else {
        result += `

`;
    }
    return result;
}

export function getWebpackConfig(kind: ProjectKind, hasVueChoice: boolean, hasReactChoice: boolean, hasAngularChoice: boolean) {
    const vueEntry = hasVueChoice ? `
        vue: "./demo/vue/index",` : "";
    const reactEntry = hasReactChoice ? `
        react: "./demo/react/index",` : "";
    const angularEntry = hasAngularChoice ? `
        angular: "./demo/angular/index",` : "";
    return kind === ProjectKind.UIComponent ? `const webpack = require("webpack");

module.exports = {
    entry: {${vueEntry}${reactEntry}${angularEntry}
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

export function getComponentShortName(componentName: string) {
    return (componentName.endsWith("component") && componentName.length - "component".length - 1 > 0)
        ? componentName.substring(0, componentName.length - "component".length - 1)
        : componentName;
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

export function getLessConfig(componentShortName: string) {
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

export const backendConfig = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

printInConsole("app started!");
`;
