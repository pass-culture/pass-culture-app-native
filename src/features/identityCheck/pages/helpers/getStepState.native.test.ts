import { getStepState } from 'features/identityCheck/pages/helpers/getStepState'
import { DeprecatedIdentityCheckStep, DeprecatedStepConfig } from 'features/identityCheck/types'

const steps = [
  { name: DeprecatedIdentityCheckStep.PROFILE },
  { name: DeprecatedIdentityCheckStep.IDENTIFICATION },
  { name: DeprecatedIdentityCheckStep.CONFIRMATION },
] as DeprecatedStepConfig[]

describe('getStepState', () => {
  it('when profile is ongoing', () => {
    const contextStep = DeprecatedIdentityCheckStep.PROFILE
    expect(getStepState(steps, DeprecatedIdentityCheckStep.PROFILE, contextStep)).toBe('current')
    expect(getStepState(steps, DeprecatedIdentityCheckStep.IDENTIFICATION, contextStep)).toBe(
      'disabled'
    )
    expect(getStepState(steps, DeprecatedIdentityCheckStep.CONFIRMATION, contextStep)).toBe(
      'disabled'
    )
  })

  it('when identification is ongoing', () => {
    const contextStep = DeprecatedIdentityCheckStep.IDENTIFICATION
    expect(getStepState(steps, DeprecatedIdentityCheckStep.PROFILE, contextStep)).toBe('completed')
    expect(getStepState(steps, DeprecatedIdentityCheckStep.IDENTIFICATION, contextStep)).toBe(
      'current'
    )
    expect(getStepState(steps, DeprecatedIdentityCheckStep.CONFIRMATION, contextStep)).toBe(
      'disabled'
    )
  })

  it('when confirmation is ongoing', () => {
    const contextStep = DeprecatedIdentityCheckStep.CONFIRMATION
    expect(getStepState(steps, DeprecatedIdentityCheckStep.PROFILE, contextStep)).toBe('completed')
    expect(getStepState(steps, DeprecatedIdentityCheckStep.IDENTIFICATION, contextStep)).toBe(
      'completed'
    )
    expect(getStepState(steps, DeprecatedIdentityCheckStep.CONFIRMATION, contextStep)).toBe(
      'current'
    )
  })

  it('when process is over', () => {
    const contextStep = DeprecatedIdentityCheckStep.END
    expect(getStepState(steps, DeprecatedIdentityCheckStep.PROFILE, contextStep)).toBe('completed')
    expect(getStepState(steps, DeprecatedIdentityCheckStep.IDENTIFICATION, contextStep)).toBe(
      'completed'
    )
    expect(getStepState(steps, DeprecatedIdentityCheckStep.CONFIRMATION, contextStep)).toBe(
      'completed'
    )
  })
})
