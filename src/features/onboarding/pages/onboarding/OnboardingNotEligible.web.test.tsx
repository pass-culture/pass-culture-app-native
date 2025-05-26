import React from 'react'

import { OnboardingNotEligible } from 'features/onboarding/pages/onboarding/OnboardingNotEligible'
import { render } from 'tests/utils/web'

describe('OnboardingNotEligible', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingNotEligible />)

    expect(container).toBeEmptyDOMElement()
  })
})
