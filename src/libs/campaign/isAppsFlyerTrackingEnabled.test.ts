import mockdate from 'mockdate'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { storage } from 'libs/storage'
import { act, flushAllPromisesWithAct, renderHook } from 'tests/utils'

import { isAppsFlyerTrackingEnabled } from './isAppsFlyerTrackingEnabled'

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)

describe('isAppsFlyerTrackingEnabled', () => {
  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
  })

  it('should return false when user has not made consent', async () => {
    storage.saveObject(COOKIES_CONSENT_KEY, {})

    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBeFalsy()
  })

  it('should return true when all cookies are accepted', async () => {
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })
    await flushAllPromisesWithAct()
    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBeTruthy()
  })

  it('should return false when all cookies are refused', async () => {
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })
    await flushAllPromisesWithAct()
    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBeFalsy()
  })

  it('should return true when marketing cookies are accepted', async () => {
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.marketing,
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      })
    })
    await flushAllPromisesWithAct()
    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBeTruthy()
  })
})
