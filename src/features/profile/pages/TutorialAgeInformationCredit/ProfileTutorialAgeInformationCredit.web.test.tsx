import React from 'react'
import { act } from 'react-dom/test-utils'

import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

describe('<ProfileTutorialAgeInformationCredit/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      const { container } = render(<ProfileTutorialAgeInformationCredit />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
