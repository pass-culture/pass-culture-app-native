import { UseQueryResult } from '@tanstack/react-query'

import { ActivityIdEnum, SubscriptionStepperResponseV3 } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SubscriptionStepperResponseFixture } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useOverrideCreditActivationAmount } from 'shared/user/useOverrideCreditActivationAmount'

const mockIdentityCheckState = mockState

const mockUseAuthContext = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const mockUseStoredProfileInfos = {
  name: 'Jeanne',
  city: 'Aubervilliers',
  address: '7 rue des Lilas ',
  status: ActivityIdEnum.STUDENT,
}
jest.mock('features/identityCheck/pages/helpers/useStoredProfileInfos', () => ({
  useStoredProfileInfos: jest.fn(),
}))
const mockUseStoredProfileInfosHook = jest.mocked(useStoredProfileInfos)

jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: jest.fn(() => mockUseGetStepperInfo),
}))

const mockUseGetStepperInfo = (
  useGetStepperInfoQuery as jest.Mock<
    Partial<UseQueryResult<Partial<SubscriptionStepperResponseV3>, unknown>>
  >
).mockReturnValue({
  data: {
    subscriptionStepsToDisplay: SubscriptionStepperResponseFixture.subscriptionStepsToDisplay,
    title: 'Title',
    subtitle: 'Subtitle',
  },
})

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
    mockUseStoredProfileInfosHook.mockReturnValue(undefined)
    mockUseAuthContext.mockReturnValue({
      user: {
        firstName: null,
        lastName: null,
        street: null,
        postalCode: null,
        city: null,
        activityId: null,
        currency: undefined,
      },
    })
  })

  it('should return empty stepsDetails and empty title if no data', () => {
    mockUseGetStepperInfo.mockReturnValueOnce({ data: undefined })
    const { stepsDetails, title } = useStepperInfo()

    expect(stepsDetails).toEqual([])
    expect(title).toBe('')
  })

  it('should return errorMessage if subscriptionMessage is present', () => {
    mockUseGetStepperInfo.mockReturnValueOnce({
      data: {
        ...SubscriptionStepperResponseFixture,
        subscriptionMessage: { messageSummary: 'Erreur test', userMessage: '' },
      },
    })
    const { errorMessage } = useStepperInfo()

    expect(errorMessage).toBe('Erreur test')
  })

  it('should use fallback subtitle if shouldCreditAmountBeOverriden and no amount', () => {
    mockOverrideCreditActivationAmount.mockReturnValueOnce({
      shouldBeOverriden: true,
      amount: undefined,
    })
    const { subtitle } = useStepperInfo()

    expect(subtitle).toBe('Pour débloquer ton crédit tu dois suivre les étapes suivantes\u00a0:')
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

  describe('profile step', () => {
    it('should show subtitle when given', () => {
      mockUseAuthContext.mockReturnValueOnce({ user: null })
      const { stepsDetails } = useStepperInfo()
      const profileStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)

      expect(profileStep?.subtitle).toEqual('Sous-titre Profil')
    })

    describe('firstScreen logic', () => {
      it('should return "SetName" when user has no completed info', () => {
        mockUseAuthContext.mockReturnValueOnce({
          user: {
            firstName: null,
            lastName: null,
            street: null,
            postalCode: null,
            city: null,
            activityId: null,
          },
        })
        const { stepsDetails } = useStepperInfo()
        const profileStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)

        expect(profileStep?.firstScreen).toEqual('SetName')
        expect(profileStep?.firstScreenType).toEqual(ProfileTypes.IDENTITY_CHECK)
      })

      it('should return "ProfileInformationValidationCreate" when user has completed info', () => {
        mockUseAuthContext.mockReturnValueOnce({
          user: {
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main St',
            postalCode: '75001',
            city: 'Paris',
            activityId: ActivityIdEnum.STUDENT,
            currency: undefined,
          },
        })
        const { stepsDetails } = useStepperInfo()
        const profileStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)

        expect(profileStep?.firstScreen).toEqual('ProfileInformationValidationCreate')
        expect(profileStep?.firstScreenType).toEqual(ProfileTypes.RECAP_EXISTING_DATA)
      })

      it('should return "ProfileInformationValidationCreate" when infos are stored locally', () => {
        mockUseStoredProfileInfosHook.mockReturnValueOnce(mockUseStoredProfileInfos as never)

        const { stepsDetails } = useStepperInfo()
        const profileStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)

        expect(profileStep?.firstScreen).toEqual('ProfileInformationValidationCreate')
        expect(profileStep?.firstScreenType).toEqual(ProfileTypes.RECAP_EXISTING_DATA)
      })
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

  describe('confirmation step', () => {
    it('should have firstScreen to "CulturalSurveyIntro"', () => {
      const { stepsDetails } = useStepperInfo()
      const confirmationStep = stepsDetails.find(
        (step) => step.name === IdentityCheckStep.CONFIRMATION
      )

      expect(confirmationStep?.firstScreen).toEqual('CulturalSurveyIntro')
    })
  })
})
