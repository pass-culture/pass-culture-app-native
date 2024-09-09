import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { OnboardingSubscriptionModal } from './OnboardingSubscriptionModal'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OnboardingSubscriptionModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<OnboardingSubscriptionModal visible dismissModal={jest.fn()} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
