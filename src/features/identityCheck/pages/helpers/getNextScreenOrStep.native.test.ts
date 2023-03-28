import { getNextScreenOrStep } from 'features/identityCheck/pages/helpers/getNextScreenOrStep'
import { DeprecatedIdentityCheckStep, DeprecatedStepConfig } from 'features/identityCheck/types'

const steps = [
  {
    name: DeprecatedIdentityCheckStep.PROFILE,
    screens: ['SetName', 'IdentityCheckCity', 'IdentityCheckAddress', 'IdentityCheckStatus'],
  },
  {
    name: DeprecatedIdentityCheckStep.IDENTIFICATION,
    screens: ['IdentityCheckStart', 'UbbleWebview', 'IdentityCheckEnd'],
  },
  {
    name: DeprecatedIdentityCheckStep.CONFIRMATION,
    screens: ['IdentityCheckHonor'],
  },
] as DeprecatedStepConfig[]

describe('getNextScreenOrStep', () => {
  it('should get the next screen on same step', () => {
    // Profile
    expect(getNextScreenOrStep(steps, 'SetName')).toEqual({
      screen: 'IdentityCheckCity',
    })
    expect(getNextScreenOrStep(steps, 'IdentityCheckCity')).toEqual({
      screen: 'IdentityCheckAddress',
    })
    expect(getNextScreenOrStep(steps, 'IdentityCheckAddress')).toEqual({
      screen: 'IdentityCheckStatus',
    })
    // Identification
    expect(getNextScreenOrStep(steps, 'IdentityCheckStart')).toEqual({
      screen: 'UbbleWebview',
    })
    expect(getNextScreenOrStep(steps, 'UbbleWebview')).toEqual({
      screen: 'IdentityCheckEnd',
    })
  })

  it('should return next step if last screen of step', () => {
    // Profile
    expect(getNextScreenOrStep(steps, 'IdentityCheckStatus')).toEqual({
      step: DeprecatedIdentityCheckStep.IDENTIFICATION,
    })
    // Identification
    expect(getNextScreenOrStep(steps, 'IdentityCheckEnd')).toEqual({
      step: DeprecatedIdentityCheckStep.CONFIRMATION,
    })
    // Confirmation
    expect(getNextScreenOrStep(steps, 'IdentityCheckHonor')).toEqual({
      step: DeprecatedIdentityCheckStep.END,
    })
  })
})
