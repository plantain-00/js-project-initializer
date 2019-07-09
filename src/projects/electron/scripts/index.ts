import * as electron from 'electron'
import Vue from 'vue'
import Component from 'vue-class-component'
import { scriptsIndexTemplateHtml, scriptsIndexTemplateHtmlStatic } from './variables'

@Component({
  render: scriptsIndexTemplateHtml,
  staticRenderFns: scriptsIndexTemplateHtmlStatic
})
class App extends Vue {
}

new App({ el: '#container' })
