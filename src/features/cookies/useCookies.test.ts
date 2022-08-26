import { allOptionalCookies, COOKIES_BY_CATEGORY } from 'features/cookies/cookiesPolicy'
import { COOKIES_CONSENT_KEY, useCookies } from 'features/cookies/useCookies'
import { storage } from 'libs/storage'
import { act, renderHook } from 'tests/utils'

describe('useCookies', () => {
  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
  })

  describe('read state', () => {
    it.skip('should get cookies state 1', () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })

      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })
    })

    it.skip('should get cookies state 2', () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: allOptionalCookies,
      })

      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: allOptionalCookies,
      })
    })

    it('should have all cookies consent refused by default', () => {
      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: allOptionalCookies,
      })
    })
  })

  describe('write state', () => {
    it('should write state', () => {
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesChoice } = result.current

      act(() => {
        setCookiesChoice({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: allOptionalCookies,
          refused: [],
        })

        rerender(1)
      })

      expect(result.current.cookiesChoice).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })
    })
  })

  describe('save state in storage', () => {
    it('should write state in the storage', async () => {
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesChoice } = result.current

      act(() => {
        setCookiesChoice({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: allOptionalCookies,
          refused: [],
        })

        rerender(1)
      })

      const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)

      expect(cookiesConsent).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })
    })
  })

  describe.skip('restore state from storage', () => {
    it('should restore state from the storage', () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })

      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: allOptionalCookies,
        refused: [],
      })
    })
  })
})
