import React from 'react'

import { OnboardingAuthentication } from 'features/onboarding/pages/OnboardingAuthentication'
import { render } from 'tests/utils/web'

describe('OnboardingAuthentication', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingAuthentication />)
    expect(container).toBeEmptyDOMElement()
  })
})
