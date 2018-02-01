module.exports = {
  base: 'src/projects/',
  files: [
    'src/projects/**/*'
  ],
  /**
   * @argument {string} file
   */
  handler: file => {
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}
