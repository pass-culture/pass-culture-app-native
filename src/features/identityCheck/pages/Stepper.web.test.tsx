import mockdate from 'mockdate'
import React from 'react'

import { stepsDetailsFixture } from 'features/identityCheck/pages/helpers/stepDetails.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { useSubscriptionSteps } from 'features/identityCheck/pages/helpers/useSubscriptionSteps'
import { DeprecatedIdentityCheckStep, DeprecatedStepConfig } from 'features/identityCheck/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'
import { theme } from 'theme'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { IconInterface } from 'ui/svg/icons/types'

import { IdentityCheckStepper } from './Stepper'

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/api/useNextSubscriptionStep')

jest.mock('features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep', () => ({
  useSetSubscriptionStepAndMethod: jest.fn(() => ({
    subscription: jest.fn(),
  })),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

const icon: React.FC<IconInterface> = () => (
  <BicolorProfile opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)

jest.mock('features/identityCheck/pages/helpers/useSubscriptionSteps')
const mockUseSubscriptionSteps = useSubscriptionSteps as jest.Mock
const mockStepConfig: Partial<DeprecatedStepConfig[]> = [
  {
    name: DeprecatedIdentityCheckStep.IDENTIFICATION,
    label: 'Identification',
    icon: { completed: icon, current: icon, disabled: icon, retry: icon },
    screens: ['UbbleWebview', 'IdentityCheckEnd'],
  },
]
mockUseSubscriptionSteps.mockReturnValue(mockStepConfig)

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

jest.mock('react-query')

jest.mock('features/identityCheck/pages/helpers/useStepperInfo')
const mockUseStepperInfo = useStepperInfo as jest.Mock

mockUseStepperInfo.mockReturnValue({
  stepsDetails: stepsDetailsFixture,
  title: 'Vas-y',
  subtitle: 'Débloque ton crédit',
})

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
