export const tsconfig = `{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "noImplicitAny": true,
        "sourceMap": true,
        "noUnusedLocals": true,
        "noImplicitThis": true,
        "strictNullChecks": true,
        "noImplicitReturns": true,
        "skipLibCheck": true,
        "importHelpers": true,
        "jsx": "react",
        "outDir": "./dist",
        "declaration": true,
        "experimentalDecorators": true
    }
}`;

export const tssdk = `{
    "typescript.tsdk": "./node_modules/typescript/lib"
}`;

export const tslint = `{
    "extends": "tslint:latest",
    "rules": {
        "forin": false,
        "interface-name": [
            false
        ],
        "max-line-length": [
            false
        ],
        "no-var-requires": false,
        "no-console": [
            false
        ],
        "no-string-literal": false,
        "no-reference": false,
        "ordered-imports": [
            false
        ],
        "object-literal-sort-keys": false,
        "variable-name": [
            true,
            "ban-keywords"
        ],
        "no-bitwise": false,
        "member-access": false,
        "arrow-parens": false,
        "array-type": [
            true,
            "array"
        ],
        "max-classes-per-file": [
            false
        ],
        "interface-over-type-literal": false
    }
}`;

export const npmignore = `.vscode
tslint.json
.travis.yml
tsconfig.json
webpack.config.js`;
