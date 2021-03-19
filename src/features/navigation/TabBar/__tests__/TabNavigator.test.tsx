import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'

import { shouldDisplayTabIconPredicate } from '../helpers'
import { TabRoute } from '../types'

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING: false,
  },
}))

describe('TabNavigator', () => {
  describe('shouldDisplayTabIconPredicate', () => {
    it('should display "Bookings" icon for authenticated and beneficiary users', () => {
      env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
      const shouldDisplayFunction = shouldDisplayTabIconPredicate(
        { isLoggedIn: true } as IAuthContext,
        {
          isBeneficiary: true,
        } as UserProfileResponse
      )

      const shouldDisplay = shouldDisplayFunction({ name: 'Bookings' } as TabRoute)

      expect(shouldDisplay).toBe(true)
    })
    it.each<[boolean, boolean]>([
      [true, false],
      [false, true],
      [false, false],
      [true, true],
    ])('should NOT display "Bookings" icon ', (isLoggedIn, isBeneficiary) => {
      env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
      const shouldDisplayFunction = shouldDisplayTabIconPredicate(
        { isLoggedIn } as IAuthContext,
        {
          isBeneficiary,
        } as UserProfileResponse
      )

      const shouldDisplay = shouldDisplayFunction({ name: 'Bookings' } as TabRoute)

      expect(shouldDisplay).toBe(false)
    })
  })
})
