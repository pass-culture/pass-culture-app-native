import { useUserRoleFromOnboarding } from 'features/onboarding/helpers/useUserRoleFromOnboarding'
import { NonEligible, UserOnboardingRole } from 'features/onboarding/types'
import { storage } from 'libs/storage'
import { renderHook, waitFor } from 'tests/utils'

const USER_AGE_KEY = 'user_age'

describe('useUserRoleFromOnboarding', () => {
  beforeEach(() => {
    storage.clear(USER_AGE_KEY)
  })

  it.each([NonEligible.UNDER_15, 15, 16, 17])(
    'should return underage when user is %s',
    async (age) => {
      storage.saveObject(USER_AGE_KEY, age)
      const { result } = renderHook(useUserRoleFromOnboarding)

      await waitFor(() => {
        expect(result.current).toEqual(UserOnboardingRole.UNDERAGE)
      })
    }
  )

  it('should return eighteen when user is 18', async () => {
    storage.saveObject(USER_AGE_KEY, 18)
    const { result } = renderHook(useUserRoleFromOnboarding)

    await waitFor(() => {
      expect(result.current).toEqual(UserOnboardingRole.EIGHTEEN)
    })
  })

  it('should return non eligible when user is over 18', async () => {
    storage.saveObject(USER_AGE_KEY, NonEligible.OVER_18)
    const { result } = renderHook(useUserRoleFromOnboarding)

    await waitFor(() => {
      expect(result.current).toEqual(UserOnboardingRole.NON_ELIGIBLE)
    })
  })

  it('should return unknown when user has not selected an age', async () => {
    const { result } = renderHook(useUserRoleFromOnboarding)

    await waitFor(() => {
      expect(result.current).toEqual(UserOnboardingRole.UNKNOWN)
    })
  })
})
