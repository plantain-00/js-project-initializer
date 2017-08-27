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
    await libs.exec(`npm i -DE clean-scripts`);
    await libs.exec(`npm i -DE no-unused-export`);
    await libs.exec(`npm i -DE watch-then-execute`);
    await libs.exec(`npm i -DE http-server`);
    await libs.exec(`npm i -DE puppeteer`);

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

    await libs.writeFile(`spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`spec/tsconfig.json`, specTsconfig);
    await libs.writeFile(`spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`spec/indexSpec.ts`, libs.specIndexSpecTs);

    return {
        scripts: {
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: `clean-scripts fix`,
            watch: "clean-scripts watch",
            prerender: "clean-scripts prerender",
        },
    };
}

function cleanScriptsConfigJs(context: libs.Context) {
    return `const childProcess = require('child_process')

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
        'cleancss -o index.bundle.css index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css'
      ],
      clean: 'rimraf **/*.bundle-*.js *.bundle-*.css'
    },
    'rev-static',
    [
      'sw-precache --config sw-precache.config.js --verbose',
      'uglifyjs service-worker.js -o service-worker.bundle.js'
    ],
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const server = createServer()
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto('http://localhost:8000')
      await page.screenshot({ path: 'screenshot.png', fullPage: true })
      const content = await page.content()
      fs.writeFileSync('screenshot-src.html', content)
      server.close()
      browser.close()
    }
  ],
  lint: {
    ts: \`tslint "*.ts"\`,
    js: \`standard "**/*.config.js"\`,
    less: \`stylelint "index.less"\`,
    export: \`no-unused-export "*.ts" "index.less"\`
  },
  test: [
    'tsc -p spec',
    process.env.APPVEYOR ? 'echo "skip karma test"' : 'karma start spec/karma.config.js',
    'git checkout screenshot.png',
    () => new Promise((resolve, reject) => {
      childProcess.exec('git status -s', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          if (stdout) {
            reject(new Error('generated files does not match.'))
          } else {
            resolve()
          }
        }
      }).stdout.pipe(process.stdout)
    })
  ],
  fix: {
    ts: \`tslint "*.ts"\`,
    js: \`standard --fix "**/*.config.js"\`,
    less: \`stylelint --fix "index.less"\`
  },
  watch: {
    template: \`file2variable-cli *.template.html -o variables.ts --html-minify --watch\`,
    tsc: \`tsc --watch\`,
    webpack: \`webpack --watch\`,
    less: \`watch-then-execute "index.less" --script "clean-scripts build[0].css"\`,
    rev: \`rev-static --watch\`,
    sw: \`watch-then-execute "vendor.bundle-*.js" "index.html" --script "clean-scripts build[2]"\`
  },
  prerender: [
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const server = createServer()
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.waitFor(1000)
      await page.goto('http://localhost:8000')
      await page.waitFor(1000)
      const content = await page.evaluate(() => {
        const element = document.querySelector('#prerender-container')
        return element ? element.innerHTML : ''
      })
      fs.writeFileSync('prerender.html', content)
      server.close()
      browser.close()
    },
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
    }
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
    prerender: fs.readFileSync('prerender.html')
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
