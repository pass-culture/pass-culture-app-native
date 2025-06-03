import React from 'react'

import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('OnboardingSubscription', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<OnboardingSubscription />))

      await screen.findByText('Choisis des thèmes à suivre')

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
