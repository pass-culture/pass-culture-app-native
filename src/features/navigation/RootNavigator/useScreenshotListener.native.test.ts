import { onScreenshot } from 'features/navigation/RootNavigator/useScreenshotListener'
import { analytics } from 'libs/analytics'

describe('useScreenshotListener()', () => {
  describe('onScreenshot()', () => {
    it('should log analytics when user is on current page', () => {
      onScreenshot({ isFocused: true, name: 'Home' })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: 'Home', id: undefined })
    })

    it('should not log analytics when user is not on current page', () => {
      onScreenshot({ isFocused: false, name: 'Home' })

      expect(analytics.logScreenshot).not.toHaveBeenCalled()
    })

    it('should log analytics with id when user is on current page with id parameter', () => {
      onScreenshot({ isFocused: true, name: 'Offer', params: { id: 1 } })

      expect(analytics.logScreenshot).toHaveBeenCalledWith({ from: 'Offer', id: 1 })
    })

    it('should not log analytics for TabNavigator', () => {
      onScreenshot({ isFocused: true, name: 'TabNavigator' })

      expect(analytics.logScreenshot).not.toHaveBeenCalled()
    })
  })
})
