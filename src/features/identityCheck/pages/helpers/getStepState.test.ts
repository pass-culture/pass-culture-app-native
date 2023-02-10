import { getStepState } from 'features/identityCheck/pages/helpers/getStepState'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'

const steps = [
  { name: IdentityCheckStep.PROFILE },
  { name: IdentityCheckStep.IDENTIFICATION },
  { name: IdentityCheckStep.CONFIRMATION },
] as StepConfig[]

describe('getStepState', () => {
  it('when profile is ongoing', () => {
    const contextStep = IdentityCheckStep.PROFILE
    expect(getStepState(steps, IdentityCheckStep.PROFILE, contextStep)).toBe('current')
    expect(getStepState(steps, IdentityCheckStep.IDENTIFICATION, contextStep)).toBe('disabled')
    expect(getStepState(steps, IdentityCheckStep.CONFIRMATION, contextStep)).toBe('disabled')
  })

  it('when identification is ongoing', () => {
    const contextStep = IdentityCheckStep.IDENTIFICATION
    expect(getStepState(steps, IdentityCheckStep.PROFILE, contextStep)).toBe('completed')
    expect(getStepState(steps, IdentityCheckStep.IDENTIFICATION, contextStep)).toBe('current')
    expect(getStepState(steps, IdentityCheckStep.CONFIRMATION, contextStep)).toBe('disabled')
  })

  it('when confirmation is ongoing', () => {
    const contextStep = IdentityCheckStep.CONFIRMATION
    expect(getStepState(steps, IdentityCheckStep.PROFILE, contextStep)).toBe('completed')
    expect(getStepState(steps, IdentityCheckStep.IDENTIFICATION, contextStep)).toBe('completed')
    expect(getStepState(steps, IdentityCheckStep.CONFIRMATION, contextStep)).toBe('current')
  })

  it('when process is over', () => {
    const contextStep = IdentityCheckStep.END
    expect(getStepState(steps, IdentityCheckStep.PROFILE, contextStep)).toBe('completed')
    expect(getStepState(steps, IdentityCheckStep.IDENTIFICATION, contextStep)).toBe('completed')
    expect(getStepState(steps, IdentityCheckStep.CONFIRMATION, contextStep)).toBe('completed')
  })
})
