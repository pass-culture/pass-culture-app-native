import React from 'react'

import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { render } from 'tests/utils/web'

describe('OnboardingWelcome', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingWelcome />)
    expect(container).toBeEmptyDOMElement()
  })
})
