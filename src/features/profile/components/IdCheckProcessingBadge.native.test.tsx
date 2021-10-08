import React from 'react'

import { render } from 'tests/utils'

import { IdCheckProcessingBadge } from './IdCheckProcessingBadge'

describe('IdCheckProcessingBadge', () => {
  it('should display last update sentence if lastUpdated props is passed', () => {
    const component = render(<IdCheckProcessingBadge lastUpdated={`2021-10-25T13:24Z`} />)
    expect(component).toMatchSnapshot()
  })
  it('should not display last update sentence if lastUpdated props is passed', () => {
    const component = render(<IdCheckProcessingBadge />)
    expect(component).toMatchSnapshot()
  })
})
