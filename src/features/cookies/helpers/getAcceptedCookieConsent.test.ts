import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookieNameEnum } from 'features/cookies/enums'
import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { storage } from 'libs/storage'
import { renderHook } from 'tests/utils'

const COOKIES_CONSENT_KEY_V2 = 'cookies_consent'

describe('getAcceptedCookieConsent', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY_V2))

  it('should return false if no cookies consent', async () => {
    const { result } = renderHook(() => getAcceptedCookieConsent(CookieNameEnum.APPSFLYER))
    const hasAcceptedCookie = await result.current

    expect(hasAcceptedCookie).toEqual(false)
  })

  it('should return false if user accept specific cookie but not the cookie in function parameter', async () => {
    storage.saveObject(COOKIES_CONSENT_KEY_V2, {
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.marketing, // = CookieNameEnum.APPSFLYER
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      },
    })

    const { result } = renderHook(() => getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS))
    const hasAcceptedCookie = await result.current

    expect(hasAcceptedCookie).toEqual(false)
  })

  it('should return true if user accept specific cookie', async () => {
    storage.saveObject(COOKIES_CONSENT_KEY_V2, {
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.marketing, // = CookieNameEnum.APPSFLYER
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      },
    })

    const { result } = renderHook(() => getAcceptedCookieConsent(CookieNameEnum.APPSFLYER))
    const hasAcceptedCookie = await result.current

    expect(hasAcceptedCookie).toEqual(true)
  })
})
