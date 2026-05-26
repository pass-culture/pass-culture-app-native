import React from 'react'

import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { checkAccessibilityFor, render, act } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

describe('<ProfileTutorialAgeInformationCredit/>', () => {
  describe('Accessibility', () => {
    describe('with bonification disabled', () => {
      it('should not have basic accessibility issues', async () => {
        setFeatureFlags([])
        const { container } = render(<ProfileTutorialAgeInformationCredit />)

        await act(async () => {
          const results = await checkAccessibilityFor(container)

          expect(results).toHaveNoViolations()
        })
      })
    })

    describe('with bonification enabled', () => {
      it('should not have basic accessibility issues', async () => {
        setFeatureFlags([
          RemoteStoreFeatureFlags.ENABLE_BONIFICATION,
          RemoteStoreFeatureFlags.ENABLE_HANDICAP_BONIFICIATION,
        ])
        const { container } = render(<ProfileTutorialAgeInformationCredit />)

        await act(async () => {
          const results = await checkAccessibilityFor(container)

          expect(results).toHaveNoViolations()
        })
      })
    })
  })
})
