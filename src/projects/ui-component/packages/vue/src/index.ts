import Vue from 'vue'
import Component from 'vue-class-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic,
  props: []
})
export class ComponentTypeName extends Vue {
}

Vue.component('COMPONENT_SHORT_NAME', ComponentTypeName)
