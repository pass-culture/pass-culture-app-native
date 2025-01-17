import React from 'react'
import { act } from 'react-dom/test-utils'

import { ProfileTutorialAgeInformationCreditV3 } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCreditV3'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<ProfileTutorialAgeInformationCreditV3/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      const { container } = render(<ProfileTutorialAgeInformationCreditV3 />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
