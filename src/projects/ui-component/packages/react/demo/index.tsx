import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { componentTypeName, componentTypeNameData } from '../dist/'

class Main extends React.Component<{}, {}> {
  private data: componentTypeNameData

  render () {
    return (
      <div>
        <a href='https://github.com/AUTHOR/REPOSITORY_NAME/tree/master/packages/react/demo' target='_blank'>the source code of the demo</a>
        <br />
        <componentTypeName data={this.data}>
        </componentTypeName>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('container'))
