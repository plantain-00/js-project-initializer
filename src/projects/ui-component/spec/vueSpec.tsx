import { COMPONENT_TYPE_NAME } from '../packages/vue/dist'

import { mount } from 'vue-test-utils'

it('renders without crashing', () => {
  const app = mount(COMPONENT_TYPE_NAME, {
    propsData: {
      data: undefined
    }
  })
  const rendered = app.html()
  expect(rendered).toBeTruthy()
  app.destroy()
})
