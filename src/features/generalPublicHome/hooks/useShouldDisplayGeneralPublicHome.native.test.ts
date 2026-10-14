import { useShouldDisplayGeneralPublicHome } from 'features/generalPublicHome/hooks/useShouldDisplayGeneralPublicHome'
import {
  beneficiaryUser,
  exBeneficiaryUser,
  nonBeneficiaryUser,
  underageBeneficiaryUser,
} from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

describe('useShouldDisplayGeneralPublicHome', () => {
  describe('when the feature flag is off', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should return false for a signed out user', () => {
      mockAuthContextWithoutUser({ persist: true })

      const { result } = renderHook(() => useShouldDisplayGeneralPublicHome())

      expect(result.current).toBe(false)
    })

    it('should return false for a signed in non beneficiary user', () => {
      mockAuthContextWithUser(nonBeneficiaryUser, { persist: true })

      const { result } = renderHook(() => useShouldDisplayGeneralPublicHome())

      expect(result.current).toBe(false)
    })
  })

  describe('when the feature flag is on', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_GENERAL_PUBLIC_HOME])
    })

    it('should return true for a signed out user', () => {
      mockAuthContextWithoutUser({ persist: true })

      const { result } = renderHook(() => useShouldDisplayGeneralPublicHome())

      expect(result.current).toBe(true)
    })

    it.each([
      ['a non beneficiary user', nonBeneficiaryUser],
      ['an underage user whose credit is not active', underageBeneficiaryUser],
    ])('should return true for %s', (_label, user) => {
      mockAuthContextWithUser(user, { persist: true })

      const { result } = renderHook(() => useShouldDisplayGeneralPublicHome())

      expect(result.current).toBe(true)
    })

    it.each([
      ['a current beneficiary user', beneficiaryUser],
      ['a former beneficiary user', exBeneficiaryUser],
    ])('should return false for %s', (_label, user) => {
      mockAuthContextWithUser(user, { persist: true })

      const { result } = renderHook(() => useShouldDisplayGeneralPublicHome())

      expect(result.current).toBe(false)
    })
  })
})
