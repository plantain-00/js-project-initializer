import { defineComponent, createApp } from 'vue'
import { indexTemplateHtml } from './variables'

const App = defineComponent({
  render: indexTemplateHtml,
})

const app = createApp(App)
app.mount('#container')
