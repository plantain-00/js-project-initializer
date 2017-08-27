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
    await libs.exec(`npm i -DE clean-release`);
    await libs.exec(`npm i -DE clean-scripts`);
    await libs.exec(`npm i -DE no-unused-export`);
    await libs.exec(`npm i -DE watch-then-execute`);
    await libs.exec(`npm i -DE puppeteer`);

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
    await libs.writeFile("static/prerender.html", "");

    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.appendFile("README.md", readMeDocument(context));
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml);
    await libs.writeFile("clean-release.config.js", getCleanReleaseConfigJs(context));
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    await libs.writeFile(`static_spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`static_spec/tsconfig.json`, staticSpecTsconfig);
    await libs.writeFile(`static_spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`static_spec/indexSpec.ts`, libs.specIndexSpecTs);

    return {
        scripts: {
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: "clean-scripts fix",
            release: "clean-scripts release",
            watch: "clean-scripts watch",
            prerender: "clean-scripts prerender",
        },
    };
}

function cleanScriptsConfigJs(context: libs.Context) {
    return `const childProcess = require('child_process')

module.exports = {
  build: {
    back: [
      'rimraf dist/'
      'tsc -p src/'
    ],
    front: [
      {
        js: [
          'file2variable-cli static/*.template.html -o static/variables.ts --html-minify --base static',
          'tsc -p static/',
          'webpack --display-modules --config static/webpack.config.js',
        ],
        css: [
          'lessc static/index.less > static/index.css',
          'cleancss -o static/index.bundle.css static/index.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css'
        ],
        clean: 'rimraf static/**/*.bundle-*.js static/**/*.bundle-*.css',
      }
      'rev-static --config static/rev-static.config.js',
      async () => {
        const puppeteer = require('puppeteer')
        const fs = require('fs')
        const server = childProcess.spawn('node', ['./dist/index.js'])
        server.stdout.pipe(process.stdout)
        server.stderr.pipe(process.stderr)
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.waitFor(1000)
        await page.goto('http://localhost:8000')
        await page.waitFor(1000)
        await page.screenshot({ path: 'static/screenshot.png', fullPage: true })
        const content = await page.content()
        fs.writeFileSync('static/screenshot-src.html', content)
        server.kill('SIGINT')
        browser.close()
      }
    ]
  },
  lint: {
    ts: \`tslint "src/**/*.ts" "static/**/*.ts"\`,
    js: \`standard "**/*.config.js"\`,
    less: \`stylelint "static/**/*.less"\`,
    export: \`no-unused-export "src/**/*.ts" "static/**/*.ts" "static/**/*.less"\`
  },
  test: {
    jasmine: [
      'tsc -p spec',
      'jasmine'
    ],
    karma: [
      'tsc -p static_spec',
      process.env.APPVEYOR ? 'echo "skip karma test"' : 'karma start static_spec/karma.config.js'
    ],
    consistency: [
      'git checkout static/screenshot.png',
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
    ]
  },
  fix: {
    ts: \`tslint --fix "src/**/*.ts" "static/**/*.ts"\`,
    js: \`standard --fix "**/*.config.js"\`,
    less: \`stylelint --fix "static/**/*.less"\`
  },
  release: \`clean-release\`,
  watch: {
    back: \`tsc -p src/ --watch\`,
    template: 'file2variable-cli static/*.template.html -o static/variables.ts --html-minify --base static --watch',
    front: \`tsc -p static/ --watch\`,
    webpack: \`webpack --config static/webpack.config.js --watch\`,
    less: \`watch-then-execute "static/index.less" --script "clean-scripts build[0].front[0].css"\`,
    rev: \`rev-static --config static/rev-static.config.js --watch\`
  },
  prerender: [
    async () => {
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const server = childProcess.spawn('node', ['./dist/index.js'])
      server.stdout.pipe(process.stdout)
      server.stderr.pipe(process.stderr)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.waitFor(1000)
      await page.goto('http://localhost:8000')
      await page.waitFor(1000)
      const content = await page.evaluate(() => {
        const element = document.querySelector('#prerender-container')
        return element ? element.innerHTML : ''
      })
      fs.writeFileSync('static/prerender.html', content)
      server.kill('SIGINT')
      browser.close()
    },
    'clean-scripts build.front[1]'
  ]
}
`;
}

function readMeDocument(context: libs.Context) {
    return `#### install

\`\`\`bash
git clone https://github.com/${context.author}/${context.repositoryName}-release.git . --depth=1 && npm i --production
\`\`\`
`;
}

function getCleanReleaseConfigJs(context: libs.Context) {
    return `module.exports = {
  include: [
    'dist/*.js',
    'static/*.bundle-*.js',
    'static/index.html',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  releaseRepository: 'https://github.com/${context.author}/${context.repositoryName}-release.git'
}
`;
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
        "skipLibCheck": true,
        "newLine": "LF"
    }
}`;

const staticIndexLess = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", "sans-serif";
  -webkit-font-smoothing: antialiased;
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
    index: './static/index',
    vendor: './static/vendor'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  },
  plugins,
  resolve
}
`;

const staticRevStaticConfig = `const fs = require('fs')

module.exports = {
  inputFiles: [
    'static/*.bundle.js',
    'static/*.bundle.css',
    'static/*.ejs.html'
  ],
  revisedFiles: [
  ],
  inlinedFiles: [
    'static/*.bundle.js',
    'static/*.bundle.css'
  ]
  outputFiles: file => file.replace('.ejs', ''),
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'static',
  fileSize: 'static/file-size.json',
  context: {
    prerender: fs.readFileSync('static/prerender.html')
  }
}
`;

function staticIndexEjsHtml(context: libs.Context) {
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

const staticIndex = `import Vue from "vue";
import Component from "vue-class-component";
import { indexTemplateHtml } from "./variables";

@Component({
    template: indexTemplateHtml,
})
class App extends Vue {
}

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
        "downlevelIteration": true,
        "newLine": "LF"
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
        "downlevelIteration": true,
        "newLine": "LF"
    }
}`;

const specTsconfig = `{
    "compilerOptions": {
        "target": "esnext",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "newLine": "LF"
    }
}`;
