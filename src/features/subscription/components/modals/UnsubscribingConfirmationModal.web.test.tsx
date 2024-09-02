import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { UnsubscribingConfirmationModal } from './UnsubscribingConfirmationModal'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
