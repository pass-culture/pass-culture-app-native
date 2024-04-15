import React from 'react'

import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

describe('OnboardingSubscription', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<OnboardingSubscription />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
