import { createApp, defineComponent } from 'vue'
import { ComponentTypeName } from '../dist/'

const App = defineComponent({
  template: `
    <div>
        <a href="https://github.com/AUTHOR/REPSOTIRY_NAME/tree/master/packages/vue/demo" target="_blank">the source code of the demo</a>
        <br/>
        <componentShortName>
        </componentShortName>
    </div>
    `
})

const app = createApp(App)
app.component('componentShortName', ComponentTypeName)
app.mount('#container')
