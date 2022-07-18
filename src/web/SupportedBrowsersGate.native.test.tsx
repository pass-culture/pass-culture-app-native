import React from 'react'

import { render } from 'tests/utils'
import { SupportedBrowsersGate } from 'web/SupportedBrowsersGate'

describe('SupportedBrowsersGate', () => {
  it('render correctly', () => {
    const renderAPI = render(<SupportedBrowsersGate />)
    expect(renderAPI).toMatchSnapshot()
  })
})
