import mockdate from 'mockdate'
import { QueryObserverSuccessResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { FAKE_USER_ID } from '__mocks__/jwt-decode'
import Package from '__mocks__/package.json'
import { v4 } from '__mocks__/uuid'
import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as TrackingAcceptedCookies from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesConsent } from 'features/cookies/types'
import * as useUserProfileInfoAPI from 'features/profile/api'
import { eventMonitoring } from 'libs/monitoring'
import { UsePersistQueryResult } from 'libs/react-query/usePersistQuery'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

const mockUseUserProfileInfo = jest.spyOn(useUserProfileInfoAPI, 'useUserProfileInfo')
mockUseUserProfileInfo.mockReturnValue({
  data: undefined,
} as UsePersistQueryResult<UserProfileResponse, unknown>)
const mockStartTrackingAcceptedCookies = jest.spyOn(
  TrackingAcceptedCookies,
  'startTrackingAcceptedCookies'
)

const COOKIES_CONSENT_KEY = 'cookies_consent'
const deviceId = 'testUuidV4'
const TODAY = new Date(2022, 9, 29)
const YESTERDAY = new Date(2022, 9, 28)
mockdate.set(TODAY)

jest.mock('api/api')

describe('useCookies', () => {
  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
  })

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
        buildVersion: Package.build,
        deviceId,
        choiceDatetime: TODAY.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })

    it('should restore cookies consent from the storage', async () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion: Package.build,
        deviceId,
        choiceDatetime: TODAY,
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

    it('should start tracking accepted cookies when consent is already in storage', async () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion: Package.build,
        deviceId,
        choiceDatetime: TODAY,
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })

      renderHook(useCookies)

      await waitFor(() => {
        expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith(ALL_OPTIONAL_COOKIES)
      })
    })

    it('should update date when call setCookiesConsent is called', async () => {
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        deviceId,
        choiceDatetime: YESTERDAY,
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
      const { result } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      await act(async () => {
        await setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [],
          refused: ALL_OPTIONAL_COOKIES,
        })
      })

      const cookiesConsent = await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)
      expect(cookiesConsent?.choiceDatetime).toEqual(TODAY.toISOString())
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
          buildVersion: Package.build,
          userId: FAKE_USER_ID,
          deviceId,
          choiceDatetime: TODAY.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })

      it('can set user ID before giving cookies consent', async () => {
        mockUseUserProfileInfo.mockReturnValueOnce({
          data: { id: FAKE_USER_ID } as UserProfileResponse,
        } as QueryObserverSuccessResult<UserProfileResponse, unknown>)
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
          buildVersion: Package.build,
          userId: FAKE_USER_ID,
          deviceId,
          choiceDatetime: TODAY.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })

      it("don't store user ID when user has not give his cookie consent", async () => {
        const { result } = renderHook(useCookies)
        const { setUserId } = result.current

        await act(async () => {
          await setUserId(FAKE_USER_ID)
        })

        const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)
        expect(cookiesConsent).toBeNull()
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
          buildVersion: Package.build,
          userId: secondUserId,
          deviceId,
          choiceDatetime: TODAY.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })
    })
  })

  describe('log API', () => {
    it('should persist cookies consent', async () => {
      const { result } = renderHook(useCookies)
      const { setCookiesConsent } = result.current

      await act(async () => {
        await setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
      })

      await waitForExpect(() => {
        expect(api.postnativev1cookiesConsent).toHaveBeenCalledWith({
          deviceId,
          choiceDatetime: TODAY.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })
    })

    it('should persist user ID', async () => {
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

      await waitForExpect(() => {
        expect(api.postnativev1cookiesConsent).toHaveBeenCalledWith({
          userId: FAKE_USER_ID,
          deviceId,
          choiceDatetime: TODAY.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })
    })

    it('should not log cookies consent choice when user logs in with same account', async () => {
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

      await act(async () => {
        await setUserId(FAKE_USER_ID)
      })

      const SET_COOKIE_CONSENT = 1
      const SET_USER_ID_AFTERLOGIN = 1
      const API_CALLED_TIMES = SET_COOKIE_CONSENT + SET_USER_ID_AFTERLOGIN
      expect(api.postnativev1cookiesConsent).toBeCalledTimes(API_CALLED_TIMES)
    })

    describe('when can not log cookies consent choice', () => {
      beforeEach(() => {
        ;(
          api.postnativev1cookiesConsent as jest.MockedFunction<
            typeof api.postnativev1cookiesConsent
          >
        ).mockRejectedValueOnce(new Error('unknown network error'))
      })

      it('should not throw errors', async () => {
        const { result } = renderHook(useCookies)
        const { setCookiesConsent } = result.current

        let promise
        act(() => {
          promise = setCookiesConsent({
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          })
        })

        await expect(promise).resolves.toBeUndefined()
      })

      it('should notify sentry', async () => {
        const { result } = renderHook(useCookies)
        const { setCookiesConsent } = result.current

        await act(async () => {
          await setCookiesConsent({
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          })
        })

        expect(eventMonitoring.captureException).toHaveBeenCalledWith(
          new Error("can't log cookies consent choice")
        )
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
      buildVersion: Package.build,
      deviceId: 'testUuidV4-first',
      choiceDatetime: TODAY.toISOString(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      },
    })
  })
})
