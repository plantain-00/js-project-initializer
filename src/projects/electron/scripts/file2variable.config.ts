import { Configuration } from 'file2variable-cli'

const config: Configuration = {
  base: 'scripts',
  files: [
    'scripts/index.template.html'
  ],
  handler: () => {
    return {
      type: 'vue3',
    }
  },
  out: 'scripts/variables.ts'
}

export default config
