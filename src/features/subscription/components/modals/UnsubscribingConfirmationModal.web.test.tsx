import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { UnsubscribingConfirmationModal } from './UnsubscribingConfirmationModal'

describe('<UnsubscribingConfirmationModal />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <UnsubscribingConfirmationModal
          visible
          theme={SubscriptionTheme.CINEMA}
          dismissModal={jest.fn()}
          onUnsubscribePress={jest.fn()}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
