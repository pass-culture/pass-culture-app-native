import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import {
  SubscriptionStepperResponseFixture as mockSubscriptionStepper,
  SubscritpionStepperResponseWithPhoneValifationFixture as mockSubscriptionStepperWithPhoneValidation,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useStepperInfo } from 'features/identityCheck/pages/helpers/useStepperInfo'
import { IdentityCheckStepNewStepper } from 'features/identityCheck/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'

let mockIdentityCheckState = mockState
const mockRemainingAttempts = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
  isLastAttempt: false,
}

jest.mock('features/identityCheck/api/useGetStepperInfo', () => ({
  useGetStepperInfo: jest.fn(() => ({
    stepToDisplay: mockUseGetStepperInfo,
  })),
}))

const mockUseGetStepperInfo = (useGetStepperInfo as jest.Mock).mockReturnValue({
  stepToDisplay: mockSubscriptionStepper.subscriptionStepsToDisplay,
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
  it('should return 3 steps if there is no phone validation step', () => {
    const steps = useStepperInfo()
    expect(steps.length).toEqual(3)
  })

  it('should return 4 steps if stepperIncludesPhoneValidation is true', () => {
    mockUseGetStepperInfo.mockReturnValueOnce({
      stepToDisplay: mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
    })
    const steps = useStepperInfo()
    expect(steps.length).toEqual(4)
  })

  it('should include IdentityCheckSchoolType if reducer has school types', () => {
    mockIdentityCheckState = {
      ...mockState,
      profile: { ...mockState.profile, hasSchoolTypes: true },
    }
    const steps = useStepperInfo()
    const profileStep = steps.find((step) => step.name === IdentityCheckStepNewStepper.PROFILE)
    expect(profileStep?.screens.includes('IdentityCheckSchoolType')).toEqual(true)
  })

  it('should not include IdentityCheckSchoolType if reducer doesnnt have school types', () => {
    mockIdentityCheckState = {
      ...mockState,
      profile: { ...mockState.profile, hasSchoolTypes: false },
    }
    const steps = useStepperInfo()
    const profileStep = steps.find((step) => step.name === IdentityCheckStepNewStepper.PROFILE)

    expect(profileStep?.screens.includes('IdentityCheckSchoolType')).toEqual(false)
  })

  it('should include only PhoneValidationTooManySMSSent if no remaining attempts left', () => {
    mockUseGetStepperInfo.mockReturnValueOnce({
      stepToDisplay: mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
    })
    mockUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 0,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    })

    const steps = useStepperInfo()
    const phoneValidationStep = steps.find(
      (step) => step.name === IdentityCheckStepNewStepper.PHONE_VALIDATION
    )

    expect(phoneValidationStep?.screens.includes('PhoneValidationTooManySMSSent')).toEqual(true)
    expect(phoneValidationStep?.screens.length).toEqual(1)
  })

  it('should not include only PhoneValidationTooManySMSSent if remaining attempts left', () => {
    mockUseGetStepperInfo.mockReturnValueOnce({
      stepToDisplay: mockSubscriptionStepperWithPhoneValidation.subscriptionStepsToDisplay,
    })
    mockUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 1,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    })
    const steps = useStepperInfo()

    const phoneValidationStep = steps.find(
      (step) => step.name === IdentityCheckStepNewStepper.PHONE_VALIDATION
    )
    expect(phoneValidationStep?.screens.includes('PhoneValidationTooManySMSSent')).toEqual(false)
  })

  it("should return ['SelectIDOrigin'] identity screen list", () => {
    const steps = useStepperInfo()
    const identityStep = steps.find(
      (step) => step.name === IdentityCheckStepNewStepper.IDENTIFICATION
    )
    const identificationScreensFlow = identityStep?.screens

    expect(identificationScreensFlow).toEqual(['SelectIDOrigin'])
  })
})
