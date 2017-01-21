import * as libs from "./libs";
import * as config from "./config";

const typescriptChoice = "typescript";
const tslintChoice = "tslint";
const npmignoreChoice = ".npmignore";
const travisCIChoice = "travis CI";
const badgeChoice = "badge";
const jasimineChoice = "jasimine";
const revStaticChoice = "rev-static";
const webpackChoice = "webpack";
const taobaoRegistryChoice = "taobao registry";
const cliChoice = "CLI";

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
            jasimineChoice,
            taobaoRegistryChoice,
        ],
        choices: [
            typescriptChoice,
            tslintChoice,
            npmignoreChoice,
            travisCIChoice,
            badgeChoice,
            jasimineChoice,
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

    console.log("success.");
}

try {
    run();
} catch (error) {
    console.log(error);
}
