import mockdate from 'mockdate'

import { FAKE_USER_ID } from '__mocks__/jwt-decode'
import { v4 } from '__mocks__/uuid'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

const COOKIES_CONSENT_KEY = 'cookies_consent'
const deviceId = 'testUuidV4'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)

jest.mock('api/api')

describe('useCookies', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  describe('state', () => {
    it('should be undefined by default', () => {
      const { result } = renderHook(useCookies)
      const { cookiesConsent } = result.current

      expect(cookiesConsent).toBeUndefined()
    })

    it('should write state', async () => {
      const { result } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      await act(async () => {
        await setCookiesConsent({
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

      await act(async () => {
        await setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
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

    describe('user ID', () => {
      it('can set user ID', async () => {
        const { result } = renderHook(useCookies)
        const { setCookiesConsent, setUserId } = result.current
        await act(async () => {
          await setCookiesConsent({
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          })
        })

        await act(async () => {
          await setUserId(FAKE_USER_ID)
        })

        const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)
        expect(cookiesConsent).toEqual({
          userId: FAKE_USER_ID,
          deviceId,
          choiceDatetime: Today.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })

      it('can set user ID before giving cookies consent', async () => {
        const { result } = renderHook(useCookies)
        const { setCookiesConsent, setUserId } = result.current
        await act(async () => {
          await setUserId(FAKE_USER_ID)
        })

        await act(async () => {
          await setCookiesConsent({
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          })
        })

        const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)
        expect(cookiesConsent).toEqual({
          userId: FAKE_USER_ID,
          deviceId,
          choiceDatetime: Today.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })

      it('should overwrite user ID when setting another user ID', async () => {
        const { result } = renderHook(useCookies)
        const { setCookiesConsent, setUserId } = result.current
        await act(async () => {
          await setCookiesConsent({
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          })
        })

        await act(async () => {
          await setUserId(FAKE_USER_ID)
        })

        const secondUserId = 5678
        await act(async () => {
          await setUserId(secondUserId)
        })

        const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)
        expect(cookiesConsent).toEqual({
          userId: secondUserId,
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

  it('should set once device ID per device', async () => {
    v4.mockReturnValueOnce('testUuidV4-first')
    v4.mockReturnValueOnce('testUuidV4-second')
    const { result } = renderHook(useCookies)
    const { setCookiesConsent } = result.current

    await act(async () => {
      await setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
      await setCookiesConsent({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })

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
