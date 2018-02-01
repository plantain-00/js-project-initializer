import { Component, Input } from '@angular/core'
import * as common from 'REPOSITORY_NAME'
import { indexTemplateHtml } from './variables'

/**
 * @public
 */
@Component({
  selector: 'COMPONENT_SHORT_NAME',
  template: indexTemplateHtml
})
export class ComponentTypeNameComponent {
  @Input()
  data: common.ComponentTypeNameData
}
