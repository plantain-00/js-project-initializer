import * as libs from "./libs";

export async function runElectron(context: libs.Context) {
    context.hasKarma = true;

    await libs.mkdir("scripts");
    await libs.mkdir("static_spec");

    await libs.exec(`npm i -SE electron`);
    await libs.exec(`npm i -DE electron-packager`);
    await libs.exec(`npm i -DE @types/node`);
    await libs.exec(`npm i -DE tslib`);
    await libs.exec(`npm i -DE less`);
    await libs.exec(`npm i -DE stylelint stylelint-config-standard`);
    await libs.exec(`npm i -DE vue vue-class-component`);
    await libs.exec(`npm i -DE clean-css-cli`);
    await libs.exec(`npm i -DE file2variable-cli`);
    await libs.exec(`npm i -DE webpack`);
    await libs.exec(`npm i -DE standard`);
    await libs.exec(`npm i -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);
    await libs.exec(`npm i -DE clean-release`);
    await libs.exec(`npm i -DE clean-scripts`);
    await libs.exec(`npm i -DE no-unused-export`);
    await libs.exec(`npm i -DE watch-then-execute`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`main.ts`, main);
    await libs.writeFile(`index.html`, indexHtml);
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml);
    await libs.writeFile("clean-release.config.js", cleanReleaseConfigJs(context));
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));

    await libs.writeFile("scripts/index.ts", scriptsIndex);
    await libs.writeFile(`scripts/index.less`, scriptsIndexLess);
    await libs.writeFile("scripts/tsconfig.json", scriptsTsconfig);
    await libs.writeFile(`scripts/index.template.html`, scriptsIndexTemplateHtml);
    await libs.writeFile(`scripts/webpack.config.js`, scriptsWebpackConfig);

    await libs.writeFile("spec/tsconfig.json", specTsconfig);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    await libs.writeFile(`static_spec/karma.config.js`, libs.specKarmaConfigJs);
    await libs.writeFile(`static_spec/tsconfig.json`, staticSpecTsconfig);
    await libs.writeFile(`static_spec/webpack.config.js`, libs.specWebpackConfigJs);
    await libs.writeFile(`static_spec/indexSpec.ts`, libs.specIndexSpecTs);

    return {
        scripts: {
            start: "electron .",
            build: "clean-scripts build",
            lint: "clean-scripts lint",
            test: "clean-scripts test",
            fix: `clean-scripts fix`,
            release: "clean-scripts release",
            watch: "clean-scripts watch",
        },
    };
}

function cleanScriptsConfigJs(context: libs.Context) {
    return `const childProcess = require('child_process')

module.exports = {
  build: {
    back: 'tsc',
    front: {
      js: [
        'file2variable-cli scripts/index.template.html -o scripts/variables.ts --html-minify',
        'tsc -p scripts/',
        'webpack --display-modules --config scripts/webpack.config.js'
      ],
      css: [
        'lessc scripts/index.less > scripts/index.css',
        'cleancss -o scripts/index.bundle.css scripts/index.css',
      ]
    }
  },
  lint: {
    ts: \`tslint "*.ts" "scripts/*.ts"\`,
    js: \`standard "**/*.config.js"\`,
    less: \`stylelint "scripts/*.less"\`,
    export: \`no-unused-export "*.ts" "scripts/*.ts"\`
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
    consistence: () => new Promise((resolve, reject) => {
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
  },
  fix: {
    ts: \`tslint --fix "*.ts" "scripts/*.ts"\`,
    js: \`standard --fix "**/*.config.js"\`,
    less: \`stylelint --fix "scripts/*.less"\`
  },
  release: [
    'rimraf dist',
    'clean-release'
  ],
  watch: \`watch-then-execute "*.ts" "scripts/*.ts" "scripts/*.less" "scripts/*.template.html" --exclude "scripts/variables.ts" --script "npm run build"\`
}
`;
}

function cleanReleaseConfigJs(context: libs.Context) {
    return `module.exports = {
  include: [
    'main.js',
    'scripts/index.css',
    'scripts/index.js',
    'scripts/index.html',
    'LICENSE',
    'package.json',
    'README.md'
  ],
  exclude: [
  ],
  postScript: [
    'cd [dir] && npm i --production',
    'electron-packager [dir] "${context.repositoryName}" --out=dist --arch=x64 --version=1.2.1 --app-version="1.0.8" --platform=darwin --ignore="dist/"',
    'electron-packager [dir] "${context.repositoryName}" --out=dist --arch=x64 --version=1.2.1 --app-version="1.0.8" --platform=win32 --ignore="dist/"'
  ]
}
`;
}

const main = `import * as electron from "electron";

let mainWindow: Electron.BrowserWindow | undefined;

electron.app.on("window-all-closed", () => {
    electron.app.quit();
});

electron.app.on("ready", () => {
    mainWindow = new electron.BrowserWindow({ width: 1200, height: 800 });
    mainWindow.loadURL(\`file://\${__dirname}/index.html\`);
    mainWindow.on("closed", () => {
        mainWindow = undefined;
    });
    // mainWindow.webContents.openDevTools();
});
`;

const indexHtml = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>news fetcher client v1.2.1</title>
    <link rel="stylesheet" href="scripts/index.bundle.css">
</head>

<body>
    <div id="container"></div>
    <script>
        require("./scripts/index.bundle.js");
    </script>
</body>

</html>`;

const tsconfig = `{
    "compilerOptions": {
        "target": "es6",

        "module": "commonjs",
        "strict": true,
        "noUnusedLocals": true,
        "noImplicitReturns": true,
        "skipLibCheck": true
    },
    "exclude": [
        "scripts/",
        "node_modules/"
    ]
}`;

const scriptsIndexLess = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", "sans-serif";
  -webkit-font-smoothing: antialiased;
}
`;

const scriptsIndex = `// import * as electron from "electron";
import Vue from "vue";
import Component from "vue-class-component";
import { scriptsIndexTemplateHtml } from "./variables";

@Component({
    template: scriptsIndexTemplateHtml,
})
class App extends Vue {
}

new App({ el: "#container" });
`;

const scriptsTsconfig = `{
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
}
`;

const scriptsIndexTemplateHtml = `<div>
</div>`;

const scriptsWebpackConfig = `const webpack = require('webpack')

module.exports = {
  entry: {
    index: './scripts/index'
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js'
  },
  plugins: [
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
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  }
}
`;

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
