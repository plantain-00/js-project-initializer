import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { componentTypeName } from '../dist/'

function Main() {
  return (
    <div>
      <a href='https://github.com/AUTHOR/REPOSITORY_NAME/tree/master/packages/react/demo' target='_blank'>the source code of the demo</a>
      <br />
      <componentTypeName />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('container'))
