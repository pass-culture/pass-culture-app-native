import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'

import { shouldDisplayTabIconPredicate } from '../helpers'
import { TabRoute } from '../types'

jest.mock('libs/environment', () => ({
  env: {
    SHOULD_DISPLAY_BOOKINGS_TAB: false,
  },
}))

describe('TabNavigator', () => {
  describe('shouldDisplayTabIconPredicate', () => {
    it('should display "Bookings" icon for authenticated and beneficiary users', () => {
      env.SHOULD_DISPLAY_BOOKINGS_TAB = true
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
      env.SHOULD_DISPLAY_BOOKINGS_TAB = false
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
