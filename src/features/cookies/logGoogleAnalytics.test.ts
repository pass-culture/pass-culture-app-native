import { ALL_OPTIONAL_COOKIES, Cookies, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { logGoogleAnalytics } from 'features/cookies/logGoogleAnalytics'
import { analytics } from 'libs/firebase/analytics'
import { renderHook } from 'tests/utils'

let acceptedCookies: Cookies = []

describe('logGoogleAnalytics', () => {
  it('should disable Google Analytics when user not refused all cookies', () => {
    renderHook(() => logGoogleAnalytics(acceptedCookies))
    expect(analytics.disableCollection).toHaveBeenCalled()
  })

  it('should disable Google Analytics when user accepted cookies but not Google Analytics', () => {
    acceptedCookies = COOKIES_BY_CATEGORY.marketing // without Google Analytics
    renderHook(() => logGoogleAnalytics(acceptedCookies))
    expect(analytics.disableCollection).toHaveBeenCalled()
  })

  it('should enable Google Analytics when user accepted all cookies', () => {
    acceptedCookies = ALL_OPTIONAL_COOKIES
    renderHook(() => logGoogleAnalytics(acceptedCookies))
    expect(analytics.enableCollection).toHaveBeenCalled()
  })
})
