import React from 'react'

import { render } from 'tests/utils'

import { Maintenance } from '../Maintenance'

describe('<Maintenance />', () => {
  it('should match snapshot with default message', async () => {
    const maintenancePage = await render(<Maintenance />)
    expect(maintenancePage).toMatchSnapshot()
  })

  it('should match snapshot with custom message', async () => {
    const maintenancePage = await render(
      <Maintenance message="C'est tout cassé\u00a0! Reviens plus tard" />
    )
    expect(maintenancePage).toMatchSnapshot()
  })
})
