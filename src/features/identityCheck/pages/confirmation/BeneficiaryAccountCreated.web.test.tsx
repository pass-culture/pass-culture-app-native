import React from 'react'

import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { BeneficiaryAccountCreated } from './BeneficiaryAccountCreated'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/auth/context/AuthContext')

describe('<BeneficiaryAccountCreated/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      const { container } = render(<BeneficiaryAccountCreated />)

      await screen.findByLabelText('C’est parti !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
