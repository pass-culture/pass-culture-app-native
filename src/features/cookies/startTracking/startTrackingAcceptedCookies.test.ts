import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { startTrackingAcceptedCookies } from 'features/cookies/startTracking/startTrackingAcceptedCookies'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'

const mockDisableAmplitudeCollection = jest.fn()
const mockEnableAmplitudeCollection = jest.fn()

jest.mock('libs/amplitude', () => ({
  amplitude: () => ({
    disableCollection: mockDisableAmplitudeCollection,
    enableCollection: mockEnableAmplitudeCollection,
  }),
}))

describe('startTrackingAcceptedCookies', () => {
  it('should disable tracking if refused all cookies', () => {
    startTrackingAcceptedCookies([])

    expect(mockDisableAmplitudeCollection).toHaveBeenCalled()
    expect(analytics.disableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
  })

  it('should enable tracking if accepted all cookies', () => {
    startTrackingAcceptedCookies(ALL_OPTIONAL_COOKIES)

    expect(mockEnableAmplitudeCollection).toHaveBeenCalled()
    expect(analytics.enableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
  })

  it('should enabled Google Analytics if performance cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.performance) // with Google Analytics

    expect(analytics.enableCollection).toHaveBeenCalled()
  })

  it('should enabled Amplitude if performance cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.performance) // with Amplitude

    expect(mockEnableAmplitudeCollection).toHaveBeenCalled()
  })

  it('should enabled AppsFlyers if marketing cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.marketing) // with AppsFlyers

    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
  })
})
