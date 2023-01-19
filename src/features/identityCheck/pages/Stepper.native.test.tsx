import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionStep, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/__mocks__/nextSubscriptionStepFixture'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { useSubscriptionSteps } from 'features/identityCheck/useSubscriptionSteps'
import { amplitude } from 'libs/amplitude'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, waitFor } from 'tests/utils'

let mockNextSubscriptionStep = mockStep
const mockIdentityCheckDispatch = jest.fn()

mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

jest.mock('features/auth/api/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

jest.mock('features/identityCheck/useSetCurrentSubscriptionStep', () => ({
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

jest.mock('features/identityCheck/useSubscriptionSteps')
const mockUseSubscriptionSteps = useSubscriptionSteps as jest.Mock
mockUseSubscriptionSteps.mockReturnValue([
  {
    name: IdentityCheckStep.PHONE_VALIDATION,
    label: 'Numéro de téléphone',
    icon: 'Icon',
    screens: [''],
  },
  {
    name: IdentityCheckStep.IDENTIFICATION,
    label: 'Identification',
    icon: 'Icon',
    screens: [''],
  },
  {
    name: IdentityCheckStep.PROFILE,
    label: 'Profil',
    icon: 'Icon',
    screens: [''],
  },
  {
    name: IdentityCheckStep.CONFIRMATION,
    label: 'Confirmation',
    icon: 'Icon',
    screens: [''],
  },
])

jest.mock('react-query')

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

describe('Stepper navigation', () => {
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
    ${IdentityCheckStep.IDENTIFICATION}   | ${'Identification'}      | ${'stepper_clicked'} | ${{ step: 'identification' }}
    ${IdentityCheckStep.PHONE_VALIDATION} | ${'Numéro de téléphone'} | ${'stepper_clicked'} | ${{ step: 'phone_validation' }}
    ${IdentityCheckStep.CONFIRMATION}     | ${'Confirmation'}        | ${'stepper_clicked'} | ${{ step: 'confirmation' }}
    ${IdentityCheckStep.PROFILE}          | ${'Profil'}              | ${'stepper_clicked'} | ${{ step: 'profile' }}
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
      mockedUseSubscriptionContext.mockReturnValue({
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
