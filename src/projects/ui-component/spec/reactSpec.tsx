import React from 'react'
import { COMPONENT_TYPE_NAME } from '../packages/react/dist'

import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  const app = renderer.create(<COMPONENT_TYPE_NAME />)
  const rendered = app.toJSON()
  expect(rendered).toBeTruthy()
  app.unmount()
})
