import { Configuration } from 'file2variable-cli'

const config: Configuration = {
  base: 'static',
  files: [
    'static/*.template.html'
  ],
  handler: () => {
    return {
      type: 'vue3',
    }
  },
  out: 'static/variables.ts'
}

export default config
