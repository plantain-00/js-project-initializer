import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { COMPONENT_TYPE_NAMEModule } from '../dist/'
import { MainComponent } from './main.component'

@NgModule({
  imports: [BrowserModule, FormsModule, COMPONENT_TYPE_NAMEModule],
  declarations: [MainComponent],
  bootstrap: [MainComponent]
})
export class MainModule { }
