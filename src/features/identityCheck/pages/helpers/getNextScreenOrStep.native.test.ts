import { getNextScreenOrStep } from 'features/identityCheck/pages/helpers/getNextScreenOrStep'
import { IdentityCheckStep, StepDetails } from 'features/identityCheck/types'

const steps = [
  {
    name: IdentityCheckStep.PROFILE,
    screens: ['SetName', 'SetCity', 'SetAddress', 'SetStatus'],
  },
  {
    name: IdentityCheckStep.IDENTIFICATION,
    screens: ['UbbleWebview', 'IdentityCheckEnd'],
  },
  {
    name: IdentityCheckStep.CONFIRMATION,
    screens: ['IdentityCheckHonor'],
  },
] as StepDetails[]

describe('getNextScreenOrStep', () => {
  it('should get the next screen on same step', () => {
    // Profile
    expect(getNextScreenOrStep(steps, 'SetName')).toEqual({
      screen: 'SetCity',
    })
    expect(getNextScreenOrStep(steps, 'SetCity')).toEqual({
      screen: 'SetAddress',
    })
    expect(getNextScreenOrStep(steps, 'SetAddress')).toEqual({
      screen: 'SetStatus',
    })
    // Identification

    expect(getNextScreenOrStep(steps, 'UbbleWebview')).toEqual({
      screen: 'IdentityCheckEnd',
    })
  })

  it('should return next step if last screen of step', () => {
    // Profile
    expect(getNextScreenOrStep(steps, 'SetStatus')).toEqual({
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
