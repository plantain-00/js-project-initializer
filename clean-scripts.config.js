module.exports = {
  build: [
    'rimraf dist/',
    'tsc -p src'
  ],
  lint: [
    `tslint "src/**/*.ts" "src/**/*.tsx"`,
    `standard "**/*.config.js"`
  ],
  test: [
    'tsc -p spec',
    'jasmine'
  ],
  fix: [
    `standard --fix "**/*.config.js"`
  ],
  release: [
    `clean-release`
  ]
}
