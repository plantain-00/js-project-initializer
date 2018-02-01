module.exports = {
  base: 'scripts',
  files: [
    'scripts/index.template.html'
  ],
  /**
   * @argument {string} file
   */
  handler: file => {
    return {
      type: 'vue',
      name: 'App',
      path: './index'
    }
  },
  out: 'scripts/variables.ts'
}
