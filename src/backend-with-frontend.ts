import * as libs from "./libs";

export async function runBackendWithFrontend(context: libs.Context) {
    context.hasKarma = true;

    await libs.exec(`yarn add -DE @types/node`);
    await libs.exec(`yarn add -DE tslib`);
    await libs.exec(`yarn add -DE github-fork-ribbon-css`);
    await libs.exec(`yarn add -DE less`);
    await libs.exec(`yarn add -DE stylelint stylelint-config-standard`);
    await libs.exec(`yarn add -DE vue vue-class-component`);
    await libs.exec(`yarn add -DE clean-css-cli`);
    await libs.exec(`yarn add -DE file2variable-cli`);
    await libs.exec(`yarn add -DE webpack`);
    await libs.exec(`yarn add -DE rev-static`);
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);
    await libs.exec(`yarn add -DE clean-release`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE no-unused-export`);
    await libs.exec(`yarn add -DE watch-then-execute`);
    await libs.exec(`yarn add -DE puppeteer @types/puppeteer`);
    await libs.exec(`yarn add -DE autoprefixer postcss-cli`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.mkdir("src");
    await libs.writeFile(`src/index.ts`, srcIndex);
    await libs.writeFile(`src/tsconfig.json`, srcTsconfig);

    await libs.mkdir("static");
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
    await libs.writeFile(".browserslistrc", libs.browsersList);
    await libs.writeFile("postcss.config.js", libs.postcssConfig);
    await libs.writeFile("Dockerfile", dockerfile);

    await libs.mkdir("spec");
    await libs.writeFile("spec/tsconfig.json", libs.tsconfigJson);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    await libs.mkdir("static_spec");
    await libs.writeFile(`static_spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`static_spec/tsconfig.json`, staticSpecTsconfig);
    await libs.writeFile(`static_spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`static_spec/indexSpec.ts`, libs.specIndexSpecTs);

    await libs.mkdir("screenshots");
    await libs.writeFile(`screenshots/tsconfig.json`, libs.tsconfigJson);
    await libs.writeFile(`screenshots/index.ts`, screenshotsIndexTs);

    await libs.mkdir("prerender");
    await libs.writeFile(`prerender/tsconfig.json`, libs.tsconfigJson);
    await libs.writeFile(`prerender/index.ts`, prerenderIndexTs);
    await libs.writeFile(`prerender/index.html`, "");

    return {
        scripts: {
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: "clean-scripts fix",
            release: "clean-scripts release",
            watch: "clean-scripts watch",
            screenshot: "clean-scripts screenshot",
            prerender: "clean-scripts prerender",
        },
    };
}

const port = 8000;

const dockerfile = `FROM node:alpine
WORKDIR /app
ADD . /app
RUN apk add --no-cache make gcc g++ python && yarn --production
EXPOSE ${port}
CMD ["node","dist/index.js"]
`;

const screenshotsIndexTs = `import * as puppeteer from "puppeteer";

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
    return `const { Service, execAsync, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = \`"src/**/*.ts" "static/**/*.ts" "spec/**/*.ts" "static_spec/**/*.ts"\`
const jsFiles = \`"*.config.js" "static/**/*.config.js" "static_spec/**/*.config.js"\`
const lessFiles = \`"static/**/*.less"\`

const tscSrcCommand = 'tsc -p src/'
const file2variableCommand = 'file2variable-cli static/*.template.html -o static/variables.ts --html-minify --base static'
const tscStaticCommand = 'tsc -p static/'
const webpackCommand = 'webpack --display-modules --config static/webpack.config.js'
const revStaticCommand = 'rev-static --config static/rev-static.config.js'
const cssCommand = [
  'lessc static/index.less > static/index.css',
  'postcss static/index.css -o static/index.postcss.css',
  'cleancss -o static/index.bundle.css static/index.postcss.css ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css'
]

module.exports = {
  build: {
    back: [
      'rimraf dist/'
      tscSrcCommand
    ],
    front: [
      {
        js: [
          file2variableCommand,
          tscStaticCommand,
          webpackCommand,
        ],
        css: cssCommand,
        clean: 'rimraf static/**/*.bundle-*.js static/**/*.bundle-*.css',
      }
      revStaticCommand
    ]
  },
  lint: {
    ts: \`tslint \${tsFiles}\`,
    js: \`standard \${jsFiles}\`,
    less: \`stylelint \${lessFiles}\`,
    export: \`no-unused-export \${tsFiles} \${lessFiles}\`
  },
  test: {
    jasmine: [
      'tsc -p spec',
      'jasmine'
    ],
    karma: [
      'tsc -p static_spec',
      'karma start static_spec/karma.config.js'
    ],
    consistency: async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(\`generated files doesn't match.\`)
      }
    }
  },
  fix: {
    ts: \`tslint --fix \${tsFiles}\`,
    js: \`standard --fix \${jsFiles}\`,
    less: \`stylelint --fix \${lessFiles}\`
  },
  release: \`clean-release\`,
  watch: {
    back: \`\${tscSrcCommand} --watch\`,
    template: \`\${file2variableCommand} --watch\`,
    front: \`\${tscStaticCommand} --watch\`,
    webpack: \`\${webpackCommand} --watch\`,
    less: () => watch(['static/**/*.less'], [], () => executeScriptAsync(cssCommand)),
    rev: \`\${revStaticCommand} --watch\`
  },
  screenshot: [
    new Service('node ./dist/index.js'),
    'tsc -p screenshots',
    'node screenshots/index.js'
  ],
  prerender: [
    new Service('node ./dist/index.js'),
    'tsc -p prerender',
    'node prerender/index.js',
    revStaticCommand
  ]
}
`;
}

function readMeDocument(context: libs.Context) {
    return `#### install

\`\`\`bash
git clone https://github.com/${context.author}/${context.repositoryName}-release.git . --depth=1 && yarn add --production
\`\`\`

#### docker

\`\`\`bash
docker run -d -p ${port}:${port} ${context.author}/${context.repositoryName}
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
    'yarn.lock',
    'README.md'
  ],
  exclude: [
  ],
  releaseRepository: 'https://github.com/${context.author}/${context.repositoryName}-release.git',
  postScript: [
    'cd [dir] && rm -rf .git',
    'cp Dockerfile [dir]',
    'cd [dir] && docker build -t ${context.author}/${context.repositoryName} . && docker push ${context.author}/${context.repositoryName}'
  ]
}
`;
}

const srcIndex = `function printInConsole(message: any) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

printInConsole("app started!");

process.on("SIGINT", () => {
  process.exit();
});

process.on("SIGTERM", () => {
  process.exit();
});
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
    prerender: fs.readFileSync('prerender/index.html')
  }
}
`;

function staticIndexEjsHtml(context: libs.Context) {
    return `<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${context.description}">
<title>${context.repositoryName}</title>
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
