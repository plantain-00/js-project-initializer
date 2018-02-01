import { Component } from '@angular/core'

import { COMPONENT_TYPE_NAMEData } from '../dist/'

@Component({
  selector: 'app',
  template: `
    <div>
        <a href="https://github.com/AUTHOR/REPOSITORY_NAME/tree/master/packages/angular/demo" target="_blank">the source code of the demo</a>
        <br/>
        <COMPONENT_SHORT_NAME [data]="data">
        </COMPONENT_SHORT_NAME>
    </div>
    `
})
export class MainComponent {
  data: COMPONENT_TYPE_NAME
}
