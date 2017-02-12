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
        console.log("setting rev-static.config.js...");
        await libs.writeFile("rev-static.config.js", config.revStatic);
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

    console.log("success.");
}

try {
    run();
} catch (error) {
    console.log(error);
}
