import mockdate from 'mockdate'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { COOKIES_CONSENT_KEY, useCookies } from 'features/cookies/useCookies'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

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
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      act(() => {
        setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
        rerender(1)
      })

      expect(result.current.cookiesConsent).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })

    it('should write state 2 drop me', () => {
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      act(() => {
        setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [],
          refused: ALL_OPTIONAL_COOKIES,
        })
        rerender(1)
      })

      expect(result.current.cookiesConsent).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })
  })

  describe('storage', () => {
    it('should write state in the storage', async () => {
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      act(() => {
        setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
        rerender(1)
      })

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

    it('should restore state from the storage', async () => {
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
})
