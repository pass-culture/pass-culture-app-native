import mockdate from 'mockdate'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SubscriptionStep, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/fixtures/nextSubscriptionStepFixture'
import { stepsDetailsFixture } from 'features/identityCheck/pages/helpers/stepDetails.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { Stepper } from 'features/identityCheck/pages/Stepper'
import {
  DeprecatedIdentityCheckStep,
  IdentityCheckStep,
  StepButtonState,
} from 'features/identityCheck/types'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

let mockNextSubscriptionStep = mockStep
const mockIdentityCheckDispatch = jest.fn()

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

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

jest.mock('features/identityCheck/pages/helpers/useStepperInfo')
const mockUseStepperInfo = useStepperInfo as jest.Mock

mockUseStepperInfo.mockReturnValue({
  stepsDetails: stepsDetailsFixture,
  title: 'Vas-y',
  subtitle: 'Débloque ton crédit',
})

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
    render(<Stepper />)
    expect(screen).toMatchSnapshot()
  })

  it('should display an error message if the identification step failed', () => {
    mockUseStepperInfo.mockReturnValueOnce({
      stepsDetails: stepsDetailsFixture,
      title: 'Vas-y',
      errorMessage: 'Le document que tu as présenté est expiré.',
    })
    render(<Stepper />)

    expect(screen.getByText('Le document que tu as présenté est expiré.')).toBeOnTheScreen()
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
    render(<Stepper />)
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
    render(<Stepper />)
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BeneficiaryAccountCreated')
    })
  })

  it.each`
    subscriptionStep                      | stepperLabel             | eventParam
    ${IdentityCheckStep.PHONE_VALIDATION} | ${'Numéro de téléphone'} | ${IdentityCheckStep.PHONE_VALIDATION}
    ${IdentityCheckStep.IDENTIFICATION}   | ${'Identification'}      | ${IdentityCheckStep.IDENTIFICATION}
    ${IdentityCheckStep.CONFIRMATION}     | ${'Confirmation'}        | ${IdentityCheckStep.CONFIRMATION}
    ${IdentityCheckStep.PROFILE}          | ${'Profil'}              | ${IdentityCheckStep.PROFILE}
  `(
    'should trigger analytics with the $eventParam parameter',
    ({
      subscriptionStep,
      stepperLabel,
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
      mockUseStepperInfo.mockReturnValue({
        stepsDetails: stepsDetailsFixtureWithOnlyCurrentStates,
        title: 'Vas-y',
        subtitle: 'Débloque ton crédit',
      })

      mockedUseSubscriptionContext.mockReturnValueOnce({
        dispatch: mockIdentityCheckDispatch,
        step: subscriptionStep,
        identification: { method: null },
      })

      const stepper = render(<Stepper />)

      const stepButton = stepper.getByText(stepperLabel)
      fireEvent.press(stepButton)

      expect(analytics.logIdentityCheckStep).toHaveBeenNthCalledWith(1, eventParam)
    }
  )

  it('should trigger StepperDisplayed tracker when route contains a from parameter and user has a step to complete', () => {
    useRoute.mockReturnValueOnce({ params: { from: StepperOrigin.HOME } })

    mockUseStepperInfo.mockReturnValueOnce({
      stepsDetails: stepsDetailsFixture,
      title: 'Vas-y',
      errorMessage: 'Le document que tu as présenté est expiré.',
    })

    render(<Stepper />)

    expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
      1,
      StepperOrigin.HOME,
      IdentityCheckStep.IDENTIFICATION
    )
  })

  it('should not trigger StepperDisplayed tracker when route does not contain a from parameter', () => {
    useRoute.mockReturnValueOnce({ params: undefined })

    mockUseStepperInfo.mockReturnValueOnce({
      stepsDetails: stepsDetailsFixture,
      title: 'Vas-y',
      errorMessage: 'Le document que tu as présenté est expiré.',
    })

    render(<Stepper />)

    expect(analytics.logStepperDisplayed).not.toHaveBeenCalled()
  })
})
