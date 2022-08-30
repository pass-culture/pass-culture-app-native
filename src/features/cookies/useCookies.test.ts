import mockdate from 'mockdate'

import { v4 } from '__mocks__/uuid'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/useCookies'
import { storage } from 'libs/storage'
import { act, flushAllPromisesWithAct, renderHook, waitFor } from 'tests/utils'

const COOKIES_CONSENT_KEY = 'cookies_consent'
const deviceId = 'testUuidV4'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)

describe('useCookies', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  describe('state', () => {
    it('should be undefined by default', () => {
      const { result } = renderHook(useCookies)
      const { cookiesConsent } = result.current

      expect(cookiesConsent).toBeUndefined()
    })

    it('should write state', () => {
      const { result } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      act(() => {
        setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
      })

      expect(result.current.cookiesConsent).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })
  })

  describe('storage', () => {
    it('should save cookies consent in the storage', async () => {
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

      const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)
      expect(cookiesConsent).toEqual({
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })

    it('should restore cookies consent from the storage', async () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        deviceId,
        choiceDatetime: Today,
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })

      const { result } = renderHook(useCookies)

      await waitFor(() => {
        expect(result.current.cookiesConsent).toEqual({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
      })
    })
  })

  it('should set once device ID per device', async () => {
    v4.mockReturnValueOnce('testUuidV4-first')
    v4.mockReturnValueOnce('testUuidV4-second')
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    act(() => {
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
      setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })
    await flushAllPromisesWithAct()

    const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)
    expect(cookiesConsent).toEqual({
      deviceId: 'testUuidV4-first',
      choiceDatetime: Today.toISOString(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      },
    })
  })
})
