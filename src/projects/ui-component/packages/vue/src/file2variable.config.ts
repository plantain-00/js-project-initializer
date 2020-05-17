export default {
  base: 'packages/vue/src/',
  files: [
    'packages/vue/src/*.template.html'
  ],
  handler: () => {
    return {
      type: 'vue',
      name: 'COMPONENT_TYPE_NAME',
      path: './index'
    }
  },
  out: 'packages/vue/src/variables.ts'
}
