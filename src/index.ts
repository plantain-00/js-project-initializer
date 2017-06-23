import * as libs from "./libs";
import { ProjectKind, Choices } from "./libs";
import * as config from "./config";

function printInConsole(message: string) {
    // tslint:disable-next-line:no-console
    console.log(message);
}

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

    const scripts: { [name: string]: string } = packageJson.scripts;

    let author = packageJson.author;
    if (packageJson.repository && packageJson.repository.url) {
        const items = packageJson.repository.url.split("/");
        if (items.length >= 4) {
            author = items[3];
        }
    }

    const kind = await selectProjectKind();

    const answer = await libs.inquirer.prompt({
        type: "checkbox",
        name: "options",
        message: "Choose options:",
        default: [
            Choices.badgeChoice,
            Choices.rimrafChoice,
        ],
        choices: [
            Choices.lessChoice,
            Choices.stylelintChoice,
            Choices.cleanCssCliChoice,

            Choices.publishToNpmChoice,

            Choices.badgeChoice,
            Choices.forkMeOnGithubChoice,

            Choices.jasmineChoice,

            Choices.webpackChoice,

            Choices.vueChoice,
            Choices.reactChoice,
            Choices.angularChoice,

            Choices.rimrafChoice,
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

    const demoDirectory = kind === ProjectKind.UIComponent ? "demo" : ".";
    await libs.mkdir(demoDirectory);
    const distDirectory = kind === ProjectKind.UIComponent ? "dist" : ".";
    const srcDirectory = (kind === ProjectKind.UIComponent || kind === ProjectKind.backendWithFrontend || kind === ProjectKind.CLI) ? "src" : ".";
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

    printInConsole("installing typescript...");
    await libs.exec(`npm i -DE typescript@rc`);
    printInConsole(`setting ${srcDirectory}/tsconfig.json...`);
    await libs.writeFile(`${srcDirectory}/tsconfig.json`, kind === ProjectKind.UIComponent
        ? config.tsconfigFrontEnd
        : (kind === ProjectKind.CLI ? config.tsconfigCLI : config.tsconfigNodejs));
    printInConsole("setting tssdk...");
    await libs.mkdir(".vscode");
    await libs.writeFile(".vscode/settings.json", config.tssdk);
    scripts.tsc = kind === ProjectKind.UIComponent ? `tsc -p ${srcDirectory}/ && tsc -p ${demoDirectory}/` : `tsc -p ${srcDirectory}/`;
    buildScripts.push("npm run tsc");
    if (kind === ProjectKind.UIComponent) {
        await libs.writeFile(`${demoDirectory}/tsconfig.json`, config.tsconfigDemo);
    }
    if (kind === ProjectKind.UIComponent || kind === ProjectKind.frontend || kind === ProjectKind.backendWithFrontend) {
        printInConsole("installing tslib...");
        await libs.exec(`npm i -SE tslib`);
    }

    printInConsole("installing tslint...");
    await libs.exec(`npm i -DE tslint`);
    printInConsole("setting tslint.json...");
    await libs.writeFile("tslint.json", config.tslint);
    scripts.tslint = `tslint "${srcDirectory}/**/*.ts" "${srcDirectory}/**/*.tsx"`;
    lintScripts.push("npm run tslint");

    const hasNpm = options.some(o => o === Choices.publishToNpmChoice);
    if (hasNpm) {
        printInConsole("setting .npmignore...");
        await libs.writeFile(".npmignore", config.npmignore);
    }

    printInConsole("setting .gitignore...");
    await libs.appendFile(".gitignore", config.gitIgnore);

    printInConsole("setting .travis.yml...");
    await libs.writeFile(".travis.yml", config.travis);

    if (options.some(o => o === Choices.badgeChoice)) {
        printInConsole("setting badges...");
        await libs.appendFile("README.md", config.getBadge(repositoryName, author, hasTravis, hasNpm));
    }

    if (kind === ProjectKind.UIComponent) {
        printInConsole("setting UI component usage choice...");
        await libs.appendFile("README.md", config.getUIComponentUsage(author, repositoryName, componentShortName, componentTypeName, hasVueChoice, hasReactChoice, hasAngularChoice));
    }

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
        if (kind === ProjectKind.UIComponent) {
            printInConsole(`setting ${srcDirectory}/vue.ts`);
            await libs.writeFile(`${srcDirectory}/vue.ts`, config.getVueStarter(repositoryName, componentShortName, componentTypeName));
            printInConsole(`setting ${srcDirectory}/vue.template.html`);
            await libs.writeFile(`${srcDirectory}/vue.template.html`, "<div></div>");
            await libs.mkdir(`${demoDirectory}/vue`);
            printInConsole(`setting ${demoDirectory}/vue/index.ts`);
            await libs.writeFile(`${demoDirectory}/vue/index.ts`, config.getVueStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
            printInConsole(`setting ${demoDirectory}/vue/index.ejs.html`);
            await libs.writeFile(`${demoDirectory}/vue/index.ejs.html`, config.getVueStarterDemoHtml(repositoryName));
        }
    }

    if (hasReactChoice) {
        printInConsole("installing react react-dom...");
        await libs.exec(`npm i -DE react react-dom`);
        printInConsole("installing @types/react @types/react-dom...");
        await libs.exec(`npm i -DE @types/react @types/react-dom`);
        if (kind === ProjectKind.UIComponent) {
            printInConsole(`setting ${srcDirectory}/react.tsx`);
            await libs.writeFile(`${srcDirectory}/react.tsx`, config.getReactStarter(repositoryName, componentShortName, componentTypeName));
            await libs.mkdir(`${demoDirectory}/react`);
            printInConsole(`setting ${demoDirectory}/react/index.tsx`);
            await libs.writeFile(`${demoDirectory}/react/index.tsx`, config.getReactStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
            printInConsole(`setting ${demoDirectory}/react/index.ejs.html`);
            await libs.writeFile(`${demoDirectory}/react/index.ejs.html`, config.getReactStarterDemoHtml(repositoryName));
        }
    }

    if (hasAngularChoice) {
        printInConsole("installing @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js...");
        await libs.exec(`npm i -DE @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
        if (kind === ProjectKind.UIComponent) {
            printInConsole(`setting ${srcDirectory}/angular.ts`);
            await libs.writeFile(`${srcDirectory}/angular.ts`, config.getAngularStarter(repositoryName, componentShortName, componentTypeName));
            printInConsole(`setting ${srcDirectory}/angular.template.html`);
            await libs.writeFile(`${srcDirectory}/angular.template.html`, "<div></div>");
            await libs.mkdir(`${demoDirectory}/angular`);
            printInConsole(`setting ${demoDirectory}/angular/index.ts`);
            await libs.writeFile(`${demoDirectory}/angular/index.ts`, config.getAngularStarterDemoSource(author, repositoryName, componentShortName, componentTypeName));
            printInConsole(`setting ${demoDirectory}/angular/index.ejs.html`);
            await libs.writeFile(`${demoDirectory}/angular/index.ejs.html`, config.getAngularStarterDemoHtml(repositoryName));
        }
    }

    if (kind === ProjectKind.UIComponent) {
        printInConsole("setting starter common.ts...");
        await libs.writeFile(`${srcDirectory}/common.ts`, config.getStarterCommonSource(repositoryName, componentShortName, componentTypeName));
    }

    if (options.some(o => o === Choices.cleanCssCliChoice)) {
        printInConsole("installing clean-css-cli...");
        await libs.exec(`npm i -DE clean-css-cli`);
        const forkMeOnGithubPart = hasForkMeOnGithubChoice ? " ./node_modules/github-fork-ribbon-css/gh-fork-ribbon.css" : "";
        scripts.cleancss = `cleancss -o ${distDirectory}/${componentShortName}.min.css ${distDirectory}/${componentShortName}.css`;
        buildScripts.push("npm run cleancss");
        if (kind === ProjectKind.UIComponent) {
            scripts["cleancss-demo"] = `cleancss -o ${demoDirectory}/index.bundle.css ${distDirectory}/${componentShortName}.min.css` + forkMeOnGithubPart;
            buildScripts.push("npm run cleancss-demo");
        }
    }

    if (options.some(o => o === Choices.htmlMinifierChoice)) {
        printInConsole("installing html-minifier...");
        await libs.exec(`npm i -DE html-minifier`);
        scripts["html-minifier"] = `html-minifier --collapse-whitespace --case-sensitive --collapse-inline-tag-whitespace ${srcDirectory}/index.html -o ${distDirectory}/index.html`;
    }

    if (options.some(o => o === Choices.rimrafChoice)) {
        printInConsole("installing rimraf...");
        await libs.exec(`npm i -DE rimraf`);
        if (kind === ProjectKind.UIComponent) {
            scripts.clean = `rimraf ${distDirectory}/`;
            buildScripts.unshift("npm run clean");
        }
    }

    if (options.some(o => o === Choices.image2base64Choice)) {
        printInConsole("installing image2base64-cli...");
        await libs.exec(`npm i -DE image2base64-cli`);
        scripts.image2base64 = `image2base64-cli images/*.png --less ${srcDirectory}/variables.less`;
    }

    if (hasFile2Variable) {
        printInConsole("installing file2variable-cli...");
        await libs.exec(`npm i -DE file2variable-cli`);
        const commands: string[] = [];
        if (kind === ProjectKind.UIComponent && hasVueChoice) {
            commands.push(`file2variable-cli ${srcDirectory}/vue.template.html -o ${srcDirectory}/vue-variables.ts --html-minify`);
        }
        if (kind === ProjectKind.UIComponent && hasAngularChoice) {
            commands.push(`file2variable-cli ${srcDirectory}/angular.template.html -o ${srcDirectory}/angular-variables.ts --html-minify`);
        }
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

    printInConsole("setting github issue/pull request template...");
    await libs.mkdir(".github");
    await libs.writeFile(".github/ISSUE_TEMPLATE.md", config.githubIssueTemplate);
    await libs.writeFile(".github/PULL_REQUEST_TEMPLATE.md", config.githubPullRequestTemplate);

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
        await libs.writeFile(`${demoDirectory}/rev-static.config.js`, kind === ProjectKind.UIComponent ? config.revStaticConfigDemo : config.revStaticConfig);
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
