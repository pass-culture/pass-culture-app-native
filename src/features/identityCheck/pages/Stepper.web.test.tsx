import mockdate from 'mockdate'
import React from 'react'

import { NextSubscriptionStepResponse } from 'api/gen'
import { stepsDetailsFixture } from 'features/identityCheck/pages/helpers/stepDetails.fixture'
import { useRehydrateProfile } from 'features/identityCheck/pages/helpers/useRehydrateProfile'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { Stepper } from './Stepper'

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

const subscriptionStep: NextSubscriptionStepResponse = {
  allowedIdentityCheckMethods: [],
  hasIdentityCheckPending: false,
  stepperIncludesPhoneValidation: true,
}
jest.mock('features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep', () => ({
  useSetSubscriptionStepAndMethod: jest.fn(() => ({
    subscription: subscriptionStep,
  })),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('features/identityCheck/pages/helpers/useStepperInfo')
const mockUseStepperInfo = useStepperInfo as jest.Mock

mockUseStepperInfo.mockReturnValue({
  stepsDetails: stepsDetailsFixture,
  title: 'Vas-y',
  subtitle: 'Débloque ton crédit',
})

jest.mock('features/identityCheck/pages/helpers/useRehydrateProfile')
const mockUseRehydrateProfile = useRehydrateProfile as jest.Mock
mockUseRehydrateProfile.mockImplementation(jest.fn())

describe('<Stepper/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<Stepper />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
