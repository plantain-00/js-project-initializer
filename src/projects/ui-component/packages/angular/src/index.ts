import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ComponentTypeNameComponent } from './index.component'
export * from './index.component'
export * from 'REPOSITORY_NAME'

/**
 * @public
 */
@NgModule({
  declarations: [
    ComponentTypeNameComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComponentTypeNameComponent
  ]
})
export class ComponentTypeNameModule { }
