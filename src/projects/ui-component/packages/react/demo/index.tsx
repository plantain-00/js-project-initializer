import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { componentTypeName, componentTypeNameData } from '../dist/'

function Main() {
  const data: componentTypeNameData = {}
  return (
    <div>
      <a href='https://github.com/AUTHOR/REPOSITORY_NAME/tree/master/packages/react/demo' target='_blank'>the source code of the demo</a>
      <br />
      <componentTypeName data={data} />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('container'))
