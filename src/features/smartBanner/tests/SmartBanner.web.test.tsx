import React from 'react'

import { render } from 'tests/utils/web'

import { SmartBanner } from '../SmartBanner'

describe('SmartBanner page', () => {
  it('should render a smart banner', () => {
    const smartBanner = render(<SmartBanner />)
    expect(smartBanner.container.firstChild).not.toBeNull()
  })
})
