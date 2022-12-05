import React from 'react'

import { AgeSelectionOther } from 'features/onboarding/pages/AgeSelectionOther'
import { render } from 'tests/utils/web'

describe('AgeSelectionOther', () => {
  it('should render null in web', () => {
    const { container } = render(<AgeSelectionOther />)
    expect(container).toBeEmptyDOMElement()
  })
})
