import { UseQueryResult } from '@tanstack/react-query'

import { ActivityIdEnum, SubscriptionStepperResponseV2 } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import {
  SubscriptionStepperResponseFixture as mockSubscriptionStepper,
  SubscriptionStepperResponseWithPhoneValidationFixture as mockSubscriptionStepperWithPhoneValidation,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useOverrideCreditActivationAmount } from 'shared/user/useOverrideCreditActivationAmount'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { setSettingsMock } from 'tests/settings/mockSettings'

const mockIdentityCheckState = mockState
const mockRemainingAttempts = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
  isLastAttempt: false,
}

jest.mock('features/auth/context/AuthContext')

const mockUseStoredProfileInfos = {
  name: 'Jeanne',
  city: 'Aubervilliers',
  address: '7 rue des Lilas ',
  status: ActivityIdEnum.STUDENT,
}
jest.mock('features/identityCheck/pages/helpers/useStoredProfileInfos', () => ({
  useStoredProfileInfos: jest.fn(() => mockUseStoredProfileInfos),
}))

jest.mock('features/auth/context/AuthContext')
const mockUser = { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } }
mockAuthContextWithUser(mockUser)

jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: jest.fn(() => mockUseGetStepperInfo),
}))

const mockUseGetStepperInfo = (
  useGetStepperInfoQuery as jest.Mock<
    Partial<UseQueryResult<Partial<SubscriptionStepperResponseV2>, unknown>>
  >
).mockReturnValue({
  data: {
    subscriptionStepsToDisplay: mockSubscriptionStepper.subscriptionStepsToDisplay,
    title: 'Title',
    subtitle: 'Subtitle',
  },
})

jest.mock('features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery')

const mockUsePhoneValidationRemainingAttempts = (
  usePhoneValidationRemainingAttemptsQuery as jest.Mock
).mockReturnValue(mockRemainingAttempts)

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockIdentityCheckState,
  })),
}))

jest.mock('shared/user/useOverrideCreditActivationAmount')
const mockOverrideCreditActivationAmount = jest.mocked(useOverrideCreditActivationAmount)
mockOverrideCreditActivationAmount.mockReturnValue({
  shouldBeOverriden: false,
  amount: '150 €',
})

describe('useStepperInfo', () => {
  beforeEach(() => {
    setFeatureFlags()
    setSettingsMock({ patchSettingsWith: { enablePhoneValidation: true } })
  })

  it('should convert subtitle amount from € to CPF', () => {
    mockOverrideCreditActivationAmount.mockReturnValueOnce({
      shouldBeOverriden: true,
      amount: '17 900 F',
    })
    const { subtitle } = useStepperInfo()

    expect(subtitle).toEqual(
      'Pour débloquer tes 17 900 F tu dois suivre les étapes suivantes\u00a0:'
    )
  })

  it('should return title and subtitle', () => {
    const { title, subtitle } = useStepperInfo()

    expect(title).toEqual('Title')
    expect(subtitle).toEqual('Subtitle')
  })

  it('should return 3 steps if there is no phone validation step', () => {
    const { stepsDetails } = useStepperInfo()

    expect(stepsDetails).toHaveLength(3)
  })

  it('should return 4 steps when useGetStepperInfo returns 4 steps', () => {
    mockUseGetStepperInfo.mockReturnValueOnce({
      data: {
        subscriptionStepsToDisplay:
          mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
      },
    })
    const { stepsDetails } = useStepperInfo()

    expect(stepsDetails).toHaveLength(4)
  })

  describe('profile step', () => {
    it('should show subtitle when given', () => {
      const { stepsDetails } = useStepperInfo()
      const confirmationStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)

      expect(confirmationStep?.subtitle).toEqual('Sous-titre Profil')
    })
  })

  describe('identification step', () => {
    it('should default return "SelectIDOrigin"', () => {
      const { stepsDetails } = useStepperInfo()
      const identityStep = stepsDetails.find(
        (step) => step.name === IdentityCheckStep.IDENTIFICATION
      )
      const identificationScreensFlow = identityStep?.firstScreen

      expect(identificationScreensFlow).toEqual('SelectIDOrigin')
    })
  })

  describe('phone validation step', () => {
    it('should have firstScreen to "SetPhoneNumberWitoutValidation" when backend feature flag is disabled', () => {
      mockUseGetStepperInfo.mockReturnValueOnce({
        data: {
          subscriptionStepsToDisplay:
            mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
        },
      })

      setSettingsMock({ patchSettingsWith: { enablePhoneValidation: false } })

      const { stepsDetails } = useStepperInfo()
      const phoneValidationStep = stepsDetails.find(
        (step) => step.name === IdentityCheckStep.PHONE_VALIDATION
      )

      expect(phoneValidationStep?.firstScreen).toEqual('SetPhoneNumberWithoutValidation')
    })

    it('should return "PhoneValidationTooManySMSSent" if no remaining attempts left', () => {
      mockUseGetStepperInfo.mockReturnValueOnce({
        data: {
          subscriptionStepsToDisplay:
            mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
        },
      })
      mockUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
        remainingAttempts: 0,
        counterResetDatetime: 'time',
        isLastAttempt: false,
      })

      const { stepsDetails } = useStepperInfo()
      const phoneValidationStep = stepsDetails.find(
        (step) => step.name === IdentityCheckStep.PHONE_VALIDATION
      )

      expect(phoneValidationStep?.firstScreen).toEqual('PhoneValidationTooManySMSSent')
    })

    it('should not include only PhoneValidationTooManySMSSent if remaining attempts left', () => {
      mockUseGetStepperInfo.mockReturnValueOnce({
        data: {
          subscriptionStepsToDisplay:
            mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
        },
      })
      mockUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
        remainingAttempts: 1,
        counterResetDatetime: 'time',
        isLastAttempt: false,
      })
      const { stepsDetails } = useStepperInfo()

      const phoneValidationStep = stepsDetails.find(
        (step) => step.name === IdentityCheckStep.PHONE_VALIDATION
      )

      expect(phoneValidationStep?.firstScreen).toEqual('SetPhoneNumber')
    })
  })

  describe('confirmation step', () => {
    it('should have firstScreen to "IdentityCheckHonor"', () => {
      const { stepsDetails } = useStepperInfo()
      const confirmationStep = stepsDetails.find(
        (step) => step.name === IdentityCheckStep.CONFIRMATION
      )

      expect(confirmationStep?.firstScreen).toEqual('IdentityCheckHonor')
    })
  })
})
