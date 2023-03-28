import { SubscriptionStep } from 'api/gen'
import { getIdentityCheckStep } from 'features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'

describe('getIdentityCheckStep', () => {
  it.each([
    [DeprecatedIdentityCheckStep.PHONE_VALIDATION, 'phone-validation'],
    [DeprecatedIdentityCheckStep.PROFILE, 'profile-completion'],
    [DeprecatedIdentityCheckStep.IDENTIFICATION, 'identity-check'],
    [DeprecatedIdentityCheckStep.CONFIRMATION, 'honor-statement'],
    [null, 'something-else'],
  ])(
    'should return the %s identityCheckStep when %s is provided',
    (identityCheckStep, subscriptionStep) => {
      expect(getIdentityCheckStep(subscriptionStep as SubscriptionStep)).toBe(identityCheckStep)
    }
  )
})
