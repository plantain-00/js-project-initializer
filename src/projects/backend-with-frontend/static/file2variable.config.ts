export default {
  base: 'static',
  files: [
    'static/*.template.html'
  ],
  handler: () => {
    return {
      type: 'vue',
      name: 'App',
      path: './index'
    }
  },
  out: 'static/variables.ts'
}
