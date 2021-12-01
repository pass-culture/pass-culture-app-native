import React from 'react'

import { render } from 'tests/utils'

import { SmartBanner } from '../SmartBanner'

describe('SmartBanner', () => {
  it('should render null on native', () => {
    const smartBanner = render(<SmartBanner />)
    expect(smartBanner.toJSON()).toBeNull()
  })
})
