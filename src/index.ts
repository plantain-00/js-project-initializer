import * as libs from "./libs";
import { ProjectKind, Choices, printInConsole } from "./libs";
import * as config from "./config";
import { runUIComponent } from "./uiComponent";

async function selectProjectKind() {
    const projectKindAnswer = await libs.inquirer.prompt({
        type: "list",
        name: "projectKind",
        message: "Which kind of project?",
        choices: [
            ProjectKind.backend,
            ProjectKind.backendWithFrontend,
            ProjectKind.frontend,
            ProjectKind.CLI,
            ProjectKind.library,
            ProjectKind.UIComponent,
        ],
    });
    return projectKindAnswer.projectKind as ProjectKind;
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

    const scripts: { [name: string]: string } = {};

    let author = packageJson.author;
    if (packageJson.repository && packageJson.repository.url) {
        const items = packageJson.repository.url.split("/");
        if (items.length >= 4) {
            author = items[3];
        }
    }

    const kind = await selectProjectKind();

    printInConsole("installing typescript...");
    await libs.exec(`npm i -DE typescript@rc`);

    printInConsole("setting .gitignore...");
    await libs.appendFile(".gitignore", config.gitIgnore);

    printInConsole("setting .travis.yml...");
    await libs.writeFile(".travis.yml", config.travis);

    printInConsole("setting tssdk...");
    await libs.mkdir(".vscode");
    await libs.writeFile(".vscode/settings.json", config.tssdk);

    printInConsole("installing tslint...");
    await libs.exec(`npm i -DE tslint`);
    printInConsole("setting tslint.json...");
    await libs.writeFile("tslint.json", config.tslint);

    printInConsole("setting github issue/pull request template...");
    await libs.mkdir(".github");
    await libs.writeFile(".github/ISSUE_TEMPLATE.md", config.githubIssueTemplate);
    await libs.writeFile(".github/PULL_REQUEST_TEMPLATE.md", config.githubPullRequestTemplate);

    if (kind === ProjectKind.UIComponent) {
        await runUIComponent(scripts, repositoryName, author, componentShortName, componentTypeName);
        return;
    }

    const answer = await libs.inquirer.prompt({
        type: "checkbox",
        name: "options",
        message: "Choose options:",
        default: [
        ],
        choices: [
            Choices.lessChoice,
            Choices.stylelintChoice,
            Choices.cleanCssCliChoice,

            Choices.publishToNpmChoice,

            Choices.forkMeOnGithubChoice,

            Choices.jasmineChoice,

            Choices.webpackChoice,

            Choices.vueChoice,
            Choices.reactChoice,
            Choices.angularChoice,

            Choices.cpyChoice,
            Choices.mkdirpChoice,
            Choices.revStaticChoice,
            Choices.htmlMinifierChoice,
            Choices.image2base64Choice,
            Choices.file2variableChoice,
            Choices.swPrecacheChoice,
            Choices.uglifyjsChoice,
        ],
    });
    const options: Choices[] = answer.options;

    const buildScripts: string[] = [];
    const lintScripts: string[] = [];

    const hasVueChoice = options.some(o => o === Choices.vueChoice);
    const hasReactChoice = options.some(o => o === Choices.reactChoice);
    const hasAngularChoice = options.some(o => o === Choices.angularChoice);
    const hasFile2Variable = options.some(o => o === Choices.file2variableChoice);
    const hasLessChoice = options.some(o => o === Choices.lessChoice);

    const demoDirectory = ".";
    await libs.mkdir(demoDirectory);
    const distDirectory = ".";
    const srcDirectory = (kind === ProjectKind.backendWithFrontend || kind === ProjectKind.CLI) ? "src" : ".";
    await libs.mkdir(srcDirectory);
    const staticDirectory = kind === ProjectKind.backendWithFrontend ? "static" : ".";
    await libs.mkdir(staticDirectory);

    if (hasFile2Variable) {
        buildScripts.push("npm run file2variable");
    }

    if (kind === ProjectKind.backendWithFrontend || kind === ProjectKind.backend) {
        printInConsole("installing @types/node...");
        await libs.exec(`npm i -DE @types/node`);
        printInConsole(`setting ${srcDirectory}/index.ts...`);
        await libs.writeFile(`${srcDirectory}/index.ts`, config.backendConfig);
    }

    printInConsole(`setting ${srcDirectory}/tsconfig.json...`);
    await libs.writeFile(`${srcDirectory}/tsconfig.json`, kind === ProjectKind.CLI ? config.tsconfigCLI : config.tsconfigNodejs);
    scripts.tsc = `tsc -p ${srcDirectory}/`;
    buildScripts.push("npm run tsc");
    if (kind === ProjectKind.frontend || kind === ProjectKind.backendWithFrontend) {
        printInConsole("installing tslib...");
        await libs.exec(`npm i -SE tslib`);
    }

    scripts.tslint = `tslint "${srcDirectory}/**/*.ts" "${srcDirectory}/**/*.tsx"`;
    lintScripts.push("npm run tslint");

    const hasNpm = options.some(o => o === Choices.publishToNpmChoice);
    if (hasNpm) {
        printInConsole("setting .npmignore...");
        await libs.writeFile(".npmignore", config.npmignore);
    }

    printInConsole("setting badges...");
    await libs.prependFile("README.md", config.getBadge(repositoryName, author, hasNpm));

    if (options.some(o => o === Choices.jasmineChoice)) {
        printInConsole("installing jasmine...");
        await libs.exec(`npm i -DE jasmine`);
        printInConsole("installing @types/jasmine...");
        await libs.exec(`npm i -DE @types/jasmine`);
        printInConsole("init jasmine...");
        await libs.exec("./node_modules/.bin/jasmine init");
        printInConsole("setting spec/tsconfig.json...");
        await libs.writeFile("spec/tsconfig.json", config.jasmineTsconfig);
        scripts.test = "tsc -p spec && jasmine";
    }

    const hasForkMeOnGithubChoice = options.some(o => o === Choices.forkMeOnGithubChoice);
    if (hasForkMeOnGithubChoice) {
        printInConsole("installing github-fork-ribbon-css...");
        await libs.exec(`npm i -DE github-fork-ribbon-css`);
    }

    let bin: { [key: string]: string } | undefined;
    if (kind === ProjectKind.CLI) {
        printInConsole("setting cli...");
        await libs.mkdir("bin");
        await libs.writeFile(`bin/${repositoryName}`, config.cli);
        bin = {
            [repositoryName]: `bin/${repositoryName}`,
        };
        await libs.writeFile(`${srcDirectory}/index.ts`, config.cliSource);
    }

    if (hasLessChoice) {
        printInConsole("installing less...");
        await libs.exec(`npm i -DE less`);
        if (kind === ProjectKind.backendWithFrontend) {
            printInConsole(`setting ${staticDirectory}/${componentShortName}.less...`);
            await libs.writeFile(`${staticDirectory}/${componentShortName}.less`, config.getLessConfig(componentShortName));
            scripts.lessc = `lessc ${staticDirectory}/${componentShortName}.less > ${staticDirectory}/${componentShortName}.css`;
        } else {
            printInConsole(`setting ${srcDirectory}/${componentShortName}.less...`);
            await libs.writeFile(`${srcDirectory}/${componentShortName}.less`, config.getLessConfig(componentShortName));
            scripts.lessc = `lessc ${srcDirectory}/${componentShortName}.less > ${distDirectory}/${componentShortName}.css`;
        }
        buildScripts.push("npm run lessc");
    }

    if (options.some(o => o === Choices.stylelintChoice)) {
        printInConsole("installing stylelint stylelint-config-standard...");
        await libs.exec(`npm i -DE stylelint stylelint-config-standard`);
        printInConsole("setting .stylelintrc...");
        await libs.writeFile(".stylelintrc", config.stylelint);
        scripts.stylelint = `stylelint "${srcDirectory}/**/*.less"`;
        lintScripts.push("npm run stylelint");
    }

    if (hasVueChoice) {
        printInConsole("installing vue vue-class-component...");
        await libs.exec(`npm i -DE vue vue-class-component`);
    }

    if (hasReactChoice) {
        printInConsole("installing react react-dom...");
        await libs.exec(`npm i -DE react react-dom`);
        printInConsole("installing @types/react @types/react-dom...");
        await libs.exec(`npm i -DE @types/react @types/react-dom`);
    }

    if (hasAngularChoice) {
        printInConsole("installing @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js...");
        await libs.exec(`npm i -DE @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
    }

    if (options.some(o => o === Choices.cleanCssCliChoice)) {
        printInConsole("installing clean-css-cli...");
        await libs.exec(`npm i -DE clean-css-cli`);
        // const forkMeOnGithubPart = hasForkMeOnGithubChoice ? " ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css" : "";
        scripts.cleancss = `cleancss -o ${distDirectory}/${componentShortName}.min.css ${distDirectory}/${componentShortName}.css`;
        buildScripts.push("npm run cleancss");
    }

    if (options.some(o => o === Choices.htmlMinifierChoice)) {
        printInConsole("installing html-minifier...");
        await libs.exec(`npm i -DE html-minifier`);
        scripts["html-minifier"] = `html-minifier --collapse-whitespace --case-sensitive --collapse-inline-tag-whitespace ${srcDirectory}/index.html -o ${distDirectory}/index.html`;
    }

    printInConsole("installing rimraf...");
    await libs.exec(`npm i -DE rimraf`);

    if (options.some(o => o === Choices.image2base64Choice)) {
        printInConsole("installing image2base64-cli...");
        await libs.exec(`npm i -DE image2base64-cli`);
        scripts.image2base64 = `image2base64-cli images/*.png --less ${srcDirectory}/variables.less`;
    }

    if (hasFile2Variable) {
        printInConsole("installing file2variable-cli...");
        await libs.exec(`npm i -DE file2variable-cli`);
        const commands: string[] = [];
        if (commands.length === 0) {
            commands.push(`file2variable-cli ${srcDirectory}/index.html -o ${srcDirectory}/variables.ts --html-minify`);
        }
        scripts.file2variable = commands.join(" && ");
    }

    if (options.some(o => o === Choices.cpyChoice)) {
        printInConsole("installing cpy-cli...");
        await libs.exec(`npm i -DE cpy-cli`);
        scripts.cpy = `cpy ${srcDirectory}/index.html ${distDirectory}/`;
    }

    if (options.some(o => o === Choices.mkdirpChoice)) {
        printInConsole("installing mkdirp...");
        await libs.exec(`npm i -DE mkdirp`);
        scripts.cpy = "mkdirp foo/bar";
    }

    if (options.some(o => o === Choices.uglifyjsChoice)) {
        printInConsole("installing uglify-js...");
        await libs.exec(`npm i -DE uglify-js`);
        scripts.uglifyjs = "uglifyjs index.js -o index.min.js";
    }

    if (options.some(o => o === Choices.webpackChoice)) {
        printInConsole("installing webpack...");
        await libs.exec(`npm i -DE webpack`);
        printInConsole("setting webpack.config.js...");
        const webpackConfig = config.getWebpackConfig(kind, hasVueChoice, hasReactChoice, hasAngularChoice);
        await libs.writeFile(`${demoDirectory}/webpack.config.js`, webpackConfig);
        scripts.webpack = `webpack --config ${demoDirectory}/webpack.config.js`;
        buildScripts.push("npm run webpack");
    }

    if (options.some(o => o === Choices.revStaticChoice)) {
        printInConsole("installing rev-static...");
        await libs.exec(`npm i -DE rev-static`);
        printInConsole("setting rev-static.config.js...");
        await libs.writeFile(`${demoDirectory}/rev-static.config.js`, config.revStaticConfig);
        scripts["rev-static"] = `rev-static --config ${demoDirectory}/rev-static.config.js`;
        buildScripts.push("npm run rev-static");
        printInConsole("setting index.ejs.html...");
        await libs.writeFile("index.ejs.html", config.getRevStaticHtml(hasForkMeOnGithubChoice, author, repositoryName));
        scripts["clean-rev"] = `rimraf ${demoDirectory}/**/index.bundle-*.js ${demoDirectory}/*.bundle-*.css`;
        buildScripts.unshift("npm run clean-rev");
    }

    if (options.some(o => o === Choices.swPrecacheChoice)) {
        printInConsole("installing sw-precache uglify-js...");
        await libs.exec(`npm i -DE sw-precache uglify-js`);
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
