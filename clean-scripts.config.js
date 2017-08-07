module.exports = {
  build: [
    'rimraf dist/',
    'tsc -p src'
  ],
  lint: {
    ts: `tslint "src/**/*.ts" "src/**/*.tsx"`,
    js: `standard "**/*.config.js"`
  },
  test: [
    'tsc -p spec',
    'jasmine'
  ],
  fix: `standard --fix "**/*.config.js"`,
  release: `clean-release`
}
