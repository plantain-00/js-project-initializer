import Vue from 'vue'
import Component from 'vue-class-component'
import * as common from 'REPOSITORY_NAME'
export * from 'REPOSITORY_NAME'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic,
  props: ['data']
})
class ComponentTypeName extends Vue {
  data: common.componentTypeNameData
}

Vue.component('COMPONENT_SHORT_NAME', ComponentTypeName)
