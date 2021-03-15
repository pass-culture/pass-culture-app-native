import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/AuthContext'

import { shouldDisplayTabIconPredicate } from '../helpers'
import { TabRoute } from '../types'

describe('TabNavigator', () => {
  describe('shouldDisplayTabIconPredicate', () => {
    it('should display "Bookings" icon for authenticated and beneficiary users', () => {
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
    ])('should display "Bookings" icon for others users', (isLoggedIn, isBeneficiary) => {
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
