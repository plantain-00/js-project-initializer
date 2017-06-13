import * as libs from "./libs";
import * as config from "./config";

const typescriptChoice = "transform: typescript";
const tslibChoice = "transform: tslib";
const flowTypeChoice = "transform: flow type";
const babelChoice = "transform: babel";
const lessChoice = "transform: less";

const tslintChoice = "lint: tslint";
const eslintChoice = "lint: eslint";
const standardLintChoice = "lint: standard";
const stylelintChoice = "lint: stylelint";

const npmignoreChoice = "npm: .npmignore";
const taobaoRegistryChoice = "npm: taobao registry";
const cliChoice = "npm: CLI";

const gitIgnoreChoice = "git: ignore";
const githubTemplate = "git: github issue/pull request template";

const travisCIChoice = "CI: travis CI";

const badgeChoice = "doc: badge";
const UIComponentUsageChoice = "doc: UI component usage";
const forkMeOnGithubChoice = "doc: fork me on Github";

const jasmineChoice = "test: jasmine";

const webpackChoice = "bundle: webpack";

const vueChoice = "UI: vue";
const reactChoice = "UI: react";
const angularChoice = "UI: angular";

const vueStarterChoice = "UI: vue starter";
const reactStarterChoice = "UI: react starter";
const angularStarterChoice = "UI: angular starter";

const rimrafChoice = "script: rimraf";
const cpyChoice = "script: cpy-cli";
const mkdirpChoice = "script: mkdirp";
const revStaticChoice = "script: rev-static";
const cleanCssCliChoice = "script: clean-css-cli";
const htmlMinifierChoice = "script: html-minifier";
const image2base64Choice = "script: image2base64-cli";
const file2variableChoice = "script: file2variable-cli";
const swPrecacheChoice = "script: sw-precache";
const uglifyjsChoice = "script: uglify-js";

function printInConsole(message: string) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

