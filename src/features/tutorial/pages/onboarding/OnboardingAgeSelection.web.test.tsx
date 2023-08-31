import React from 'react'

import { OnboardingAgeSelection } from 'features/tutorial/pages/onboarding/OnboardingAgeSelection'
import { render } from 'tests/utils/web'

describe('OnboardingAgeSelection', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingAgeSelection />)
    expect(container).toBeEmptyDOMElement()
  })
})
