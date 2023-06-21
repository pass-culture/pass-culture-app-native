import React from 'react'

import { render } from 'tests/utils'

import { OfflinePage } from '../OfflinePage'

describe('<OfflinePage />', () => {
  it('should match snapshot with default message', async () => {
    const maintenancePage = await render(<OfflinePage />)
    expect(maintenancePage).toMatchSnapshot()
  })
})
