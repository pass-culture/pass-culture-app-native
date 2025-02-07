import React from 'react'

import { OnboardingNonEligible } from 'features/tutorial/pages/onboarding/OnboardingNonEligible'
import { render } from 'tests/utils/web'

describe('OnboardingNonEligible', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingNonEligible />)

    expect(container).toBeEmptyDOMElement()
  })
})
