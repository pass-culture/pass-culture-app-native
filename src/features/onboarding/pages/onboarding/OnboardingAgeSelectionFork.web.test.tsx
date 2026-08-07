import React from 'react'

import { OnboardingAgeSelectionFork } from 'features/onboarding/pages/onboarding/OnboardingAgeSelectionFork'
import { render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

describe('OnboardingAgeSelectionFork', () => {
  it('should render null in web', () => {
    const { container } = render(<OnboardingAgeSelectionFork />)

    expect(container).toBeEmptyDOMElement()
  })
})
