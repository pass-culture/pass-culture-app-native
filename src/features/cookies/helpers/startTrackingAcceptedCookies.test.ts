import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import {
  generateUTMKeys,
  startTrackingAcceptedCookies,
} from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

jest.mock('features/cookies/helpers/removeGeneratedStorageKey')
const mockRemoveGeneratedStorageKey = removeGeneratedStorageKey as jest.Mock

describe('startTrackingAcceptedCookies', () => {
  it('should disable tracking when refused all cookies', () => {
    startTrackingAcceptedCookies([])

    expect(amplitude.disableCollection).toHaveBeenCalledTimes(1)
    expect(analytics.disableCollection).toHaveBeenCalledTimes(1)
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    expect(Batch.optOut).toHaveBeenCalledTimes(1)
  })

  it('should enable tracking if accepted all cookies', () => {
    startTrackingAcceptedCookies(ALL_OPTIONAL_COOKIES)

    expect(amplitude.enableCollection).toHaveBeenCalledTimes(1)
    expect(analytics.enableCollection).toHaveBeenCalledTimes(1)
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    expect(Batch.optIn).toHaveBeenCalledTimes(1)
  })

  it('should enable Google Analytics when performance cookies are accepted', () => {
    const googleAnalyticsAccepted = COOKIES_BY_CATEGORY.performance
    startTrackingAcceptedCookies(googleAnalyticsAccepted)

    expect(analytics.enableCollection).toHaveBeenCalledTimes(1)
  })

  it('should enable Amplitude when performance cookies are accepted', () => {
    const amplitudeAccepted = COOKIES_BY_CATEGORY.performance
    startTrackingAcceptedCookies(amplitudeAccepted)

    expect(amplitude.enableCollection).toHaveBeenCalledTimes(1)
  })

  it('should init AppsFlyers when marketing cookies are accepted', () => {
    const appsFlyersAccepted = COOKIES_BY_CATEGORY.marketing
    startTrackingAcceptedCookies(appsFlyersAccepted)

    expect(campaignTracker.useInit).toHaveBeenCalledWith(true)
  })

  it('should enable AppsFlyers when marketing cookies are accepted', () => {
    const appsFlyersAccepted = COOKIES_BY_CATEGORY.marketing
    startTrackingAcceptedCookies(appsFlyersAccepted)

    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
  })

  it('should enable Batch when customization cookies are accepted', () => {
    const batchAccepted = COOKIES_BY_CATEGORY.customization
    startTrackingAcceptedCookies(batchAccepted)

    expect(Batch.optIn).toHaveBeenCalledTimes(1)
  })

  it('should disable Amplitude, Batch and Google Analytics when only marketing cookies are accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.marketing)

    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)

    expect(Batch.optOut).toHaveBeenCalledTimes(1)
    expect(amplitude.disableCollection).toHaveBeenCalledTimes(1)
    expect(analytics.disableCollection).toHaveBeenCalledTimes(1)
  })

  it('should not init AppsFlyers when marketing cookies are refused', () => {
    const marketingRefused = [
      ...COOKIES_BY_CATEGORY.performance,
      ...COOKIES_BY_CATEGORY.customization,
    ]
    startTrackingAcceptedCookies(marketingRefused)

    expect(campaignTracker.useInit).toHaveBeenCalledWith(false)
  })

  it('should disable AppsFlyers when marketing cookies are refused', () => {
    const marketingRefused = [
      ...COOKIES_BY_CATEGORY.performance,
      ...COOKIES_BY_CATEGORY.customization,
    ]
    startTrackingAcceptedCookies(marketingRefused)

    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
  })

  it('should remove generate algolia key from localStorage when refused algolia tracking (performance)', () => {
    const performanceRefused = [
      ...COOKIES_BY_CATEGORY.marketing,
      ...COOKIES_BY_CATEGORY.customization,
    ]
    startTrackingAcceptedCookies(performanceRefused)

    expect(mockRemoveGeneratedStorageKey).toHaveBeenNthCalledWith(1, 'algoliasearch-client-js')
  })

  it('should remove generate UTM keys from localStorage when refused customization cookies', () => {
    const customizationRefused = [
      ...COOKIES_BY_CATEGORY.performance,
      ...COOKIES_BY_CATEGORY.marketing,
    ]
    startTrackingAcceptedCookies(customizationRefused)

    generateUTMKeys.forEach((generateKey, index) =>
      expect(mockRemoveGeneratedStorageKey).toHaveBeenNthCalledWith(index + 1, generateKey)
    )
  })
})
