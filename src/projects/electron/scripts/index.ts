// import * as electron from "electron";
import Vue from 'vue'
import Component from 'vue-class-component'
import { scriptsIndexTemplateHtml, scriptsIndexTemplateHtmlStatic } from './variables'

@Component({
  render: scriptsIndexTemplateHtml,
  staticRenderFns: scriptsIndexTemplateHtmlStatic
})
class App extends Vue {
}

// tslint:disable-next-line:no-unused-expression
new App({ el: '#container' })
