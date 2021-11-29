import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { getNextScreenOrStep } from 'features/identityCheck/useIdentityCheckNavigation'

const steps = [
  {
    name: IdentityCheckStep.PROFILE,
    screens: ['SetName', 'IdentityCheckCity', 'IdentityCheckAddress', 'IdentityCheckStatus'],
  },
  {
    name: IdentityCheckStep.IDENTIFICATION,
    screens: ['IdentityCheckStart', 'IdentityCheckWebview', 'IdentityCheckEnd'],
  },
  {
    name: IdentityCheckStep.CONFIRMATION,
    screens: ['IdentityCheckHonor'],
  },
] as StepConfig[]

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
      screen: 'IdentityCheckWebview',
    })
    expect(getNextScreenOrStep(steps, 'IdentityCheckWebview')).toEqual({
      screen: 'IdentityCheckEnd',
    })
  })

  it('should return next step if last screen of step', () => {
    // Profile
    expect(getNextScreenOrStep(steps, 'IdentityCheckStatus')).toEqual({
      step: IdentityCheckStep.IDENTIFICATION,
    })
    // Identification
    expect(getNextScreenOrStep(steps, 'IdentityCheckEnd')).toEqual({
      step: IdentityCheckStep.CONFIRMATION,
    })
    // Confirmation
    expect(getNextScreenOrStep(steps, 'IdentityCheckHonor')).toEqual({
      step: IdentityCheckStep.END,
    })
  })
})
