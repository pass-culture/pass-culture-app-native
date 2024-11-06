import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { OnboardingSubscriptionModal } from './OnboardingSubscriptionModal'

describe('<OnboardingSubscriptionModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<OnboardingSubscriptionModal visible dismissModal={jest.fn()} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
