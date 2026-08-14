import React from 'react'

import { SUSBCRIPTION_THEMES } from 'features/subscription/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SubscriptionSuccessModal } from './SubscriptionSuccessModal'

describe('<SubscriptionSuccessModal />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it.each(SUSBCRIPTION_THEMES)(
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
