import { IdentityCheckMethod } from 'api/gen'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { SubscriptionScreen } from 'features/identityCheck/types'

const educonnectFlowFirstScreen: SubscriptionScreen = 'EduConnectForm'
const ubbleFlowFirstScreen: SubscriptionScreen = 'SelectIDOrigin'
const forkScreen: SubscriptionScreen = 'IdentificationFork'

const educonnectOnlyMethod = [IdentityCheckMethod.educonnect]
const ubbleOnlyMethod = [IdentityCheckMethod.ubble]
const bothMethodsAllowed = [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect]

const isUserRegisteredInPacificFrancRegion = true
const isNotUserRegisteredInPacificFrancRegion = false

describe('computeIdentificationMethod', () => {
  describe('bothMethodsAllowed', () => {
    it('should return fork flow with two methods allowed when user is NOT registered in Pacific Franc region', () => {
      expect(
        computeIdentificationMethod(isNotUserRegisteredInPacificFrancRegion, bothMethodsAllowed)
      ).toEqual(forkScreen)
    })

    it('should return ubbleFlowFirstScreen flow with two methods allowed when user is registered in Pacific Franc region', () => {
      expect(
        computeIdentificationMethod(isUserRegisteredInPacificFrancRegion, bothMethodsAllowed)
      ).toEqual(ubbleFlowFirstScreen)
    })
  })

  describe('ubbleOnlyMethod', () => {
    it('should return ubble flow if only ubble method is allowed when user is NOT registered in Pacific Franc region', () => {
      expect(
        computeIdentificationMethod(isNotUserRegisteredInPacificFrancRegion, ubbleOnlyMethod)
      ).toEqual(ubbleFlowFirstScreen)
    })

    it('should return ubble flow if only ubble method is allowed when user is registered in Pacific Franc region', () => {
      expect(
        computeIdentificationMethod(isUserRegisteredInPacificFrancRegion, ubbleOnlyMethod)
      ).toEqual(ubbleFlowFirstScreen)
    })
  })

  describe('educonnectOnlyMethod', () => {
    it('should return educonnect flow if only educonnect method is allowed when user is NOT registered in Pacific Franc region', () => {
      expect(
        computeIdentificationMethod(isNotUserRegisteredInPacificFrancRegion, educonnectOnlyMethod)
      ).toEqual(educonnectFlowFirstScreen)
    })

    it('should return ubbleFlowFirstScreen flow if only educonnect method is allowed when user is registered in Pacific Franc region', () => {
      expect(
        computeIdentificationMethod(isUserRegisteredInPacificFrancRegion, educonnectOnlyMethod)
      ).toEqual(ubbleFlowFirstScreen)
    })
  })

  describe('ubbleFlowFirstScreen', () => {
    it('should return ubble flow by default when user is NOT registered in Pacific Franc region', () => {
      expect(computeIdentificationMethod(isNotUserRegisteredInPacificFrancRegion)).toEqual(
        ubbleFlowFirstScreen
      )
    })

    it('should return ubble flow by default when user is registered in Pacific Franc region', () => {
      expect(computeIdentificationMethod(isUserRegisteredInPacificFrancRegion)).toEqual(
        ubbleFlowFirstScreen
      )
    })
  })
})
