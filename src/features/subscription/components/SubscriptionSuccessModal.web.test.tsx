import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

describe('<SubscriptionSuccessModal />', () => {
  describe('Accessibility', () => {
    it.each(Object.values(SubscriptionTheme))(
      'should not have basic accessibility issues for %s',
      async (theme) => {
        const { container } = render(
          <SubscriptionSuccessModal visible theme={theme} dismissModal={jest.fn()} />
        )

        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      }
    )
  })
})
