import * as libs from "./libs";

export async function runElectron(context: libs.Context) {
    context.hasKarma = true;

    await libs.appendFile(".gitignore", libs.gitignore(context));

    await libs.exec(`yarn add -E electron`);
    await libs.exec(`yarn add -DE electron-packager`);
    await libs.exec(`yarn add -DE @types/node`);
    await libs.exec(`yarn add -DE tslib`);
    await libs.exec(`yarn add -DE less`);
    await libs.exec(`yarn add -DE stylelint stylelint-config-standard`);
    await libs.exec(`yarn add -DE vue vue-class-component`);
    await libs.exec(`yarn add -DE clean-css-cli`);
    await libs.exec(`yarn add -DE file2variable-cli`);
    await libs.exec(`yarn add -DE webpack`);
    await libs.exec(`yarn add -DE standard`);
    await libs.exec(`yarn add -DE jasmine @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-firefox-launcher`);
    await libs.exec(`yarn add -DE clean-scripts`);
    await libs.exec(`yarn add -DE no-unused-export`);
    await libs.exec(`yarn add -DE watch-then-execute`);
    await libs.exec(`yarn add -DE autoprefixer postcss-cli`);

    await libs.exec("./node_modules/.bin/jasmine init");

    await libs.writeFile(`main.ts`, main);
    await libs.writeFile(`index.html`, indexHtml);
    await libs.writeFile(`tsconfig.json`, tsconfig);
    await libs.prependFile("README.md", libs.readMeBadge(context));
    await libs.writeFile(".stylelintrc", libs.stylelint);
    await libs.writeFile(".travis.yml", libs.getTravisYml(context));
    await libs.writeFile("appveyor.yml", libs.appveyorYml(context));
    await libs.writeFile("clean-release.config.js", cleanReleaseConfigJs(context));
    await libs.writeFile("clean-scripts.config.js", cleanScriptsConfigJs(context));
    await libs.writeFile(".browserslistrc", browsersList);
    await libs.writeFile("postcss.config.js", libs.postcssConfig);

    await libs.mkdir("scripts");
    await libs.writeFile("scripts/index.ts", scriptsIndex);
    await libs.writeFile(`scripts/index.less`, scriptsIndexLess);
    await libs.writeFile("scripts/tsconfig.json", scriptsTsconfig);
    await libs.writeFile(`scripts/index.template.html`, scriptsIndexTemplateHtml);
    await libs.writeFile(`scripts/webpack.config.js`, scriptsWebpackConfig);

    await libs.mkdir("spec");
    await libs.writeFile("spec/tsconfig.json", libs.tsconfigJson);
    await libs.writeFile("spec/indexSpec.ts", libs.specIndexSpecTs);

    await libs.mkdir("static_spec");
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
            watch: "clean-scripts watch",
        },
    };
}

function cleanScriptsConfigJs(context: libs.Context) {
    return `const { checkGitStatus, executeScriptAsync } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = \`"src/**/*.ts" "scripts/**/*.ts" "spec/**/*.ts" "static_spec/**/*.ts"\`
const jsFiles = \`"*.config.js" "scripts/**/*.config.js" "static_spec/**/*.config.js"\`
const lessFiles = \`"scripts/**/*.less"\`

const templateCommand = 'file2variable-cli scripts/index.template.html -o scripts/variables.ts --html-minify'
const tscScriptsCommand = 'tsc -p scripts/'
const webpackCommand = 'webpack --config scripts/webpack.config.js'
const cssCommand = [
  'lessc scripts/index.less > scripts/index.css',
  'postcss scripts/index.css -o scripts/index.postcss.css',
  'cleancss -o scripts/index.bundle.css scripts/index.postcss.css',
]

module.exports = {
  build: {
    back: 'tsc',
    front: {
      js: [
        templateCommand,
        tscScriptsCommand,
        webpackCommand
      ],
      css: cssCommand
    }
  },
  lint: {
    ts: \`tslint \${tsFiles}\`,
    js: \`standard \${jsFiles}\`,
    less: \`stylelint \${lessFiles}\`,
    export: \`no-unused-export \${tsFiles} \${lessFiles}\`,
    commit: \`commitlint --from=HEAD~1\`
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
    consistence: () => checkGitStatus()
  },
  fix: {
    ts: \`tslint --fix \${tsFiles}\`,
    js: \`standard --fix \${jsFiles}\`,
    less: \`stylelint --fix \${lessFiles}\`
  },
  watch: {
    template: \`\${templateCommand} --watch\`,
    script: \`\${tscScriptsCommand} --watch\`,
    webpack: \`\${webpackCommand} --watch\`,
    less: () => watch(['scripts/**/*.less'], [], () => executeScriptAsync(cssCommand)),
  }
}
`;
}

function cleanReleaseConfigJs(context: libs.Context) {
    return `const { name, devDependencies: { electron: electronVersion } } = require('./package.json')

module.exports = {
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
  askVersion: true,
  postScript: [
    'git add package.json',
    'git commit -m "feat: publish v[version]"',
    'git tag v[version]',
    'git push',
    'git push origin v[version]',
    'cd "[dir]" && npm i --production',
    'prune-node-modules "[dir]/node_modules"',
    \`electron-packager "[dir]" "\${name}" --out=dist --arch=x64 --electron-version=\${electronVersion} --platform=darwin --ignore="dist/"\`,
    \`electron-packager "[dir]" "\${name}" --out=dist --arch=x64 --electron-version=\${electronVersion} --platform=win32 --ignore="dist/"\`,
    \`7z a -r -tzip dist/\${name}-darwin-x64-[version].zip dist/\${name}-darwin-x64/\`,
    \`7z a -r -tzip dist/\${name}-win32-x64-$[version].zip dist/\${name}-win32-x64/\`,
    \`electron-installer-windows --src dist/\${name}-win32-x64/ --dest dist/\`,
    \`cd dist && create-dmg \${name}-darwin-x64/\${name}.app\`
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
        "skipLibCheck": true,
        "newLine": "LF"
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
  font-family: "Lucida Grande", "Lucida Sans Unicode", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Verdana,Aril", sans-serif;
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
        "downlevelIteration": true,
        "newLine": "LF"
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
      'vue$': 'vue/dist/vue.esm.js'
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
        "downlevelIteration": true,
        "newLine": "LF"
    }
}`;

const browsersList = `last 2 Chrome versions
`;
