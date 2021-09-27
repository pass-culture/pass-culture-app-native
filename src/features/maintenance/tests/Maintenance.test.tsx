import React from 'react'

import { render } from 'tests/utils'

import { Maintenance } from '../Maintenance'

describe('<Maintenance />', () => {
  it('should match snapshot', async () => {
    const renderForceUpdate = await render(<Maintenance />)
    expect(renderForceUpdate).toMatchSnapshot()
  })
})
