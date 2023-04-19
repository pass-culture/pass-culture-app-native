import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import {
  SubscriptionStepperResponseFixture as mockSubscriptionStepper,
  SubscriptionStepperResponseWithPhoneValidationFixture as mockSubscriptionStepperWithPhoneValidation,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { IdentityCheckStep } from 'features/identityCheck/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'

let mockIdentityCheckState = mockState
const mockRemainingAttempts = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
  isLastAttempt: false,
}

const defaultRemoteConfig: CustomRemoteConfig = {
  test_param: 'A',
  homeEntryIdNotConnected: 'homeEntryIdNotConnected',
  homeEntryIdGeneral: 'homeEntryIdGeneral',
  homeEntryIdOnboardingGeneral: 'homeEntryIdOnboardingGeneral',
  homeEntryIdOnboardingUnderage: 'homeEntryIdOnboardingUnderage',
  homeEntryIdOnboarding_18: 'homeEntryIdOnboarding_18',
  homeEntryIdWithoutBooking_18: 'homeEntryIdWithoutBooking_18',
  homeEntryIdWithoutBooking_15_17: 'homeEntryIdWithoutBooking_15_17',
  homeEntryId_18: 'homeEntryId_18',
  homeEntryId_15_17: 'homeEntryId_15_17',
  shouldUseAlgoliaRecommend: false,
  identificationMethodFork: 'ubble',
}

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider')
const mockUseRemoteConfigContext = useRemoteConfigContext as jest.MockedFunction<
  typeof useRemoteConfigContext
>

jest.mock('features/identityCheck/api/useGetStepperInfo', () => ({
  useGetStepperInfo: jest.fn(() => mockUseGetStepperInfo),
}))

const mockUseGetStepperInfo = (useGetStepperInfo as jest.Mock).mockReturnValue({
  stepToDisplay: mockSubscriptionStepper.subscriptionStepsToDisplay,
  title: 'Title',
  subtitle: 'Subtitle',
})

jest.mock('features/identityCheck/api/usePhoneValidationRemainingAttempts')

const mockUsePhoneValidationRemainingAttempts = (
  usePhoneValidationRemainingAttempts as jest.Mock
).mockReturnValue(mockRemainingAttempts)

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockIdentityCheckState,
  })),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')
useFeatureFlagSpy.mockReturnValue(false)

describe('useStepperInfo', () => {
  it('should return title and subtitle', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { title, subtitle } = useStepperInfo()
    expect(title).toEqual('Title')
    expect(subtitle).toEqual('Subtitle')
  })

  it('should return 3 steps if there is no phone validation step', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { stepsDetails } = useStepperInfo()
    expect(stepsDetails.length).toEqual(3)
  })

  it('should return 4 steps when useGetStepperInfo returns 4 steps', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    mockUseGetStepperInfo.mockReturnValueOnce({
      stepToDisplay: mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
    })
    const { stepsDetails } = useStepperInfo()
    expect(stepsDetails.length).toEqual(4)
  })

  it('should include IdentityCheckSchoolType if reducer has school types', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    mockIdentityCheckState = {
      ...mockState,
      profile: { ...mockState.profile, hasSchoolTypes: true },
    }
    const { stepsDetails } = useStepperInfo()
    const profileStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)
    expect(profileStep?.screens.includes('IdentityCheckSchoolType')).toEqual(true)
  })

  it('should not include IdentityCheckSchoolType if reducer doesnnt have school types', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    mockIdentityCheckState = {
      ...mockState,
      profile: { ...mockState.profile, hasSchoolTypes: false },
    }
    const { stepsDetails } = useStepperInfo()
    const profileStep = stepsDetails.find((step) => step.name === IdentityCheckStep.PROFILE)

    expect(profileStep?.screens.includes('IdentityCheckSchoolType')).toEqual(false)
  })

  it('should include only PhoneValidationTooManySMSSent if no remaining attempts left', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    mockUseGetStepperInfo.mockReturnValueOnce({
      stepToDisplay: mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
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

    expect(phoneValidationStep?.screens.includes('PhoneValidationTooManySMSSent')).toEqual(true)
    expect(phoneValidationStep?.screens.length).toEqual(1)
  })

  it('should not include only PhoneValidationTooManySMSSent if remaining attempts left', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    mockUseGetStepperInfo.mockReturnValueOnce({
      stepToDisplay: mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
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
    expect(phoneValidationStep?.screens.includes('PhoneValidationTooManySMSSent')).toEqual(false)
  })

  it("should return ['SelectIDOrigin'] identity screen list", () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { stepsDetails } = useStepperInfo()
    const identityStep = stepsDetails.find((step) => step.name === IdentityCheckStep.IDENTIFICATION)
    const identificationScreensFlow = identityStep?.screens

    expect(identificationScreensFlow).toEqual(['SelectIDOrigin'])
  })
})
