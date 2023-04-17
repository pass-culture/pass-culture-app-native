import { IdentityCheckMethod } from 'api/gen'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
  'IdentityCheckEduConnect',
  'IdentityCheckEduConnectForm',
  'IdentityCheckValidation',
]

const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']

const forkFlow: (keyof SubscriptionRootStackParamList)[] = ['IdentificationForkUbble']

const educonnectOnlyMethod = [IdentityCheckMethod.educonnect]

const ubbleOnlyMethod = [IdentityCheckMethod.ubble]

const twoMethods = [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect]

describe('computeIdentificationMethod', () => {
  it('should return a flow', () => {
    // Fork
    expect(computeIdentificationMethod(twoMethods)).toEqual(forkFlow)
    // Only Ubble allowed
    expect(computeIdentificationMethod(ubbleOnlyMethod)).toEqual(ubbleFlow)
    // Only Educonnect allowed
    expect(computeIdentificationMethod(educonnectOnlyMethod)).toEqual(educonnectFlow)
    // Default case
    expect(computeIdentificationMethod()).toEqual(ubbleFlow)
  })
})
