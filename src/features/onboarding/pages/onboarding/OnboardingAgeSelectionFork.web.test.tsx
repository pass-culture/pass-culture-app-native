import React from 'react'

import { OnboardingAgeSelectionFork } from 'features/onboarding/pages/onboarding/OnboardingAgeSelectionFork'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

describe('OnboardingAgeSelectionFork', () => {
  it('should not have basic accessibility', async () => {
    const { container } = render(<OnboardingAgeSelectionFork />)

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
