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
    it('should have all cookies consent refused by default', () => {
      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice.consent).toEqual({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })

    it('should set device ID', () => {
      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice.deviceId).toEqual(deviceId)
    })

    it('should not set choiceDateTime by default', () => {
      const { result } = renderHook(useCookies)
      const { cookiesChoice } = result.current

      expect(cookiesChoice.choiceDatetime).toEqual(undefined)
    })

    it('should write state', () => {
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesChoice } = result.current

      act(() => {
        setCookiesChoice({
          deviceId,
          choiceDatetime: Today,
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
        rerender(1)
      })

      expect(result.current.cookiesChoice).toEqual({
        deviceId,
        choiceDatetime: Today,
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })
  })

  describe('storage', () => {
    it('should write state in the storage', async () => {
      const { result, rerender } = renderHook(useCookies)
      const { setCookiesChoice } = result.current

      act(() => {
        setCookiesChoice({
          deviceId,
          choiceDatetime: Today,
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
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
  })

  // FIXME(LucasBeneston): fix this test
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
      expect(result.current.cookiesChoice).toEqual({
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })
  })
})
