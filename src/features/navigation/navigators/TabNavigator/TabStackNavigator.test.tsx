import { getShouldDisplayTab } from '../../TabBar/helpers'

describe('<TabNavigator />', () => {
  describe('getShouldDisplayTab()', () => {
    describe('when the general public home is not displayed', () => {
      it('should display "Bookings" icon for authenticated and beneficiary users', () => {
        const shouldDisplayTab = getShouldDisplayTab({
          isLoggedIn: true,
          isBeneficiary: true,
          shouldDisplayGeneralPublicHome: false,
        })

        expect(shouldDisplayTab('Bookings')).toBe(true)
      })

      it.each<[boolean, boolean]>([
        [true, false],
        [false, true],
        [false, false],
      ])('should NOT display "Bookings" icon', (isLoggedIn, isBeneficiary) => {
        const shouldDisplayTab = getShouldDisplayTab({
          isLoggedIn,
          isBeneficiary,
          shouldDisplayGeneralPublicHome: false,
        })

        expect(shouldDisplayTab('Bookings')).toBe(false)
      })

      it.each(['Home', 'SearchStackNavigator', 'Favorites', 'Profile'] as const)(
        'should display "%s" icon',
        (tab) => {
          const shouldDisplayTab = getShouldDisplayTab({
            isLoggedIn: true,
            isBeneficiary: true,
            shouldDisplayGeneralPublicHome: false,
          })

          expect(shouldDisplayTab(tab)).toBe(true)
        }
      )

      it('should NOT display "AroundMe" icon', () => {
        const shouldDisplayTab = getShouldDisplayTab({
          isLoggedIn: true,
          isBeneficiary: true,
          shouldDisplayGeneralPublicHome: false,
        })

        expect(shouldDisplayTab('AroundMe')).toBe(false)
      })
    })

    describe('when the general public home is displayed', () => {
      it.each(['Home', 'AroundMe', 'Profile'] as const)('should display "%s" icon', (tab) => {
        const shouldDisplayTab = getShouldDisplayTab({
          isLoggedIn: false,
          isBeneficiary: false,
          shouldDisplayGeneralPublicHome: true,
        })

        expect(shouldDisplayTab(tab)).toBe(true)
      })

      it.each(['SearchStackNavigator', 'Bookings', 'Favorites'] as const)(
        'should NOT display "%s" icon',
        (tab) => {
          const shouldDisplayTab = getShouldDisplayTab({
            isLoggedIn: true,
            isBeneficiary: false,
            shouldDisplayGeneralPublicHome: true,
          })

          expect(shouldDisplayTab(tab)).toBe(false)
        }
      )
    })
  })
})
