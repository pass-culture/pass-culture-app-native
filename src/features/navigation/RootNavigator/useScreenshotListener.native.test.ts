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
      'should log analytics with offer_id when user is on %s page',
      (screenName) => {
        onScreenshot({ isFocused: true, name: screenName, params: { id: 1 } })

        expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: screenName, offer_id: 1 })
      }
    )

    it('should log analytics with venue_id when user is on Venue page', () => {
      onScreenshot({ isFocused: true, name: 'Venue', params: { id: 1 } })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: 'Venue', venue_id: 1 })
    })

    it('should log analytics with booking_id when user is on BookingDetails page', () => {
      onScreenshot({ isFocused: true, name: 'BookingDetails', params: { id: 1 } })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({
        from: 'BookingDetails',
        booking_id: 1,
      })
    })

    it('should not log analytics for TabNavigator', () => {
      onScreenshot({ isFocused: true, name: 'TabNavigator' })

      expect(analytics.logScreenshot).not.toHaveBeenCalled()
    })
  })
})
