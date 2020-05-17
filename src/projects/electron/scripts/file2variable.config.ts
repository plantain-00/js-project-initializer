export default {
  base: 'scripts',
  files: [
    'scripts/index.template.html'
  ],
  handler: () => {
    return {
      type: 'vue',
      name: 'App',
      path: './index'
    }
  },
  out: 'scripts/variables.ts'
}
