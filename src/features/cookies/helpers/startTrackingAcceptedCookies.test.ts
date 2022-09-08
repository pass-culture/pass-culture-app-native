import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { startTrackingAcceptedCookies } from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

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
    expect(Batch.optOut).toHaveBeenCalled()
  })

  it('should enable tracking if accepted all cookies', () => {
    startTrackingAcceptedCookies(ALL_OPTIONAL_COOKIES)

    expect(mockEnableAmplitudeCollection).toHaveBeenCalled()
    expect(analytics.enableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    expect(Batch.optIn).toHaveBeenCalled()
  })

  it('should enable Google Analytics if performance cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.performance) // with Google Analytics

    expect(analytics.enableCollection).toHaveBeenCalled()
  })

  it('should enable Amplitude if performance cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.performance) // with Amplitude

    expect(mockEnableAmplitudeCollection).toHaveBeenCalled()
  })

  it('should enable AppsFlyers if marketing cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.marketing) // with AppsFlyers

    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
  })

  it('should enable Batch if customization cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.customization) // with Batch

    expect(Batch.optIn).toHaveBeenCalled()
  })

  it('should disable Amplitude, Batch and Google Analytics if only marketing cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.marketing) // without Amplitude, Batch and Google Analytics

    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)

    expect(Batch.optOut).toHaveBeenCalled()
    expect(mockDisableAmplitudeCollection).toHaveBeenCalled()
    expect(analytics.disableCollection).toHaveBeenCalled()
  })
})
