import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookieNameEnum } from 'features/cookies/enums'
import { COOKIES_CONSENT_KEY } from 'features/cookies/helpers/cookiesConsentKey'
import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { storage } from 'libs/storage'

jest.mock('libs/firebase/analytics/analytics')

describe('getAcceptedCookieConsent', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  it('should return false if no cookies consent', async () => {
    const hasAcceptedCookie = await getAcceptedCookieConsent(CookieNameEnum.ADJUST)

    expect(hasAcceptedCookie).toEqual(false)
  })

  it('should return false if user accept specific cookie but not the cookie in function parameter', async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, {
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.marketing,
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      },
    })

    const hasAcceptedCookie = await getAcceptedCookieConsent(CookieNameEnum.ALGOLIA_INSIGHTS)

    expect(hasAcceptedCookie).toEqual(false)
  })

  it('should return true if user accept specific cookie', async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, {
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.marketing,
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      },
    })

    const hasAcceptedCookie = await getAcceptedCookieConsent(CookieNameEnum.ADJUST)

    expect(hasAcceptedCookie).toEqual(true)
  })
})
