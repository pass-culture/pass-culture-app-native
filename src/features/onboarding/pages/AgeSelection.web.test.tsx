import React from 'react'

import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { render } from 'tests/utils/web'

describe('AgeSelection', () => {
  it('should render null in web', () => {
    const { container } = render(<AgeSelection />)
    expect(container).toBeEmptyDOMElement()
  })
})
