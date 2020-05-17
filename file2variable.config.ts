export default {
  base: 'src/projects/',
  files: [
    'src/projects/**/*'
  ],
  handler: () => {
    return { type: 'text' }
  },
  out: 'src/variables.ts'
}
