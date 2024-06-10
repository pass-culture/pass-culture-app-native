import mockdate from 'mockdate'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { EmptyResponse } from 'libs/fetch'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { isAppsFlyerTrackingEnabled } from './isAppsFlyerTrackingEnabled'

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)

jest.mock('libs/firebase/analytics/analytics')

describe('isAppsFlyerTrackingEnabled', () => {
  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
  })

  it('should return false when user has not made consent', async () => {
    storage.saveObject(COOKIES_CONSENT_KEY, {})

    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBe(false)
  })

  it('should return true when all cookies are accepted', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    const { result } = renderUseCookies()
    const { setCookiesConsent } = result.current

    await act(async () => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })
    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBe(true)
  })

  it('should return false when all cookies are refused', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    const { result } = renderUseCookies()
    const { setCookiesConsent } = result.current

    await act(async () => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })

    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBe(false)
  })

  it('should return true when marketing cookies are accepted', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    const { result } = renderUseCookies()
    const { setCookiesConsent } = result.current

    await act(async () => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.marketing,
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.performance],
      })
    })

    const enabled = await isAppsFlyerTrackingEnabled()

    expect(enabled).toBe(true)
  })
})

const renderUseCookies = () =>
  renderHook(useCookies, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
