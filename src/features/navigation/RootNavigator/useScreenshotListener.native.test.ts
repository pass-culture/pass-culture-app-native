import { onScreenshot } from 'features/navigation/RootNavigator/useScreenshotListener'
import { analytics } from 'libs/analytics'

describe('useScreenshotListener()', () => {
  describe('onScreenshot()', () => {
    it('should log analytics when user is on current page', () => {
      onScreenshot({ isFocused: true, name: 'Home' })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: 'Home' })
    })

    it('should not log analytics when user is not on current page', () => {
      onScreenshot({ isFocused: false, name: 'Home' })

      expect(analytics.logScreenshot).not.toHaveBeenCalled()
    })

    it.each(['Offer', 'OfferDescription'])(
      'should log analytics with offerId when user is on %s page',
      (screenName) => {
        onScreenshot({ isFocused: true, name: screenName, params: { id: 1 } })

        expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: screenName, offerId: 1 })
      }
    )

    it('should log analytics with venueId when user is on Venue page', () => {
      onScreenshot({ isFocused: true, name: 'Venue', params: { id: 1 } })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: 'Venue', venueId: 1 })
    })

    it('should log analytics with bookingId when user is on BookingDetails page', () => {
      onScreenshot({ isFocused: true, name: 'BookingDetails', params: { id: 1 } })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({
        from: 'BookingDetails',
        bookingId: 1,
      })
    })

    it('should not log analytics for TabNavigator', () => {
      onScreenshot({ isFocused: true, name: 'TabNavigator' })

      expect(analytics.logScreenshot).not.toHaveBeenCalled()
    })
  })
})
