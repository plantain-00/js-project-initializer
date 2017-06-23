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

const vuexChoice = "UI: vuex";
const vueRouterChoice = "UI: vue-router";

const mobxChoice = "UI: mobx";
const reactRouterChoice = "UI: react-router";

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
        repository: {
            type: string;
            url: string;
        }
        author: string;
        scripts: { [key: string]: string };
        bin: { [key: string]: string };
    } = JSON.parse(packages);
    const repositoryName = packageJson.name;
    const componentShortName = config.getComponentShortName(repositoryName);
    const componentTypeName = libs.upperCamelCase(componentShortName);

    const scripts: { [name: string]: string } = packageJson.scripts;

    let defaultAuthor = packageJson.author;
    if (packageJson.repository && packageJson.repository.url) {
        const items = packageJson.repository.url.split("/");
        if (items.length >= 4) {
            defaultAuthor = items[3];
        }
    }

    const authorAnswer = await libs.inquirer.prompt({
        type: "input",
        name: "author",
        message: "Input author:",
        default: defaultAuthor,
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
            UIComponentUsageChoice,
            rimrafChoice,
            gitIgnoreChoice,
            githubTemplate,
            forkMeOnGithubChoice,
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
            vuexChoice,
            vueRouterChoice,
            mobxChoice,
            reactRouterChoice,
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
    const hasVueChoice = options.some(o => o === vueChoice);
    const hasReactChoice = options.some(o => o === reactChoice);
    const hasAngularChoice = options.some(o => o === angularChoice);
    const hasFile2Variable = options.some(o => o === file2variableChoice);

    const isFrontEndProject = hasUIConponentChoice || hasVueChoice || hasReactChoice || hasAngularChoice;
    const demoDirectory = hasUIConponentChoice ? "demo" : ".";
    const distDirectory = hasUIConponentChoice ? "dist" : ".";
    if (demoDirectory) {
        await libs.mkdir(demoDirectory);
    }
    const srcDirectory = isFrontEndProject ? "src" : ".";
    if (srcDirectory) {
        await libs.mkdir(srcDirectory);
    }

    if (hasFile2Variable) {
        buildScripts.push("npm run file2variable");
    }

    if (hasTypescript) {
        printInConsole("installing typescript...");
        await libs.exec(`npm i -DE ${registry} typescript@rc`);
        printInConsole(`setting ${srcDirectory}/tsconfig.json...`);
        await libs.writeFile(`${srcDirectory}/tsconfig.json`, hasUIConponentChoice ? config.tsconfigFrontEnd : config.tsconfigNodejs);
        printInConsole("setting tssdk...");
        await libs.mkdir(".vscode");
        await libs.writeFile(".vscode/settings.json", config.tssdk);
        scripts.tsc = hasUIConponentChoice ? `tsc -p ${srcDirectory}/ && tsc -p ${demoDirectory}/` : `tsc -p ${srcDirectory}/`;
        buildScripts.push("npm run tsc");
        if (hasUIConponentChoice) {
            await libs.writeFile(`${demoDirectory}/tsconfig.json`, config.tsconfigDemo);
        }
        if (isFrontEndProject) {
            printInConsole("installing tslib...");
            await libs.exec(`npm i -SE ${registry} tslib`);
        }
    }

    if (options.some(o => o === tslintChoice)) {
        printInConsole("installing tslint...");
        await libs.exec(`npm i -DE ${registry} tslint`);
        printInConsole("setting tslint.json...");
        await libs.writeFile("tslint.json", config.tslint);
        scripts.tslint = `tslint "${srcDirectory}/**/*.ts" "${srcDirectory}/**/*.tsx"`;
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
        printInConsole("setting UI component usage choice...");
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
        printInConsole("installing babel-cli babel-preset-env...");
        await libs.exec(`npm i -DE ${registry} babel-cli babel-preset-env`);
        printInConsole("setting .babelrc...");
        await libs.writeFile(".babelrc", config.tslint);
        scripts.babel = `babel ${srcDirectory}/`;
        buildScripts.push("npm run babel");
    }

    if (options.some(o => o === eslintChoice)) {
        printInConsole("installing eslint...");
        await libs.exec(`npm i -DE ${registry} eslint`);
        printInConsole("init eslint...");
        await libs.exec("./node_modules/.bin/eslint --init");
        scripts.eslint = `eslint "${srcDirectory}/**/*.js"`;
        lintScripts.push("npm run eslint");
    }

    if (options.some(o => o === standardLintChoice)) {
        printInConsole("installing standard...");
        await libs.exec(`npm i -DE ${registry} standard`);
        scripts.standard = `standard "${srcDirectory}/**/*.js"`;
        lintScripts.push("npm run standard");
    }

    if (options.some(o => o === flowTypeChoice)) {
        printInConsole("installing flow-bin...");
        await libs.exec(`npm i -DE ${registry} flow-bin`);
        scripts.flow = "flow";
        lintScripts.push("npm run flow");
    }

    if (options.some(o => o === lessChoice)) {
        printInConsole("installing less...");
        await libs.exec(`npm i -DE ${registry} less`);
        printInConsole(`setting ${srcDirectory}/${componentShortName}.less...`);
        await libs.writeFile(`${srcDirectory}/${componentShortName}.less`, config.getLessConfig(componentShortName));
        scripts.lessc = `lessc ${srcDirectory}/${componentShortName}.less > ${distDirectory}/${componentShortName}.css`;
        buildScripts.push("npm run lessc");
    }

    if (options.some(o => o === stylelintChoice)) {
        printInConsole("installing stylelint stylelint-config-standard...");
        await libs.exec(`npm i -DE ${registry} stylelint stylelint-config-standard`);
        printInConsole("setting .stylelintrc...");
        await libs.writeFile(".stylelintrc", config.stylelint);
        scripts.stylelint = `stylelint "${srcDirectory}/**/*.less"`;
        lintScripts.push("npm run stylelint");
    }

    if (hasVueChoice) {
        printInConsole("installing vue vue-class-component...");
        await libs.exec(`npm i -DE ${registry} vue vue-class-component`);
    }

    if (hasReactChoice) {
        printInConsole("installing react react-dom...");
        await libs.exec(`npm i -DE ${registry} react react-dom`);
        if (hasTypescript) {
            printInConsole("installing @types/react @types/react-dom...");
            await libs.exec(`npm i -DE ${registry} @types/react @types/react-dom`);
        }
    }

    if (hasAngularChoice) {
        printInConsole("installing @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js...");
        await libs.exec(`npm i -DE ${registry} @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
    }

    const hasVueStarter = options.some(o => o === vueStarterChoice);
    if (hasVueStarter) {
        printInConsole("setting vue starter...");
        await libs.writeFile(`${srcDirectory}/vue.ts`, config.getVueStarter(repositoryName, componentShortName, componentTypeName));
        await libs.writeFile(`${srcDirectory}/vue.template.html`, "<div></div>");
        await libs.mkdir(`${demoDirectory}/vue`);
        await libs.writeFile(`${demoDirectory}/vue/index.ts`, config.getVueStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        await libs.writeFile(`${demoDirectory}/vue/index.ejs.html`, config.getVueStarterDemoHtml(repositoryName));
    }

    const hasReactStarter = options.some(o => o === reactStarterChoice);
    if (hasReactStarter) {
        printInConsole("setting react starter...");
        await libs.writeFile(`${srcDirectory}/react.tsx`, config.getReactStarter(repositoryName, componentShortName, componentTypeName));
        await libs.mkdir(`${demoDirectory}/react`);
        await libs.writeFile(`${demoDirectory}/react/index.tsx`, config.getReactStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        await libs.writeFile(`${demoDirectory}/react/index.ejs.html`, config.getReactStarterDemoHtml(repositoryName));
    }

    const hasAngularStarter = options.some(o => o === angularStarterChoice);
    if (hasAngularStarter) {
        printInConsole("setting angular starter...");
        await libs.writeFile(`${srcDirectory}/angular.ts`, config.getAngularStarter(repositoryName, componentShortName, componentTypeName));
        await libs.writeFile(`${srcDirectory}/angular.template.html`, "<div></div>");
        await libs.mkdir(`${demoDirectory}/angular`);
        await libs.writeFile(`${demoDirectory}/angular/index.ts`, config.getAngularStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
        await libs.writeFile(`${demoDirectory}/angular/index.ejs.html`, config.getAngularStarterDemoHtml(repositoryName));
    }

    const hasVuex = options.some(o => o === vuexChoice);
    if (hasVuex) {
        printInConsole("installing vuex...");
        await libs.exec(`npm i -DE ${registry} vuex`);
    }

    const hasVueRouter = options.some(o => o === vueRouterChoice);
    if (hasVueRouter) {
        printInConsole("installing vue-router...");
        await libs.exec(`npm i -DE ${registry} vue-router`);
    }

    const hasMobx = options.some(o => o === mobxChoice);
    if (hasMobx) {
        printInConsole("installing mobx mobx-react...");
        await libs.exec(`npm i -DE ${registry} mobx mobx-react`);
    }

    const hasReactRouter = options.some(o => o === reactRouterChoice);
    if (hasReactRouter) {
        printInConsole("installing react-router-dom @types/react-router-dom...");
        await libs.exec(`npm i -DE ${registry} react-router-dom @types/react-router-dom`);
    }

    if (options.some(o => o === vueStarterChoice)
        || options.some(o => o === reactStarterChoice)
        || options.some(o => o === angularStarterChoice)) {
        printInConsole("setting starter common.ts...");
        await libs.writeFile(`${srcDirectory}/common.ts`, config.getStarterCommonSource(repositoryName, componentShortName, componentTypeName));
    }

    if (options.some(o => o === cleanCssCliChoice)) {
        printInConsole("installing clean-css-cli...");
        await libs.exec(`npm i -DE ${registry} clean-css-cli`);
        const forkMeOnGithubPart = hasForkMeOnGithubChoice ? " ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css" : "";
        scripts.cleancss = `cleancss -o ${distDirectory}/${componentShortName}.min.css ${distDirectory}/${componentShortName}.css`;
        buildScripts.push("npm run cleancss");
        if (hasUIConponentChoice) {
            scripts["cleancss-demo"] = `cleancss -o ${demoDirectory}/index.bundle.css ${distDirectory}/${componentShortName}.min.css` + forkMeOnGithubPart;
            buildScripts.push("npm run cleancss-demo");
        }
    }

    if (options.some(o => o === htmlMinifierChoice)) {
        printInConsole("installing html-minifier...");
        await libs.exec(`npm i -DE ${registry} html-minifier`);
        scripts["html-minifier"] = `html-minifier --collapse-whitespace --case-sensitive --collapse-inline-tag-whitespace ${srcDirectory}/index.html -o ${distDirectory}/index.html`;
    }

    if (options.some(o => o === rimrafChoice)) {
        printInConsole("installing rimraf...");
        await libs.exec(`npm i -DE ${registry} rimraf`);
        if (hasUIConponentChoice) {
            scripts.clean = `rimraf ${distDirectory}/`;
            buildScripts.unshift("npm run clean");
        }
    }

    if (options.some(o => o === image2base64Choice)) {
        printInConsole("installing image2base64-cli...");
        await libs.exec(`npm i -DE ${registry} image2base64-cli`);
        scripts.image2base64 = `image2base64-cli images/*.png --less ${srcDirectory}/variables.less`;
    }

    if (hasFile2Variable) {
        printInConsole("installing file2variable-cli...");
        await libs.exec(`npm i -DE ${registry} file2variable-cli`);
        const commands: string[] = [];
        if (hasVueStarter) {
            commands.push(`file2variable-cli ${srcDirectory}/vue.template.html -o ${srcDirectory}/vue-variables.ts --html-minify`);
        }
        if (hasAngularStarter) {
            commands.push(`file2variable-cli ${srcDirectory}/angular.template.html -o ${srcDirectory}/angular-variables.ts --html-minify`);
        }
        if (commands.length === 0) {
            commands.push(`file2variable-cli ${srcDirectory}/index.html -o ${srcDirectory}/variables.ts --html-minify`);
        }
        scripts.file2variable = commands.join(" && ");
    }

    if (options.some(o => o === cpyChoice)) {
        printInConsole("installing cpy-cli...");
        await libs.exec(`npm i -DE ${registry} cpy-cli`);
        scripts.cpy = `cpy ${srcDirectory}/index.html ${distDirectory}/`;
    }

    if (options.some(o => o === mkdirpChoice)) {
        printInConsole("installing mkdirp...");
        await libs.exec(`npm i -DE ${registry} mkdirp`);
        scripts.cpy = "mkdirp foo/bar";
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
        const webpackConfig = config.getWebpackConfig(isFrontEndProject);
        await libs.writeFile(`${demoDirectory}/webpack.config.js`, webpackConfig);
        scripts.webpack = `webpack --config ${demoDirectory}/webpack.config.js`;
        buildScripts.push("npm run webpack");
    }

    if (options.some(o => o === revStaticChoice)) {
        printInConsole("installing rev-static...");
        await libs.exec(`npm i -DE ${registry} rev-static`);
        printInConsole("setting rev-static.config.js...");
        await libs.writeFile(`${demoDirectory}/rev-static.config.js`, hasUIConponentChoice ? config.revStaticConfigDemo : config.revStaticConfig);
        scripts["rev-static"] = `rev-static --config ${demoDirectory}/rev-static.config.js`;
        buildScripts.push("npm run rev-static");
        printInConsole("setting index.ejs.html...");
        await libs.writeFile("index.ejs.html", config.getRevStaticHtml(hasForkMeOnGithubChoice, author, repositoryName));
        scripts["clean-rev"] = `rimraf ${demoDirectory}/**/index.bundle-*.js ${demoDirectory}/*.bundle-*.css`;
        buildScripts.unshift("npm run clean-rev");
    }

    if (options.some(o => o === swPrecacheChoice)) {
        printInConsole("installing sw-precache uglify-js...");
        await libs.exec(`npm i -DE ${registry} sw-precache uglify-js`);
        printInConsole("setting sw-precache.config.js...");
        await libs.writeFile("sw-precache.config.js", config.swPrecache);
        scripts["sw-precache"] = "sw-precache --config sw-precache.config.js --verbose && uglifyjs service-worker.js -o service-worker.bundle.js";
        buildScripts.push("npm run sw-precache");
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
