import * as React from 'react'
import * as common from 'REPOSITORY_NAME'
export * from 'REPOSITORY_NAME'

/**
 * @public
 */
export class ComponentTypeName extends React.Component<{
  data: common.ComponentTypeNameData;
}, {}> {
  render () {
    return (
      <div className='COMPONENT_SHORT_NAME'>
      </div>
    )
  }
}
