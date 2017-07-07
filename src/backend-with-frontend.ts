import * as libs from "./libs";

export async function runBackendWithFrontend(context: libs.Context) {
    context.hasKarma = true;

    await libs.mkdir("src");
    await libs.mkdir("static");
    await libs.mkdir("static_spec");

    await libs.exec(`npm i -DE @types/node`);
    await libs.exec(`npm i -DE tslib`);
    await libs.exec(`npm i -DE github-fork-ribbon-css`);
    await libs.exec(`npm i -DE less`);
    await libs.exec(`npm i -DE stylelint stylelint-config-standard`);
    await libs.exec(`npm i -DE vue vue-class-component`);
    await libs.exec(`npm i -DE clean-css-cli`);
    await libs.exec(`npm i -DE file2variable-cli`);
    await libs.exec(`npm i -DE webpack`);
    await libs.exec(`npm i -DE rev-static`);
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`src/index.ts`, srcIndex);
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);

    await libs.writeFile(`static/tsconfig.json`, staticTsconfig);
    await libs.writeFile(`static/index.ts`, staticIndex);
    await libs.writeFile(`static/vendor.ts`, staticVendor);
    await libs.writeFile(`static/index.template.html`, staticIndexTemplateHtml);
    await libs.writeFile(`static/index.less`, staticIndexLess);
    await libs.writeFile(`static/webpack.config.js`, staticWebpackConfig);
    await libs.writeFile(`static/rev-static.config.js`, staticRevStaticConfig);
    await libs.writeFile("static/index.ejs.html", staticIndexEjsHtml(context));

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    await libs.writeFile(`static_spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`static_spec/tsconfig.json`, staticSpecTsconfig);
    await libs.writeFile(`static_spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`static_spec/indexSpec.ts`, libs.specIndexSpecTs);

    return {
        scripts: {
            cleanRev: `rimraf static/**/*.bundle-*.js static/**/*.bundle-*.css`,
            file2variable: `file2variable-cli static/*.template.html -o static/variables.ts --html-minify --base static`,
            tsc: `tsc -p src/ && tsc -p static/`,
            lessc: `lessc static/index.less > static/index.css`,
            cleancss: `cleancss -o static/index.bundle.css static/index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`,
            webpack: `webpack --config static/webpack.config.js`,
            revStatic: `rev-static --config static/rev-static.config.js`,
            tslint: `tslint "src/**/*.ts" "static/**/*.ts"`,
            stylelint: `stylelint "static/**/*.less"`,
            standard: `standard "**/*.config.js"`,
            fix: `standard --fix "**/*.config.js"`,
            test: "tsc -p spec && jasmine && tsc -p static_spec && karma start static_spec/karma.config.js",
            build: [
                "npm run cleanRev",
                "npm run file2variable",
                "npm run tsc",
                "npm run lessc",
                "npm run cleancss",
                "npm run webpack",
                "npm run revStatic",
            ].join(" && "),
            lint: [
                "npm run tslint",
                "npm run stylelint",
                "npm run standard",
            ].join(" && "),
        },
    };
}

const srcIndex = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

printInConsole("app started!");
`;

const srcTsconfig = `{
    "compilerOptions": {
        "target": "esnext",
        "outDir": "../dist",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`;

const staticIndexLess = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", "sans-serif";
  -webkit-font-smoothing: antialiased;
  user-select: none;
}
`;

const staticWebpackConfig = `const webpack = require('webpack')

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
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['index', 'vendor']
  })
]

const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.min.js'
  }
}

module.exports = {
  entry: {
    index: './static/index',
    vendor: './static/vendor'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle-[hash].js'
  },
  plugins,
  resolve
}
`;

const staticRevStaticConfig = `module.exports = {
  inputFiles: [
    'static/*.bundle-*.js',
    'static/*.bundle.css',
    'static/*.ejs.html'
  ],
  revisedFiles: [
    'static/*.bundle-*.js'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'static',
  fileSize: 'static/file-size.json'
}
`;

function staticIndexEjsHtml(context: libs.Context) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="<%=indexBundleCss %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleCss %>" />
<a class="github-fork-ribbon right-bottom" href="https://github.com/${context.author}/${context.repositoryName}" title="Fork me on GitHub" target="_blank">Fork me on GitHub</a>
<div id="container"></div>
<script src="<%=vendorBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.vendorBundleJs %>"></script>
<script src="<%=indexBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.indexBundleJs %>"></script>
`;
}

const staticIndex = `import Vue from "vue";
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

const staticVendor = `import "vue";
import "vue-class-component";
`;

const staticTsconfig = `{
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

const staticIndexTemplateHtml = `<div>
</div>`;

const staticSpecTsconfig = `{
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

const specTsconfig = `{
    "compilerOptions": {
        "target": "esnext",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    }
}`;
