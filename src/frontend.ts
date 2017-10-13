import * as libs from "./libs";

export async function runFrontend(context: libs.Context) {
    context.hasKarma = true;

    await libs.exec(`yarn add -DE tslib`);
    await libs.exec(`yarn add -DE github-fork-ribbon-css`);
    await libs.exec(`yarn add -DE less`);
    await libs.exec(`yarn add -DE stylelint stylelint-config-standard`);
    await libs.exec(`yarn add -DE vue vue-class-component`);
    await libs.exec(`yarn add -DE clean-css-cli`);
    await libs.exec(`yarn add -DE file2variable-cli`);
    await libs.exec(`yarn add -DE webpack`);
    await libs.exec(`yarn add -DE rev-static`);
    await libs.exec(`yarn add -DE sw-precache uglify-js@2`);
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE no-unused-export`);
    await libs.exec(`yarn add -DE watch-then-execute`);
    await libs.exec(`yarn add -DE http-server`);
    await libs.exec(`yarn add -DE puppeteer @types/puppeteer`);
    await libs.exec(`yarn add -DE autoprefixer postcss-cli`);

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
    await libs.writeFile("appveyor.yml", libs.appveyorYml);
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));
    await libs.writeFile("prerender.html", "");
    await libs.writeFile(".browserslistrc", libs.browsersList);
    await libs.writeFile("postcss.config.js", libs.postcssConfig);

    await libs.mkdir(`spec`);
    await libs.writeFile(`spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`spec/tsconfig.json`, specTsconfig);
    await libs.writeFile(`spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`spec/indexSpec.ts`, libs.specIndexSpecTs);

    await libs.mkdir(`screenshots`);
    await libs.writeFile(`screenshots/tsconfig.json`, libs.tsconfigJson);
    await libs.writeFile(`screenshots/index.ts`, screenshotIndexTs);

    await libs.mkdir(`prerender`);
    await libs.writeFile(`prerender/tsconfig.json`, libs.tsconfigJson);
    await libs.writeFile(`prerender/index.ts`, prerenderIndexTs);
    await libs.writeFile(`prerender/index.html`, "");

    return {
        scripts: {
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: `clean-scripts fix`,
            watch: "clean-scripts watch",
            prerender: "clean-scripts prerender",
            screenshot: "clean-scripts screenshot",
        },
    };
}

const screenshotIndexTs = `import * as puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });
    await page.goto("http://localhost:8000");
    await page.waitFor(2000);
    await page.screenshot({ path: "screenshots/initial.png", fullPage: true });

    browser.close();
})();`;

const prerenderIndexTs = `import * as puppeteer from "puppeteer";
import * as fs from "fs";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });
    await page.waitFor(1000);
    await page.goto("http://localhost:8000");
    await page.waitFor(2000);
    const content = await page.evaluate(() => {
        const element = document.querySelector("#prerender-container");
        return element ? element.innerHTML.trim() : "";
    });
    fs.writeFileSync("prerender/index.html", content);

    browser.close();
})();`;

function cleanScriptsConfigJs(context: libs.Context) {
    return `const childProcess = require('child_process')
const util = require('util')
const { Service } = require('clean-scripts')

const execAsync = util.promisify(childProcess.exec)

const tsFiles = \`"*.ts" "spec/**/*.ts" "screenshots/**/*.ts" "prerender/**/*.ts"\`
const jsFiles = \`"*.config.js" "spec/**/*.config.js"\`
const lessFiles = \`"*.less"\`

module.exports = {
  build: [
    {
      js: [
        'file2variable-cli *.template.html -o variables.ts --html-minify',
        'tsc',
        'webpack --display-modules'
      ],
      css: [
        'lessc index.less > index.css',
        'postcss index.css -o index.postcss.css',
        'cleancss -o index.bundle.css index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css'
      ],
      clean: 'rimraf **/*.bundle-*.js *.bundle-*.css'
    },
    'rev-static',
    [
      'sw-precache --config sw-precache.config.js --verbose',
      'uglifyjs service-worker.js -o service-worker.bundle.js'
    ]
  ],
  lint: {
    ts: \`tslint \${tsFiles}\`,
    js: \`standard \${jsFiles}\`,
    less: \`stylelint \${lessFiles}\`,
    export: \`no-unused-export \${tsFiles} \${lessFiles}\`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(\`generated files doesn't match.\`)
      }
    }
  ],
  fix: {
    ts: \`tslint --fix \${tsFiles}\`,
    js: \`standard --fix \${jsFiles}\`,
    less: \`stylelint --fix \${lessFiles}\`
  },
  watch: {
    template: \`file2variable-cli *.template.html -o variables.ts --html-minify --watch\`,
    tsc: \`tsc --watch\`,
    webpack: \`webpack --watch\`,
    less: \`watch-then-execute "index.less" --script "clean-scripts build[0].css"\`,
    rev: \`rev-static --watch\`,
    sw: \`watch-then-execute "vendor.bundle-*.js" "index.html" --script "clean-scripts build[2]"\`
  },
  screenshot: [
    new Service('http-server -p 8000'),
    'tsc -p screenshots',
    'node screenshots/index.js'
  ],
  prerender: [
    new Service('http-server -p 8000'),
    'tsc -p prerender',
    'node prerender/index.js',
    'clean-scripts build[1]',
    'clean-scripts build[2]'
  ]
}
`;
}

const index = `import Vue from "vue";
import Component from "vue-class-component";
import { indexTemplateHtml } from "./variables";

@Component({
    template: indexTemplateHtml,
})
class App extends Vue {
}

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
        "downlevelIteration": true,
        "newLine": "LF"
    },
    "files": [
        "index.ts",
        "variables.ts",
        "vendor.ts"
    ]
}`;

const indexLess = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", "sans-serif";
  -webkit-font-smoothing: antialiased;
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
    output: {
      comments: false
    },
    exclude: [
    ]
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

const revStaticConfig = `const fs = require('fs')

module.exports = {
  inputFiles: [
    '*.bundle.js',
    '*.bundle.css',
    '*.ejs.html'
  ],
  excludeFiles: [
    'service-worker.bundle.js'
  ],
  revisedFiles: [
  ],
  inlinedFiles: [
    'index.bundle.js',
    'index.bundle.css'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  fileSize: 'file-size.json',
  context: {
    prerender: fs.readFileSync('prerender/index.html')
  }
}
`;

function indexEjsHtml(context: libs.Context) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<%-inline.indexBundleCss %>
<a class="github-fork-ribbon right-bottom" href="https://github.com/${context.author}/${context.repositoryName}" title="Fork me on GitHub" target="_blank" rel="noopener">Fork me on GitHub</a>
<div id="prerender-container">
<div id="container"><%-context.prerender %></div>
</div>
<script src="<%=vendorBundleJs %>" crossOrigin="anonymous" integrity="<%=sri.vendorBundleJs %>"></script>
<%-inline.indexBundleJs %>
`;
}

const swPrecacheConfig = `module.exports = {
  staticFileGlobs: [
    'index.html',
    'vendor.bundle-*.js'
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
        "downlevelIteration": true,
        "newLine": "LF"
    }
}`;
