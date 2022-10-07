import { useAppSettings } from 'features/auth/settings'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/__mocks__/nextSubscriptionStepFixture'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/api'
import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'

let mockNextSubscriptionStep = mockStep
let mockIdentityCheckState = mockState
const mockRemainingAttempts = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
  isLastAttempt: false,
}

jest.mock('features/auth/signup/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

jest.mock('features/identityCheck/api/api')

const mockUsePhoneValidationRemainingAttempts = (
  usePhoneValidationRemainingAttempts as jest.Mock
).mockReturnValue(mockRemainingAttempts)

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockIdentityCheckState,
  })),
}))

jest.mock('features/auth/settings')

const mockedUseAppSettings = (useAppSettings as jest.Mock).mockReturnValue({
  data: { enableNewIdentificationFlow: false },
})

describe('useIdentityCheckSteps', () => {
  beforeEach(jest.clearAllMocks)

  it('should return 3 steps if stepperIncludesPhoneValidation is false', () => {
    const steps = useIdentityCheckSteps()
    expect(steps.length).toEqual(3)
  })
  it('should return 4 steps if stepperIncludesPhoneValidation is true', () => {
    mockNextSubscriptionStep = {
      ...mockStep,
      stepperIncludesPhoneValidation: true,
    }
    const steps = useIdentityCheckSteps()
    expect(steps.length).toEqual(4)
  })
  it('should include IdentityCheckSchoolType if reducer has school types', () => {
    mockNextSubscriptionStep = {
      ...mockStep,
      stepperIncludesPhoneValidation: false,
    }
    mockIdentityCheckState = {
      ...mockState,
      profile: { ...mockState.profile, hasSchoolTypes: true },
    }
    const steps = useIdentityCheckSteps()
    expect(steps[0].screens.includes('IdentityCheckSchoolType')).toEqual(true)
  })
  it('should not include IdentityCheckSchoolType if reducer doesnnt have school types', () => {
    mockIdentityCheckState = {
      ...mockState,
      profile: { ...mockState.profile, hasSchoolTypes: false },
    }
    const steps = useIdentityCheckSteps()
    expect(steps[0].screens.includes('IdentityCheckSchoolType')).toEqual(false)
  })
  it('should include only PhoneValidationTooManySMSSent if no remaining attempts left', () => {
    mockUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 0,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    })
    mockNextSubscriptionStep = {
      ...mockStep,
      stepperIncludesPhoneValidation: true,
    }
    const steps = useIdentityCheckSteps()

    expect(steps[0].screens.includes('PhoneValidationTooManySMSSent')).toEqual(true)
    expect(steps[0].screens.length).toEqual(1)
  })
  it('should not include only PhoneValidationTooManySMSSent if remaining attempts left', () => {
    mockUsePhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 1,
      counterResetDatetime: 'time',
      isLastAttempt: false,
    })
    mockNextSubscriptionStep = {
      ...mockStep,
      stepperIncludesPhoneValidation: true,
    }
    const steps = useIdentityCheckSteps()

    expect(steps[0].screens.includes('PhoneValidationTooManySMSSent')).toEqual(false)
  })

  it.each`
    enableNewIdentificationFlow | expectedUbbleFlow
    ${true}                     | ${['SelectIDOrigin']}
    ${false}                    | ${['IdentityCheckStart', 'UbbleWebview', 'IdentityCheckEnd']}
  `(
    'should return $expectedUbbleFlow identity screen list when enableNewIdentificationFlow is $enableNewIdentificationFlow',
    ({ enableNewIdentificationFlow: enableNewIdentificationFlowValue, expectedUbbleFlow }) => {
      mockedUseAppSettings.mockReturnValueOnce({
        data: { enableNewIdentificationFlow: enableNewIdentificationFlowValue },
      })

      const steps = useIdentityCheckSteps()
      const identificationScreensFlow = steps[2].screens

      expect(identificationScreensFlow).toEqual(expectedUbbleFlow)
    }
  )
})
