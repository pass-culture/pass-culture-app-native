import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { UnsubscribingConfirmationModal } from './UnsubscribingConfirmationModal'

describe('<UnsubscribingConfirmationModal />', () => {
  describe('Accessibility', () => {
    it.each(Object.values(SubscriptionTheme))(
      'should not have basic accessibility issues for %s',
      async (theme) => {
        const { container } = render(
          <UnsubscribingConfirmationModal visible theme={theme} dismissModal={jest.fn()} />
        )

        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      }
    )
  })
})
