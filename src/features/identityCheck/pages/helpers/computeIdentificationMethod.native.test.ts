import { IdentityCheckMethod } from 'api/gen'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
  'EduConnect',
  'EduConnectForm',
  'EduConnectValidation',
]

const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']
const forkFlow: (keyof SubscriptionRootStackParamList)[] = ['IdentificationFork']

const educonnectOnlyMethod = [IdentityCheckMethod.educonnect]
const ubbleOnlyMethod = [IdentityCheckMethod.ubble]
const bothMethodsAllowed = [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect]

describe('computeIdentificationMethod', () => {
  it('should return fork flow with two methods allowed', () => {
    expect(computeIdentificationMethod(bothMethodsAllowed)).toEqual(forkFlow)
  })
  it('should return ubble flow with if only ubble method is allowed', () => {
    expect(computeIdentificationMethod(ubbleOnlyMethod)).toEqual(ubbleFlow)
  })
  it('should return educonnect flow with if only educonnect method is allowed', () => {
    expect(computeIdentificationMethod(educonnectOnlyMethod)).toEqual(educonnectFlow)
  })
  it('should return ubble flow by default', () => {
    expect(computeIdentificationMethod()).toEqual(ubbleFlow)
  })
})
