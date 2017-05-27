import * as libs from "./libs";
import * as config from "./config";

const typescriptChoice = "transform: typescript";
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

const jasmineChoice = "test: jasmine";

const webpackChoice = "bundle: webpack";

const vueChoice = "UI: vue";
const reactChoice = "UI: react";
const angularChoice = "UI: angular";

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

async function run() {
    let packages = await libs.readFile("package.json");
    let packageJson: {
        name: string;
        author: string;
        scripts: { [key: string]: string };
    } = JSON.parse(packages);
    const repositoryName = packageJson.name;

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
            tslintChoice,
            npmignoreChoice,
            travisCIChoice,
            badgeChoice,
            jasmineChoice,
            taobaoRegistryChoice,
            rimrafChoice,
            gitIgnoreChoice,
            githubTemplate,
        ],
        choices: [
            typescriptChoice,
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
            jasmineChoice,
            webpackChoice,
            vueChoice,
            reactChoice,
            angularChoice,
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
    const options: string[] = answer["options"];
    const registry = options.some(o => o === taobaoRegistryChoice) ? "--registry=https://registry.npm.taobao.org" : "";

    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    const hasTypescript = options.some(o => o === typescriptChoice);

    if (hasTypescript) {
        console.log("installing typescript...");
        await libs.exec(`npm i -DE ${registry} typescript`);
        console.log("installing tslib...");
        await libs.exec(`npm i -SE ${registry} tslib`);
        console.log("setting src/tsconfig.json...");
        await libs.mkdir("src");
        await libs.writeFile("src/tsconfig.json", config.tsconfig);
        console.log("setting tssdk...");
        await libs.mkdir(".vscode");
        await libs.writeFile(".vscode/settings.json", config.tssdk);
        scripts.tsc = "tsc -p src";
        buildScripts.push("npm run tsc");
    }

    if (options.some(o => o === tslintChoice)) {
        console.log("installing tslint...");
        await libs.exec(`npm i -DE ${registry} tslint`);
        console.log("setting tslint.json...");
        await libs.writeFile("tslint.json", config.tslint);
        scripts.tslint = "tslint \"src/**/*.ts\" \"src/**/*.tsx\"";
        lintScripts.push("npm run tslint");
    }

    const hasNpm = options.some(o => o === npmignoreChoice);
    if (hasNpm) {
        console.log("setting .npmignore...");
        await libs.writeFile(".npmignore", config.npmignore);
    }

    if (options.some(o => o === gitIgnoreChoice)) {
        console.log("setting .gitignore...");
        await libs.appendFile(".gitignore", config.gitIgnore);
    }

    const hasTravis = options.some(o => o === travisCIChoice);
    if (hasTravis) {
        console.log("setting .travis.yml...");
        await libs.writeFile(".travis.yml", config.travis);
    }

    if (options.some(o => o === badgeChoice)) {
        console.log("setting badges...");
        await libs.appendFile("README.md", config.getBadge(repositoryName, author, hasTravis, hasNpm));
    }

    if (options.some(o => o === jasmineChoice)) {
        console.log("installing jasmine...");
        await libs.exec(`npm i -DE ${registry} jasmine`);
        if (hasTypescript) {
            console.log("installing @types/jasmine...");
            await libs.exec(`npm i -DE ${registry} @types/jasmine`);
        }
        console.log("init jasmine...");
        await libs.exec("./node_modules/.bin/jasmine init");
        if (hasTypescript) {
            console.log("setting spec/tsconfig.json...");
            await libs.writeFile("spec/tsconfig.json", config.jasmineTsconfig);
            scripts.test = "tsc -p spec && jasmine";
        } else {
            scripts.test = "jasmine";
        }
    }

    if (options.some(o => o === revStaticChoice)) {
        console.log("installing rev-static...");
        await libs.exec(`npm i -DE ${registry} rev-static`);
        console.log("init rev-static...");
        await libs.exec("./node_modules/.bin/rev-static init");
        scripts["rev-static"] = "rev-static --config rev-static.config.js";
    }

    if (options.some(o => o === webpackChoice)) {
        console.log("installing webpack...");
        await libs.exec(`npm i -DE ${registry} webpack`);
        console.log("setting webpack.config.js...");
        await libs.writeFile("webpack.config.js", config.webpack);
        scripts.webpack = "webpack --config webpack.config.js";
    }

    if (options.some(o => o === cliChoice)) {
        console.log("setting cli...");
        await libs.mkdir("bin");
        await libs.writeFile("bin/cli-name", config.cli);
    }

    if (options.some(o => o === babelChoice)) {
        console.log("installing babel...");
        await libs.exec(`npm i -DE ${registry} babel-cli babel-preset-env`);
        console.log("setting .babelrc...");
        await libs.writeFile(".babelrc", config.tslint);
        scripts.babel = "babel src";
        buildScripts.push("npm run babel");
    }

    if (options.some(o => o === eslintChoice)) {
        console.log("installing eslint...");
        await libs.exec(`npm i -DE ${registry} eslint`);
        console.log("init eslint...");
        await libs.exec("./node_modules/.bin/eslint --init");
        scripts.eslint = "eslint \"src/**/*.js\"";
        lintScripts.push("npm run eslint");
    }

    if (options.some(o => o === standardLintChoice)) {
        console.log("installing standard lint...");
        await libs.exec(`npm i -DE ${registry} standard`);
        scripts.standard = "standard \"src/**/*.js\"";
        lintScripts.push("npm run standard");
    }

    if (options.some(o => o === flowTypeChoice)) {
        console.log("installing flow type...");
        await libs.exec(`npm i -DE ${registry} flow-bin`);
        scripts.flow = "flow";
        lintScripts.push("npm run flow");
    }

    if (options.some(o => o === lessChoice)) {
        console.log("installing less...");
        await libs.exec(`npm i -DE ${registry} less`);
        scripts.lessc = `lessc src/${packageJson.name}.less > dist/${packageJson.name}.css`;
        buildScripts.push("npm run lessc");
    }

    if (options.some(o => o === stylelintChoice)) {
        console.log("installing stylelint...");
        await libs.exec(`npm i -DE ${registry} stylelint stylelint-config-standard`);
        console.log("setting .stylelintrc...");
        await libs.writeFile(".stylelintrc", config.stylelint);
        scripts.stylelint = "stylelint \"src/**/*.less\"";
        lintScripts.push("npm run stylelint");
    }

    if (options.some(o => o === vueChoice)) {
        console.log("installing vue...");
        await libs.exec(`npm i -DE ${registry} vue vue-class-component`);
    }

    if (options.some(o => o === reactChoice)) {
        console.log("installing react...");
        await libs.exec(`npm i -DE ${registry} react react-dom`);
        if (hasTypescript) {
            console.log("installing @types/react @types/react-dom...");
            await libs.exec(`npm i -DE ${registry} @types/react @types/react-dom`);
        }
    }

    if (options.some(o => o === angularChoice)) {
        console.log("installing angular...");
        await libs.exec(`npm i -DE ${registry} @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
    }

    if (options.some(o => o === cleanCssCliChoice)) {
        console.log("installing clean-css-cli...");
        await libs.exec(`npm i -DE ${registry} clean-css-cli`);
        scripts.cleancss = `cleancss -o dist/${packageJson.name}.min.css dist/${packageJson.name}.css`;
    }

    if (options.some(o => o === htmlMinifierChoice)) {
        console.log("installing html-minifier...");
        await libs.exec(`npm i -DE ${registry} html-minifier`);
        scripts["html-minifier"] = "html-minifier --collapse-whitespace --case-sensitive --collapse-inline-tag-whitespace src/index.html -o dist/index.html";
    }

    if (options.some(o => o === rimrafChoice)) {
        console.log("installing rimraf...");
        await libs.exec(`npm i -DE ${registry} rimraf`);
        scripts.clean = "rimraf dist";
        buildScripts.unshift("npm run clean");
    }

    if (options.some(o => o === image2base64Choice)) {
        console.log("installing image2base64-cli...");
        await libs.exec(`npm i -DE ${registry} image2base64-cli`);
        scripts.image2base64 = "image2base64-cli images/*.png --less src/variables.less";
    }

    if (options.some(o => o === file2variableChoice)) {
        console.log("installing file2variable-cli...");
        await libs.exec(`npm i -DE ${registry} file2variable-cli`);
        scripts.file2variable = "file2variable-cli src/index.html -o src/variables.ts";
    }

    if (options.some(o => o === cpyChoice)) {
        console.log("installing cpy-cli...");
        await libs.exec(`npm i -DE ${registry} cpy-cli`);
        scripts.cpy = "cpy src/index.html dist/";
    }

    if (options.some(o => o === mkdirpChoice)) {
        console.log("installing mkdirp...");
        await libs.exec(`npm i -DE ${registry} mkdirp`);
        scripts.cpy = "mkdirp foo/bar";
    }

    if (options.some(o => o === swPrecacheChoice)) {
        console.log("installing sw-precache...");
        await libs.exec(`npm i -DE ${registry} sw-precache`);
        console.log("setting sw-precache.config.js...");
        await libs.writeFile("sw-precache.config.js", config.swPrecache);
        scripts["sw-precache"] = "sw-precache --config sw-precache.config.js";
    }

    if (options.some(o => o === uglifyjsChoice)) {
        console.log("installing uglify-js...");
        await libs.exec(`npm i -DE ${registry} uglify-js`);
        scripts.uglifyjs = "uglifyjs index.js -o index.min.js";
    }

    if (options.some(o => o === githubTemplate)) {
        console.log("setting github issue/pull request template...");
        await libs.mkdir(".github");
        await libs.writeFile(".github/ISSUE_TEMPLATE.md", config.githubIssueTemplate);
        await libs.writeFile(".github/PULL_REQUEST_TEMPLATE.md", config.githubPullRequestTemplate);
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
    await libs.writeFile("package.json", JSON.stringify(packageJson, null, "  ") + "\n");

    console.log("success.");
}

run().catch(error => {
    console.log(error);
});