async function run() {
    let packages = await libs.readFile("package.json");
    let packageJson: {
        name: string;
        author: string;
        scripts: { [key: string]: string };
        bin: { [key: string]: string };
    } = JSON.parse(packages);
    const repositoryName = packageJson.name;
    const componentShortName = config.getComponentShortName(repositoryName);
    const componentTypeName = config.getComponentTypeName(componentShortName);

    const scripts: { [name: string]: string } = packageJson.scripts;

    const authorAnswer = await libs.inquirer.prompt({
        type: "input",
        name: "author",
        message: "Input author:",
        default: packageJson.author || "plantain-00",
    });
    const author: string = authorAnswer.author;

    const answer = await libs.inquirer.prompt({
        type: "checkbox",
        name: "options",
        message: "Choose options:",
        default: [
            typescriptChoice,
            tslibChoice,
            tslintChoice,
            npmignoreChoice,
            travisCIChoice,
            badgeChoice,
            UIComponentUsageChoice,
            jasmineChoice,
            rimrafChoice,
            gitIgnoreChoice,
            githubTemplate,
            forkMeOnGithubChoice,
        ],
        choices: [
            typescriptChoice,
            tslibChoice,
            flowTypeChoice,
            babelChoice,
            lessChoice,
            tslintChoice,
            eslintChoice,
            standardLintChoice,
            stylelintChoice,
            npmignoreChoice,
            taobaoRegistryChoice,
            cliChoice,
            gitIgnoreChoice,
            travisCIChoice,
            badgeChoice,
            UIComponentUsageChoice,
            forkMeOnGithubChoice,
            jasmineChoice,
            webpackChoice,
            vueChoice,
            reactChoice,
            angularChoice,
            vueStarterChoice,
            reactStarterChoice,
            angularStarterChoice,
            rimrafChoice,
            cpyChoice,
            mkdirpChoice,
            revStaticChoice,
            cleanCssCliChoice,
            htmlMinifierChoice,
            image2base64Choice,
            file2variableChoice,
            swPrecacheChoice,
            uglifyjsChoice,
            githubTemplate,
        ],
    });
    const options: string[] = answer.options;
    const registry = options.some(o => o === taobaoRegistryChoice) ? "--registry=https://registry.npm.taobao.org" : "";

    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    const hasTypescript = options.some(o => o === typescriptChoice);
    const hasUIConponentChoice = options.some(o => o === UIComponentUsageChoice);

    if (hasTypescript) {
        printInConsole("installing typescript...");
        await libs.exec(`npm i -DE ${registry} typescript`);
        printInConsole("setting src/tsconfig.json...");
        await libs.mkdir("src");
        await libs.writeFile("src/tsconfig.json", hasUIConponentChoice ? config.tsconfigFrontEnd : config.tsconfigNodejs);
        printInConsole("setting tssdk...");
        await libs.mkdir(".vscode");
        await libs.writeFile(".vscode/settings.json", config.tssdk);
        scripts.tsc = hasUIConponentChoice ? "tsc -p src && tsc -p demo" : "tsc -p src";
        buildScripts.push("npm run tsc");
        if (hasUIConponentChoice) {
            await libs.mkdir("demo");
            await libs.writeFile("demo/tsconfig.json", config.tsconfigDemo);
        }
    }

    if (options.some(o => o === tslibChoice)) {
        printInConsole("installing tslib...");
        await libs.exec(`npm i -SE ${registry} tslib`);
    }

    if (options.some(o => o === tslintChoice)) {
        printInConsole("installing tslint...");
        await libs.exec(`npm i -DE ${registry} tslint`);
        printInConsole("setting tslint.json...");
        await libs.writeFile("tslint.json", config.tslint);
        scripts.tslint = "tslint \"src/**/*.ts\" \"src/**/*.tsx\"";
        lintScripts.push("npm run tslint");
    }

    const hasNpm = options.some(o => o === npmignoreChoice);
    if (hasNpm) {
        printInConsole("setting .npmignore...");
        await libs.writeFile(".npmignore", config.npmignore);
    }

    if (options.some(o => o === gitIgnoreChoice)) {
        printInConsole("setting .gitignore...");
        await libs.appendFile(".gitignore", config.gitIgnore);
    }

    const hasTravis = options.some(o => o === travisCIChoice);
    if (hasTravis) {
        printInConsole("setting .travis.yml...");
        await libs.writeFile(".travis.yml", config.travis);
    }

    if (options.some(o => o === badgeChoice)) {
        printInConsole("setting badges...");
        await libs.appendFile("README.md", config.getBadge(repositoryName, author, hasTravis, hasNpm));
    }

    if (hasUIConponentChoice) {
        printInConsole("setting UI component usage choice");
        await libs.appendFile("README.md", config.getUIComponentUsage(author, repositoryName, componentShortName, componentTypeName));
    }

    if (options.some(o => o === jasmineChoice)) {
        printInConsole("installing jasmine...");
        await libs.exec(`npm i -DE ${registry} jasmine`);
        if (hasTypescript) {
            printInConsole("installing @types/jasmine...");
            await libs.exec(`npm i -DE ${registry} @types/jasmine`);
        }
        printInConsole("init jasmine...");
        await libs.exec("./node_modules/.bin/jasmine init");
        if (hasTypescript) {
            printInConsole("setting spec/tsconfig.json...");
            await libs.writeFile("spec/tsconfig.json", config.jasmineTsconfig);
            scripts.test = "tsc -p spec && jasmine";
        } else {
            scripts.test = "jasmine";
        }
    }

    const hasForkMeOnGithubChoice = options.some(o => o === forkMeOnGithubChoice);
    if (hasForkMeOnGithubChoice) {
        printInConsole("installing github-fork-ribbon-css...");
        await libs.exec(`npm i -DE ${registry} github-fork-ribbon-css`);
    }

    let bin: { [key: string]: string } | undefined;
    if (options.some(o => o === cliChoice)) {
        printInConsole("setting cli...");
        await libs.mkdir("bin");
        await libs.writeFile(`bin/${repositoryName}`, config.cli);
        bin = {
            [repositoryName]: `bin/${repositoryName}`,
        };
    }

    if (options.some(o => o === babelChoice)) {
        printInConsole("installing babel...");
        await libs.exec(`npm i -DE ${registry} babel-cli babel-preset-env`);
        printInConsole("setting .babelrc...");
        await libs.writeFile(".babelrc", config.tslint);
        scripts.babel = "babel src";
        buildScripts.push("npm run babel");
    }

    if (options.some(o => o === eslintChoice)) {
        printInConsole("installing eslint...");
        await libs.exec(`npm i -DE ${registry} eslint`);
        printInConsole("init eslint...");
        await libs.exec("./node_modules/.bin/eslint --init");
        scripts.eslint = "eslint \"src/**/*.js\"";
        lintScripts.push("npm run eslint");
    }

    if (options.some(o => o === standardLintChoice)) {
        printInConsole("installing standard lint...");
        await libs.exec(`npm i -DE ${registry} standard`);
        scripts.standard = "standard \"src/**/*.js\"";
        lintScripts.push("npm run standard");
    }

    if (options.some(o => o === flowTypeChoice)) {
        printInConsole("installing flow type...");
        await libs.exec(`npm i -DE ${registry} flow-bin`);
        scripts.flow = "flow";
        lintScripts.push("npm run flow");
    }

    if (options.some(o => o === lessChoice)) {
        printInConsole("installing less...");
        await libs.exec(`npm i -DE ${registry} less`);
        scripts.lessc = `lessc src/${componentShortName}.less > dist/${componentShortName}.css`;
        buildScripts.push("npm run lessc");
    }

    if (options.some(o => o === stylelintChoice)) {
        printInConsole("installing stylelint...");
        await libs.exec(`npm i -DE ${registry} stylelint stylelint-config-standard`);
        printInConsole("setting .stylelintrc...");
        await libs.writeFile(".stylelintrc", config.stylelint);
        scripts.stylelint = "stylelint \"src/**/*.less\"";
        lintScripts.push("npm run stylelint");
    }

    if (options.some(o => o === vueChoice)) {
        printInConsole("installing vue...");
        await libs.exec(`npm i -DE ${registry} vue vue-class-component`);
    }

    if (options.some(o => o === reactChoice)) {
        printInConsole("installing react...");
        await libs.exec(`npm i -DE ${registry} react react-dom`);
        if (hasTypescript) {
            printInConsole("installing @types/react @types/react-dom...");
            await libs.exec(`npm i -DE ${registry} @types/react @types/react-dom`);
        }
    }

    if (options.some(o => o === angularChoice)) {
        printInConsole("installing angular...");
        await libs.exec(`npm i -DE ${registry} @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
    }

    const hasVueStarter = options.some(o => o === vueStarterChoice);
    if (hasVueStarter) {
        printInConsole("setting vue starter...");
        await libs.mkdir("src");
        await libs.writeFile("src/vue.ts", config.getVueStarter(repositoryName, componentShortName, componentTypeName));
        await libs.writeFile("src/vue.template.html", "<div></div>");
        await libs.mkdir("demo/vue");
        await libs.writeFile("demo/vue/index.ts", config.getVueStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        await libs.writeFile("demo/vue/index.ejs.html", config.getVueStarterDemoHtml(repositoryName));
    }

    const hasReactStarter = options.some(o => o === reactStarterChoice);
    if (hasReactStarter) {
        printInConsole("setting react starter...");
        await libs.mkdir("src");
        await libs.writeFile("src/react.tsx", config.getReactStarter(repositoryName, componentShortName, componentTypeName));
        await libs.mkdir("demo/react");
        await libs.writeFile("demo/react/index.tsx", config.getReactStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        await libs.writeFile("demo/react/index.ejs.html", config.getReactStarterDemoHtml(repositoryName));
    }

    const hasAngularStarter = options.some(o => o === angularStarterChoice);
    if (hasAngularStarter) {
        printInConsole("setting angular starter...");
        await libs.mkdir("src");
        await libs.writeFile("src/angular.ts", config.getAngularStarter(repositoryName, componentShortName, componentTypeName));
        await libs.writeFile("src/angular.template.html", "<div></div>");
        await libs.mkdir("demo/angular");
        await libs.writeFile("demo/angular/index.ts", config.getAngularStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        await libs.writeFile("demo/angular/index.ejs.html", config.getAngularStarterDemoHtml(repositoryName));
    }

    if (options.some(o => o === vueStarterChoice)
        || options.some(o => o === reactStarterChoice)
        || options.some(o => o === angularStarterChoice)) {
        printInConsole("setting starter common.ts...");
        await libs.writeFile("src/common.ts", config.getStarterCommonSource(repositoryName, componentShortName, componentTypeName));
    }

    if (options.some(o => o === cleanCssCliChoice)) {
        printInConsole("installing clean-css-cli...");
        await libs.exec(`npm i -DE ${registry} clean-css-cli`);
        const forkMeOnGithubPart = hasForkMeOnGithubChoice ? " ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css" : "";
        scripts.cleancss = `cleancss -o dist/${componentShortName}.min.css dist/${componentShortName}.css`;
        buildScripts.push("npm run cleancss");
        if (hasUIConponentChoice) {
            scripts["cleancss-demo"] = `cleancss -o demo/index.bundle.css dist/${componentShortName}.min.css` + forkMeOnGithubPart;
            buildScripts.push("npm run cleancss-demo");
        }
    }

    if (options.some(o => o === htmlMinifierChoice)) {
        printInConsole("installing html-minifier...");
        await libs.exec(`npm i -DE ${registry} html-minifier`);
        scripts["html-minifier"] = "html-minifier --collapse-whitespace --case-sensitive --collapse-inline-tag-whitespace src/index.html -o dist/index.html";
    }

    if (options.some(o => o === rimrafChoice)) {
        printInConsole("installing rimraf...");
        await libs.exec(`npm i -DE ${registry} rimraf`);
        scripts.clean = "rimraf dist";
        buildScripts.unshift("npm run clean");
    }

    if (options.some(o => o === image2base64Choice)) {
        printInConsole("installing image2base64-cli...");
        await libs.exec(`npm i -DE ${registry} image2base64-cli`);
        scripts.image2base64 = "image2base64-cli images/*.png --less src/variables.less";
    }

    if (options.some(o => o === file2variableChoice)) {
        printInConsole("installing file2variable-cli...");
        await libs.exec(`npm i -DE ${registry} file2variable-cli`);
        const commands: string[] = [];
        if (hasVueStarter) {
            commands.push("file2variable-cli src/vue.template.html -o src/vue-variables.ts --html-minify");
        }
        if (hasAngularStarter) {
            commands.push("file2variable-cli src/angular.template.html -o src/angular-variables.ts --html-minify");
        }
        if (commands.length === 0) {
            commands.push("file2variable-cli src/index.html -o src/variables.ts --html-minify");
        }
        scripts.file2variable = commands.join(" && ");
    }

    if (options.some(o => o === cpyChoice)) {
        printInConsole("installing cpy-cli...");
        await libs.exec(`npm i -DE ${registry} cpy-cli`);
        scripts.cpy = "cpy src/index.html dist/";
    }

    if (options.some(o => o === mkdirpChoice)) {
        printInConsole("installing mkdirp...");
        await libs.exec(`npm i -DE ${registry} mkdirp`);
        scripts.cpy = "mkdirp foo/bar";
    }

    if (options.some(o => o === swPrecacheChoice)) {
        printInConsole("installing sw-precache...");
        await libs.exec(`npm i -DE ${registry} sw-precache`);
        printInConsole("setting sw-precache.config.js...");
        await libs.writeFile("sw-precache.config.js", config.swPrecache);
        scripts["sw-precache"] = "sw-precache --config sw-precache.config.js";
    }

    if (options.some(o => o === uglifyjsChoice)) {
        printInConsole("installing uglify-js...");
        await libs.exec(`npm i -DE ${registry} uglify-js`);
        scripts.uglifyjs = "uglifyjs index.js -o index.min.js";
    }

    if (options.some(o => o === githubTemplate)) {
        printInConsole("setting github issue/pull request template...");
        await libs.mkdir(".github");
        await libs.writeFile(".github/ISSUE_TEMPLATE.md", config.githubIssueTemplate);
        await libs.writeFile(".github/PULL_REQUEST_TEMPLATE.md", config.githubPullRequestTemplate);
    }

    if (options.some(o => o === webpackChoice)) {
        printInConsole("installing webpack...");
        await libs.exec(`npm i -DE ${registry} webpack`);
        printInConsole("setting webpack.config.js...");
        const webpackConfig = config.getWebpackConfig(hasUIConponentChoice);
        if (hasUIConponentChoice) {
            await libs.mkdir("demo");
            await libs.writeFile("demo/webpack.config.js", webpackConfig);
            scripts.webpack = "webpack --config demo/webpack.config.js";
        } else {
            await libs.writeFile("webpack.config.js", webpackConfig);
            scripts.webpack = "webpack --config webpack.config.js";
        }
        buildScripts.push("npm run webpack");
    }

    if (options.some(o => o === revStaticChoice)) {
        printInConsole("installing rev-static...");
        await libs.exec(`npm i -DE ${registry} rev-static`);
        printInConsole("setting rev-static.config.js...");
        if (hasUIConponentChoice) {
            await libs.mkdir("demo");
            await libs.writeFile("demo/rev-static.config.js", config.revStaticConfigDemo);
        } else {
            await libs.writeFile("demo/rev-static.config.js", config.revStaticConfig);
        }
        scripts["rev-static"] = hasUIConponentChoice ? "rev-static --config demo/rev-static.config.js" : "rev-static --config rev-static.config.js";
        buildScripts.push("npm run rev-static");
        printInConsole("setting index.ejs.html...");
        await libs.writeFile("index.ejs.html", config.getRevStaticHtml(hasForkMeOnGithubChoice, author, repositoryName));
        scripts["clean-rev"] = "rimraf demo/*.bundle-*.js demo/*.bundle-*.css";
        buildScripts.unshift("npm run clean-rev");
    }

    if (!scripts.build) {
        scripts.build = buildScripts.join(" && ");
    }
    if (!scripts.lint) {
        scripts.lint = lintScripts.join(" && ");
    }

    packages = await libs.readFile("package.json");
    packageJson = JSON.parse(packages);
    packageJson.scripts = scripts;
    if (bin) {
        packageJson.bin = bin;
    }
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    printInConsole("success.");
}

run().catch(error => {
    printInConsole(error);
});
