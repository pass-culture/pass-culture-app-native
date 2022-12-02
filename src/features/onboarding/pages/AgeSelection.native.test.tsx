import React from 'react'

import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { render } from 'tests/utils'

describe('AgeSelection', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AgeSelection />)
    expect(renderAPI).toMatchSnapshot()
  })
})
