import { IdentityCheckMethod } from 'api/gen'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { SubscriptionScreen } from 'features/identityCheck/types'

const educonnectFlowFirstScreen: SubscriptionScreen = 'EduConnectForm'
const ubbleFlowFirstScreen: SubscriptionScreen = 'SelectIDOrigin'
const forkScreen: SubscriptionScreen = 'IdentificationFork'

const educonnectOnlyMethod = [IdentityCheckMethod.educonnect]
const ubbleOnlyMethod = [IdentityCheckMethod.ubble]
const bothMethodsAllowed = [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect]

describe('computeIdentificationMethod', () => {
  it('should return fork flow with two methods allowed', () => {
    expect(computeIdentificationMethod(bothMethodsAllowed)).toEqual(forkScreen)
  })
  it('should return ubble flow with if only ubble method is allowed', () => {
    expect(computeIdentificationMethod(ubbleOnlyMethod)).toEqual(ubbleFlowFirstScreen)
  })
  it('should return educonnect flow with if only educonnect method is allowed', () => {
    expect(computeIdentificationMethod(educonnectOnlyMethod)).toEqual(educonnectFlowFirstScreen)
  })
  it('should return ubble flow by default', () => {
    expect(computeIdentificationMethod()).toEqual(ubbleFlowFirstScreen)
  })
})
