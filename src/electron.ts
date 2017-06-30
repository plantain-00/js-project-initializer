import * as libs from "./libs";

export async function runElectron(context: libs.Context) {
    await libs.mkdir("scripts");

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

    await libs.writeFile(`main.ts`, main);
    await libs.writeFile(`index.html`, indexHtml);
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.writeFile(".stylelintrc", libs.stylelint);

    await libs.writeFile("scripts/index.ts", scriptsIndex);
    await libs.writeFile(`scripts/index.less`, scriptsIndexLess);
    await libs.writeFile("scripts/tsconfig.json", scriptsTsconfig);
    await libs.writeFile(`scripts/index.template.html`, scriptsIndexTemplateHtml);
    await libs.writeFile(`scripts/webpack.config.js`, scriptsWebpackConfig);

    return {
        scripts: {
            file2variable: `file2variable-cli scripts/index.template.html -o scripts/variables.ts --html-minify`,
            tsc: `tsc && tsc -p scripts/`,
            lessc: `lessc scripts/index.less > scripts/index.css`,
            cleancss: `cleancss -o scripts/index.bundle.css scripts/index.css`,
            webpack: `webpack --config scripts/webpack.config.js`,
            tslint: `tslint "*.ts"`,
            stylelint: `stylelint "scripts/*.less"`,
            standard: `standard "**/*.config.js"`,
            fix: `standard --fix "**/*.config.js"`,
            osx: "rimraf dist/news-darwin-x64 && electron-packager . 'news' --out=dist --arch=x64 --version=1.2.1 --app-version='1.0.8' --platform=darwin --ignore='dist/'",
            win: "rimraf dist/news-win32-x64 && electron-packager . 'news' --out=dist --arch=x64 --version=1.2.1 --app-version='1.0.8' --platform=win32 --ignore='dist/'",
            start: "electron .",
            build: [
                "npm run file2variable",
                "npm run tsc",
                "npm run lessc",
                "npm run cleancss",
                "npm run webpack",
            ].join(" && "),
            lint: [
                "npm run tslint",
                "npm run stylelint",
                "npm run standard",
            ].join(" && "),
        },
    };
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
        "target": "esnext",

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
  user-select: none;
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

// tslint:disable-next-line:no-unused-expression
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
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  }
}
`;
