import * as libs from "./libs";

export async function runFrontend(context: libs.Context) {
    context.hasKarma = true;

    await libs.mkdir(`spec`);

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
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);

    await libs.writeFile(`index.ts`, index);
    await libs.writeFile(`index.template.html`, indexTemplateHtml);
    await libs.writeFile(`vendor.ts`, vendor);
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.writeFile(`index.less`, indexLess);
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(`webpack.config.js`, webpackConfig);
    await libs.writeFile(`rev-static.config.js`, revStaticConfig);
    await libs.writeFile("index.ejs.html", indexEjsHtml(context));
    await libs.writeFile("sw-precache.config.js", swPrecacheConfig);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));

    await libs.writeFile(`spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`spec/tsconfig.json`, specTsconfig);
    await libs.writeFile(`spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`spec/indexSpec.ts`, libs.specIndexSpecTs);

    return {
        scripts: {
            cleanRev: `rimraf **/index.bundle-*.js *.bundle-*.css`,
            file2variable: `file2variable-cli *.template.html -o variables.ts --html-minify`,
            tsc: `tsc`,
            lessc: `lessc index.less > index.css`,
            cleancss: `cleancss -o index.bundle.css index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css`,
            webpack: `webpack --config webpack.config.js`,
            revStatic: `rev-static --config rev-static.config.js`,
            swPrecache: "sw-precache --config sw-precache.config.js --verbose && uglifyjs service-worker.js -o service-worker.bundle.js",
            tslint: `tslint "*.ts"`,
            stylelint: `stylelint "**/*.less"`,
            standard: `standard "**/*.config.js"`,
            fix: `standard --fix "**/*.config.js"`,
            test: "tsc -p spec && karma start spec/karma.config.js",
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
                "npm run standard",
            ].join(" && "),
        },
    };
}

const index = `import Vue from "vue";
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

const indexTemplateHtml = `<div>
</div>`;

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

const indexLess = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", "sans-serif";
  -webkit-font-smoothing: antialiased;
  user-select: none;
}
`;

const webpackConfig = `const webpack = require('webpack')

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
    index: './index',
    vendor: './vendor'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  },
  plugins,
  resolve
}
`;

const revStaticConfig = `module.exports = {
  inputFiles: [
    'index.bundle.js',
    'vendor.bundle.js',
    'index.bundle.css',
    'index.ejs.html'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName
}
`;

function indexEjsHtml(context: libs.Context) {
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

const swPrecacheConfig = `module.exports = {
  staticFileGlobs: [
    'index.bundle-*.css',
    'index.bundle-*.js',
    'vendor.bundle-*.css',
    'vendor.bundle-*.js',
    'index.html'
  ]
}
`;

const vendor = `import "vue";
import "vue-class-component";
`;

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
