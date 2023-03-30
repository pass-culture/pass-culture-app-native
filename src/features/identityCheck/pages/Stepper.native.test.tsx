import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionStep, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/fixtures/nextSubscriptionStepFixture'
import { stepsDetailsFixture } from 'features/identityCheck/pages/helpers/stepDetails.fixture'
import { SubscriptionStepperResponseFixture as mockSubscriptionStepper } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { useSubscriptionSteps } from 'features/identityCheck/pages/helpers/useSubscriptionSteps'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import {
  DeprecatedIdentityCheckStep,
  IdentityCheckStep,
  StepButtonState,
  DeprecatedStepConfig,
} from 'features/identityCheck/types'
import { amplitude } from 'libs/amplitude'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, waitFor, screen } from 'tests/utils'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'

let mockNextSubscriptionStep = mockStep
const mockIdentityCheckDispatch = jest.fn()

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/identityCheck/api/useGetStepperInfo', () => ({
  useGetStepperInfo: jest.fn(() => ({
    stepToComplete: mockUseGetStepperInfo,
  })),
}))

const mockUseGetStepperInfo = (useGetStepperInfo as jest.Mock).mockReturnValue({
  stepToComplete: mockSubscriptionStepper.subscriptionStepsToDisplay,
})

jest.mock('features/auth/api/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

jest.mock('features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep', () => ({
  useSetSubscriptionStepAndMethod: jest.fn(() => ({
    subscription: mockNextSubscriptionStep,
  })),
}))

let mockUserProfileData: Partial<UserProfileResponse> = {
  email: 'christophe.dupont@example.com',
  firstName: 'Christophe',
  lastName: 'Dupont',
  domainsCredit: { all: { initial: 3000, remaining: 3000 } },
}

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
const mockedUseSubscriptionContext = useSubscriptionContext as jest.Mock
mockedUseSubscriptionContext.mockReturnValue({
  dispatch: mockIdentityCheckDispatch,
  step: null,
  identification: { method: null },
})

jest.mock('features/identityCheck/pages/helpers/useSubscriptionSteps')
const mockUseSubscriptionSteps = useSubscriptionSteps as jest.Mock
const mockStepConfig: Partial<DeprecatedStepConfig[]> = [
  {
    name: DeprecatedIdentityCheckStep.PHONE_VALIDATION,
    label: 'Numéro de téléphone',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
      retry: BicolorProfile,
    },
    screens: [],
  },
  {
    name: DeprecatedIdentityCheckStep.IDENTIFICATION,
    label: 'Identification',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
      retry: BicolorProfile,
    },
    screens: [],
  },
  {
    name: DeprecatedIdentityCheckStep.PROFILE,
    label: 'Profil',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
      retry: BicolorProfile,
    },
    screens: [],
  },
  {
    name: DeprecatedIdentityCheckStep.CONFIRMATION,
    label: 'Confirmation',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
      retry: BicolorProfile,
    },
    screens: [],
  },
]
mockUseSubscriptionSteps.mockReturnValue(mockStepConfig)

jest.mock('features/identityCheck/pages/helpers/useStepperInfo')
const mockUseStepperInfo = useStepperInfo as jest.Mock

mockUseStepperInfo.mockReturnValue(stepsDetailsFixture)

jest.mock('react-query')

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

describe('Stepper navigation', () => {
  it('should render correctly', () => {
    // the stepper will have the following steps :
    // profile = completed, identification = current, phone_validation = disabled, confirmation = disabled
    mockedUseSubscriptionContext.mockReturnValueOnce({
      dispatch: mockIdentityCheckDispatch,
      step: DeprecatedIdentityCheckStep.IDENTIFICATION,
      identification: { method: null },
    })
    render(<IdentityCheckStepper />)
    expect(screen).toMatchSnapshot()
  })

  it('should stay on stepper when next_step is null and initialCredit is not between 0 and 300 euros', async () => {
    mockNextSubscriptionStep = {
      ...mockStep,
      nextSubscriptionStep: null,
    }
    mockUserProfileData = {
      ...mockUserProfileData,
      // @ts-expect-error we test the case where we don't have credit returned
      domainsCredit: {},
    }
    mockUseAuthContext.mockReturnValueOnce({
      refetchUser: jest.fn().mockResolvedValue({
        data: mockUserProfileData,
      }),
    })
    render(<IdentityCheckStepper />)
    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  it('should navigate to BeneficiaryAccountCreated when next_step is null and initialCredit is available', async () => {
    mockUserProfileData = {
      ...mockUserProfileData,
      depositExpirationDate: '2021-11-01T00:00:00.000Z',
      domainsCredit: { all: { initial: 30000, remaining: 30000 } },
    }

    mockUseAuthContext.mockReturnValueOnce({
      refetchUser: jest.fn().mockResolvedValue({
        data: mockUserProfileData,
      }),
    })

    mockNextSubscriptionStep = {
      ...mockStep,
      nextSubscriptionStep: null,
    }
    render(<IdentityCheckStepper />)
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryAccountCreated')
    })
  })
  it.each`
    subscriptionStep                      | stepperLabel             | eventName            | eventParam
    ${IdentityCheckStep.PHONE_VALIDATION} | ${'Numéro de téléphone'} | ${'stepper_clicked'} | ${{ step: IdentityCheckStep.PHONE_VALIDATION }}
    ${IdentityCheckStep.IDENTIFICATION}   | ${'Identification'}      | ${'stepper_clicked'} | ${{ step: IdentityCheckStep.IDENTIFICATION }}
    ${IdentityCheckStep.CONFIRMATION}     | ${'Confirmation'}        | ${'stepper_clicked'} | ${{ step: IdentityCheckStep.CONFIRMATION }}
    ${IdentityCheckStep.PROFILE}          | ${'Profil'}              | ${'stepper_clicked'} | ${{ step: IdentityCheckStep.PROFILE }}
  `(
    'should trigger $eventName amplitude event with the $eventParam parameter',
    ({
      subscriptionStep,
      stepperLabel,
      eventName,
      eventParam,
    }: {
      subscriptionStep: SubscriptionStep
      stepperLabel: string
      eventName: string
      eventParam: { step: string }
    }) => {
      mockNextSubscriptionStep = {
        ...mockStep,
        nextSubscriptionStep: subscriptionStep,
      }
      // We override all the stepState with a current state so the fireEvent.press actually triggers the stepper_clicked event
      const stepsDetailsFixtureWithOnlyCurrentStates = stepsDetailsFixture.map((step) => ({
        ...step,
        stepState: StepButtonState.CURRENT,
      }))
      mockUseStepperInfo.mockReturnValue(stepsDetailsFixtureWithOnlyCurrentStates)

      mockedUseSubscriptionContext.mockReturnValueOnce({
        dispatch: mockIdentityCheckDispatch,
        step: subscriptionStep,
        identification: { method: null },
      })

      const stepper = render(<IdentityCheckStepper />)

      const stepButton = stepper.getByText(stepperLabel)
      fireEvent.press(stepButton)

      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, eventName, eventParam)
      mockUseSubscriptionSteps.mockClear()
    }
  )
})
