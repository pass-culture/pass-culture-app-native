import { getShouldDisplayTab } from '../helpers'

describe('<TabNavigator />', () => {
  describe('getShouldDisplayTab()', () => {
    it('should display "Bookings" icon for authenticated and beneficiary users', () => {
      const shouldDisplayTab = getShouldDisplayTab({ isLoggedIn: true, isBeneficiary: true })

      expect(shouldDisplayTab('Bookings')).toBe(true)
    })

    it.each<[boolean, boolean]>([
      [true, false],
      [false, true],
      [false, false],
    ])('should NOT display "Bookings" icon', (isLoggedIn, isBeneficiary) => {
      const shouldDisplayTab = getShouldDisplayTab({ isLoggedIn, isBeneficiary })

      expect(shouldDisplayTab('Bookings')).toBe(false)
    })
  })
})
