import { SubscriptionStep } from 'api/gen'
import { getIdentityCheckStep } from 'features/identityCheck/pages/helpers/useSetCurrentSubscriptionStep'
import { IdentityCheckStep } from 'features/identityCheck/types'

describe('getIdentityCheckStep', () => {
  it.each([
    [IdentityCheckStep.PROFILE, 'profile-completion'],
    [IdentityCheckStep.IDENTIFICATION, 'identity-check'],
    [IdentityCheckStep.CONFIRMATION, 'honor-statement'],
    [null, 'something-else'],
  ])(
    'should return the %s identityCheckStep when %s is provided',
    (identityCheckStep, subscriptionStep) => {
      expect(getIdentityCheckStep(subscriptionStep as SubscriptionStep)).toBe(identityCheckStep)
    }
  )
})
