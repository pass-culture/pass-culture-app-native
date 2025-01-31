import React from 'react'

import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('OnboardingSubscription', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<OnboardingSubscription />)

      await screen.findByText('Choisis des thèmes à suivre')

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
