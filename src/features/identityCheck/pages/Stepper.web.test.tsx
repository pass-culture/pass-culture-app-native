import mockdate from 'mockdate'
import React from 'react'

import { stepsDetailsFixture } from 'features/identityCheck/pages/helpers/stepDetails.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { Stepper } from './Stepper'

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep', () => ({
  useSetSubscriptionStepAndMethod: jest.fn(() => ({
    subscription: jest.fn(),
  })),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

jest.mock('react-query')

jest.mock('features/identityCheck/pages/helpers/useStepperInfo')
const mockUseStepperInfo = useStepperInfo as jest.Mock

mockUseStepperInfo.mockReturnValue({
  stepsDetails: stepsDetailsFixture,
  title: 'Vas-y',
  subtitle: 'Débloque ton crédit',
})

describe('<Stepper/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<Stepper />))
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
