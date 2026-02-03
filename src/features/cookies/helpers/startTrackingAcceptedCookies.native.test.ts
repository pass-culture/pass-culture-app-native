/* eslint-disable no-restricted-imports */
import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookieNameEnum } from 'features/cookies/enums'
import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import {
  generateUTMKeys,
  startTrackingAcceptedCookies,
} from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { Adjust } from 'libs/adjust/adjust'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { Batch, BatchPush } from 'libs/react-native-batch'

jest.mock('features/cookies/helpers/removeGeneratedStorageKey')
const mockRemoveGeneratedStorageKey = removeGeneratedStorageKey as jest.Mock

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/adjust/adjust')

describe('startTrackingAcceptedCookies', () => {
  it('should enable Google Analytics when Google Analytics cookies are accepted', () => {
    startTrackingAcceptedCookies([CookieNameEnum.GOOGLE_ANALYTICS], true)

    expect(firebaseAnalytics.enableCollection).toHaveBeenCalledTimes(1)
  })

  it('should disable Google Analytics when Google Analytics cookies are not accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.essential, true)

    expect(firebaseAnalytics.disableCollection).toHaveBeenCalledTimes(1)
  })

  it('should enable Adjust with true when Adjust cookies are accepted and calledBecauseOfNewConsents is true', () => {
    startTrackingAcceptedCookies([CookieNameEnum.ADJUST], true)

    expect(Adjust.initOrEnable).toHaveBeenCalledWith(true)
  })

  it('should enable Adjust with false when Adjust cookies are accepted and calledBecauseOfNewConsents is false', () => {
    startTrackingAcceptedCookies([CookieNameEnum.ADJUST], false)

    expect(Adjust.initOrEnable).toHaveBeenCalledWith(false)
  })

  it('should disable Adjust when Adjust cookies are not accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.essential, true)

    expect(Adjust.disable).toHaveBeenCalledTimes(1)
  })

  it('should enable Batch when Batch cookies are accepted', () => {
    startTrackingAcceptedCookies([CookieNameEnum.BATCH], true)

    expect(Batch.optIn).toHaveBeenCalledTimes(1)
  })

  it('should request notification authorization when Batch cookies are accepted and calledBecauseOfNewConsents is true', async () => {
    startTrackingAcceptedCookies([CookieNameEnum.BATCH], true)

    expect(BatchPush.requestNotificationAuthorization).toHaveBeenCalledTimes(1)
  })

  it('should not request notification authorization when Batch cookies are accepted and calledBecauseOfNewConsents is false', async () => {
    startTrackingAcceptedCookies([CookieNameEnum.BATCH], false)

    expect(BatchPush.requestNotificationAuthorization).not.toHaveBeenCalled()
  })

  it('should disable Batch and not request notification authorization when Batch cookies are not accepted', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.essential, true)

    expect(Batch.optOut).toHaveBeenCalledTimes(1)
    expect(BatchPush.requestNotificationAuthorization).not.toHaveBeenCalled()
  })

  it('should remove generate algolia key from localStorage when refused algolia tracking (performance)', () => {
    startTrackingAcceptedCookies(COOKIES_BY_CATEGORY.essential, true)

    expect(mockRemoveGeneratedStorageKey).toHaveBeenNthCalledWith(1, 'algoliasearch-client-js')
  })

  it('should remove generate UTM keys from localStorage when refused UTM cookies', () => {
    startTrackingAcceptedCookies(
      [...COOKIES_BY_CATEGORY.essential, ...COOKIES_BY_CATEGORY.performance],
      true
    )

    generateUTMKeys.forEach((generateKey, index) =>
      expect(mockRemoveGeneratedStorageKey).toHaveBeenNthCalledWith(index + 1, generateKey)
    )
  })
})
