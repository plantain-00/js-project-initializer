import * as libs from "./libs";
import * as config from "./config";

const typescriptChoice = "1. typescript";
const tslintChoice = "2. tslint";
const npmignoreChoice = "3. .npmignore";
const travisCIChoice = "4. travis CI";
const badgeChoice = "5. badge";
const jasmineChoice = "6. jasmine";
const revStaticChoice = "7. rev-static";
const webpackChoice = "8. webpack";
const taobaoRegistryChoice = "9. taobao registry";
const cliChoice = "10. CLI";
const babelChoice = "11. babel";
const eslintChoice = "12. eslint";
const standardLintChoice = "13. standard lint";
const flowTypeChoice = "14. flow type";
const lessChoice = "15. less";
const stylelintChoice = "16. stylelint";
const vueChoice = "17. vue";
const reactChoice = "18. react";
const angularChoice = "19. angular";
const cleanCssCli = "20. clean-css-cli";
const htmlMinifier = "21. html-minifier";

async function run() {
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
        ],
        choices: [
            typescriptChoice,
            tslintChoice,
            npmignoreChoice,
            travisCIChoice,
            badgeChoice,
            jasmineChoice,
            revStaticChoice,
            webpackChoice,
            taobaoRegistryChoice,
            cliChoice,
            babelChoice,
            eslintChoice,
            standardLintChoice,
            flowTypeChoice,
            lessChoice,
            stylelintChoice,
            vueChoice,
            reactChoice,
            angularChoice,
            cleanCssCli,
            htmlMinifier,
        ],
    });
    const options: string[] = answer["options"];
    const registry = options.find(o => o === taobaoRegistryChoice) ? "--registry=https://registry.npm.taobao.org" : "";

    if (options.find(o => o === typescriptChoice)) {
        console.log("installing typescript...");
        await libs.exec(`npm i -DE ${registry} typescript`);
        console.log("setting tsconfig.json...");
        await libs.writeFile("tsconfig.json", config.tsconfig);
        console.log("setting tssdk...");
        await libs.mkdir(".vscode");
        await libs.writeFile(".vscode/settings.json", config.tssdk);
    }

    if (options.find(o => o === tslintChoice)) {
        console.log("installing tslint...");
        await libs.exec(`npm i -DE ${registry} tslint`);
        console.log("setting tslint.json...");
        await libs.writeFile("tslint.json", config.tslint);
    }

    if (options.find(o => o === npmignoreChoice)) {
        console.log("setting .npmignore...");
        await libs.writeFile(".npmignore", config.npmignore);
    }

    if (options.find(o => o === travisCIChoice)) {
        console.log("setting .travis.yml...");
        await libs.writeFile(".travis.yml", config.travis);
    }

    if (options.find(o => o === badgeChoice)) {
        console.log("setting badges...");
        await libs.appendFile("README.md", config.badge);
    }

    if (options.find(o => o === jasmineChoice)) {
        console.log("installing jasmine...");
        await libs.exec(`npm i -DE ${registry} jasmine @types/jasmine`);
        console.log("init jasmine...");
        await libs.exec("./node_modules/.bin/jasmine init");
    }

    if (options.find(o => o === revStaticChoice)) {
        console.log("installing rev-static...");
        await libs.exec(`npm i -DE ${registry} rev-static`);
        console.log("init rev-static...");
        await libs.exec("./node_modules/.bin/rev-static init");
    }

    if (options.find(o => o === webpackChoice)) {
        console.log("installing webpack...");
        await libs.exec(`npm i -DE ${registry} webpack`);
        console.log("setting webpack.config.js...");
        await libs.writeFile("webpack.config.js", config.webpack);
    }

    if (options.find(o => o === cliChoice)) {
        console.log("setting cli...");
        await libs.mkdir("bin");
        await libs.writeFile("bin/cli-name", config.cli);
    }

    if (options.find(o => o === babelChoice)) {
        console.log("installing babel...");
        await libs.exec(`npm i -DE ${registry} babel-cli babel-preset-env`);
        console.log("setting .babelrc...");
        await libs.writeFile(".babelrc", config.tslint);
    }

    if (options.find(o => o === eslintChoice)) {
        console.log("installing eslint...");
        await libs.exec(`npm i -DE ${registry} eslint`);
        console.log("init eslint...");
        await libs.exec("./node_modules/.bin/eslint --init");
    }

    if (options.find(o => o === standardLintChoice)) {
        console.log("installing standard lint...");
        await libs.exec(`npm i -DE ${registry} standard`);
    }

    if (options.find(o => o === flowTypeChoice)) {
        console.log("installing flow type...");
        await libs.exec(`npm i -DE ${registry} flow-bin`);
    }

    if (options.find(o => o === lessChoice)) {
        console.log("installing less...");
        await libs.exec(`npm i -DE ${registry} less`);
    }

    if (options.find(o => o === stylelintChoice)) {
        console.log("installing stylelint...");
        await libs.exec(`npm i -DE ${registry} stylelint stylelint-config-standard`);
        console.log("setting .stylelintrc...");
        await libs.writeFile(".stylelintrc", config.stylelint);
    }

    if (options.find(o => o === vueChoice)) {
        console.log("installing vue...");
        await libs.exec(`npm i -DE ${registry} vue vue-class-component`);
    }

    if (options.find(o => o === reactChoice)) {
        console.log("installing react...");
        await libs.exec(`npm i -DE ${registry} react react-dom`);
    }

    if (options.find(o => o === angularChoice)) {
        console.log("installing angular...");
        await libs.exec(`npm i -DE ${registry} @angular/common @angular/compiler @angular/core @angular/forms @angular/platform-browser @angular/platform-browser-dynamic core-js rxjs zone.js`);
    }

    if (options.find(o => o === cleanCssCli)) {
        console.log("installing clean-css-cli...");
        await libs.exec(`npm i -DE ${registry} clean-css-cli`);
    }

    if (options.find(o => o === htmlMinifier)) {
        console.log("installing html-minifier...");
        await libs.exec(`npm i -DE ${registry} html-minifier`);
    }

    console.log("success.");
}

try {
    run();
} catch (error) {
    console.log(error);
}
