import Vue from 'vue'
import Component from 'vue-class-component'
import '../dist/'
import { componentTypeNameData } from '../dist/'

@Component({
  template: `
    <div>
        <a href="https://github.com/AUTHOR/REPSOTIRY_NAME/tree/master/packages/vue/demo" target="_blank">the source code of the demo</a>
        <br/>
        <componentShortName :data="data">
        </componentShortName>
    </div>
    `
})
class App extends Vue {
  data!: componentTypeNameData
}

new App({ el: '#container' })
