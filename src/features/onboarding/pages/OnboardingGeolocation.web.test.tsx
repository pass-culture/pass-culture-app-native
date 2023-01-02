import React from 'react'

import { OnboardingGeolocation } from 'features/onboarding/pages/OnboardingGeolocation'
import { render } from 'tests/utils/web'

describe('OnboardingGeolocation', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingGeolocation />)
    expect(container).toBeEmptyDOMElement()
  })
})
