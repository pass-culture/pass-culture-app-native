import { IdentityCheckMethod } from 'api/gen'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

const educonnectFlow: keyof SubscriptionRootStackParamList = 'IdentityCheckEduConnect'
const ubbleFlow: keyof SubscriptionRootStackParamList = 'SelectIDOrigin'
const ubbleOnTopForkFlow: keyof SubscriptionRootStackParamList = 'IdentificationForkUbble'
const educonnectOnTopForkFlow: keyof SubscriptionRootStackParamList = 'IdentificationForkEduconnect'

const educonnectOnlyMethod = [IdentityCheckMethod.educonnect]
const ubbleOnlyMethod = [IdentityCheckMethod.ubble]
const bothMethodsAllowed = [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect]

describe('computeIdentificationMethod', () => {
  it('should return ubble fork flow with two methods allowed and ubble AB testing param', () => {
    expect(computeIdentificationMethod(bothMethodsAllowed, IdentityCheckMethod.ubble)).toEqual(
      ubbleOnTopForkFlow
    )
  })
  it('should return educonnect fork flow with two methods allowed and educonnect AB testing param', () => {
    expect(computeIdentificationMethod(bothMethodsAllowed, IdentityCheckMethod.educonnect)).toEqual(
      educonnectOnTopForkFlow
    )
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
