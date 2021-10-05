import { shouldDisplayTabIconPredicate } from '../helpers'

describe('TabNavigator', () => {
  describe('shouldDisplayTabIconPredicate', () => {
    it('should display "Bookings" icon for authenticated and beneficiary users', () => {
      const isLoggedIn = true
      const isBeneficiary = true
      const shouldDisplayFunction = shouldDisplayTabIconPredicate(isLoggedIn, isBeneficiary)
      expect(shouldDisplayFunction('Bookings')).toBe(true)
    })

    it.each<[boolean, boolean]>([
      [true, false],
      [false, true],
      [false, false],
    ])('should NOT display "Bookings" icon ', (isLoggedIn, isBeneficiary) => {
      const shouldDisplayFunction = shouldDisplayTabIconPredicate(isLoggedIn, isBeneficiary)
      const shouldDisplay = shouldDisplayFunction('Bookings')
      expect(shouldDisplay).toBe(false)
    })
  })
})
