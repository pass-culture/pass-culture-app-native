import mockdate from 'mockdate'
import React from 'react'

import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'
import { theme } from 'theme'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { IconInterface } from 'ui/svg/icons/types'

import { IdentityCheckStepper } from './Stepper'

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/signup/useNextSubscriptionStep')

jest.mock('features/identityCheck/useSetCurrentSubscriptionStep', () => ({
  useSetSubscriptionStepAndMethod: jest.fn(() => ({
    subscription: jest.fn(),
  })),
}))

jest.mock('features/auth/AuthContext')

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

const icon: React.FC<IconInterface> = () => (
  <BicolorProfile opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
jest.mock('features/identityCheck/useSubscriptionSteps', () => ({
  useSubscriptionSteps: jest.fn(() => [
    {
      name: 'IdentityCheckStep.IDENTIFICATION',
      label: 'Identification',
      icon: icon,
      screens: ['IdentityCheckStart', 'UbbleWebview', 'IdentityCheckEnd'],
    },
  ]),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

jest.mock('react-query')

describe('<IdentityCheckStepper/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      const { container } = render(reactQueryProviderHOC(<IdentityCheckStepper />))
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
