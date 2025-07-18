import mockdate from 'mockdate'

import { api } from 'api/api'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import * as TrackingAcceptedCookies from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { CookiesConsent } from 'features/cookies/types'
import { FAKE_USER_ID } from 'fixtures/fakeUserId'
import { beneficiaryUser } from 'fixtures/user'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { eventMonitoring } from 'libs/monitoring/services'
import * as PackageJson from 'libs/packageJson'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'
import { storage } from 'libs/storage'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const buildVersion = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

jest.mock('libs/campaign')
jest.mock('libs/monitoring/services')
jest.mock('libs/react-native-device-info/getDeviceId')

jest.mock('features/auth/context/AuthContext')
const mockGetDeviceId = getDeviceId as jest.Mock

const mockStartTrackingAcceptedCookies = jest.spyOn(
  TrackingAcceptedCookies,
  'startTrackingAcceptedCookies'
)

const COOKIES_CONSENT_KEY = 'cookies'
const deviceId = 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a'
const TODAY = new Date('2022-09-29')
const YESTERDAY = new Date('2022-09-28')
const EXACTLY_SIX_MONTHS_AGO = new Date('2022-03-29')
mockdate.set(TODAY)

jest.mock('api/api')

jest.mock('libs/firebase/analytics/analytics')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

//TODO(PC-36587): unskip this test
describe.skip('useCookies', () => {
  beforeAll(() => {
    mockAuthContextWithoutUser({ persist: true })
  })

  beforeEach(() => {
    storage.clear(COOKIES_CONSENT_KEY)
  })

  describe('state', () => {
    it('should be undefined by default', async () => {
      const { result } = renderUseCookies()
      const { cookiesConsent } = result.current

      await act(() => {})

      expect(cookiesConsent).toEqual({ state: ConsentState.LOADING })
    })

    it('should write state', async () => {
      const { result } = renderUseCookies()

      await act(async () => {
        await result.current.setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
        await result.current.setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
      })

      await waitFor(() => {
        expect(result.current.cookiesConsent).toEqual({
          state: ConsentState.HAS_CONSENT,
          value: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          },
        })
      })
    })
  })

  describe('storage', () => {
    it('should not start tracking accepted cookies if only userId is already in storage', async () => {
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        userId: FAKE_USER_ID,
      })

      renderUseCookies()
      await act(async () => {})

      expect(mockStartTrackingAcceptedCookies).not.toHaveBeenCalled()
    })

    it('should save cookies consent in the storage', async () => {
      const { result } = renderUseCookies()
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
        buildVersion,
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
      await storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion,
        deviceId,
        choiceDatetime: TODAY.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })

      const { result } = renderUseCookies()

      await act(async () => {})

      expect(result.current.cookiesConsent).toEqual({
        state: ConsentState.HAS_CONSENT,
        value: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })

    it('should start tracking accepted cookies when consent is already in storage', async () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        buildVersion,
        deviceId,
        choiceDatetime: TODAY.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })

      renderUseCookies()

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
      const { result } = renderUseCookies()
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

    it('should clear consent and choice date when user has made choice 6 months ago', async () => {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        userId: FAKE_USER_ID,
        deviceId,
        choiceDatetime: EXACTLY_SIX_MONTHS_AGO.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })

      renderUseCookies()

      await waitFor(async () => {
        const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)

        expect(cookiesConsent).toEqual({
          userId: FAKE_USER_ID,
          deviceId,
        })
      })
    })

    describe('user ID', () => {
      it('can set user ID', async () => {
        const { result } = renderUseCookies()
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
          buildVersion,
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
        mockAuthContextWithUser({ ...beneficiaryUser, id: FAKE_USER_ID })
        const { result } = renderUseCookies()
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
          buildVersion,
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

      it('store user ID when user has not give his cookie consent with no consent', async () => {
        const { result } = renderUseCookies()
        const { setUserId } = result.current

        await act(async () => {
          await setUserId(FAKE_USER_ID)
        })

        const cookiesConsent = await storage.readObject(COOKIES_CONSENT_KEY)

        expect(cookiesConsent).toEqual({
          buildVersion,
          userId: FAKE_USER_ID,
          deviceId,
        })
      })

      it('dont send user consent when user not give cookies consent', async () => {
        const { result } = renderUseCookies()
        const { setUserId } = result.current

        await act(async () => {
          await setUserId(FAKE_USER_ID)
        })

        expect(api.postNativeV1CookiesConsent).not.toHaveBeenCalled()
      })

      it('should overwrite user ID when setting another user ID', async () => {
        const { result } = renderUseCookies()
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
          buildVersion,
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
      const { result } = renderUseCookies()
      const { setCookiesConsent } = result.current

      await act(async () => {
        await setCookiesConsent({
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        })
      })

      expect(api.postNativeV1CookiesConsent).toHaveBeenCalledWith({
        deviceId,
        choiceDatetime: TODAY.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })

    it('should persist user ID', async () => {
      const { result } = renderUseCookies()
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

      expect(api.postNativeV1CookiesConsent).toHaveBeenCalledWith({
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

    it('should not log cookies consent choice when user logs in with same account', async () => {
      const { result } = renderUseCookies()
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

      expect(api.postNativeV1CookiesConsent).toHaveBeenCalledTimes(API_CALLED_TIMES)
    })

    describe('when can not log cookies consent choice', () => {
      const error = new Error('unknown network error')

      beforeEach(() => {
        ;(
          api.postNativeV1CookiesConsent as jest.MockedFunction<
            typeof api.postNativeV1CookiesConsent
          >
        ).mockRejectedValueOnce(error)
      })

      it('should not throw errors', async () => {
        const { result } = renderUseCookies()
        const { setCookiesConsent } = result.current

        let promise
        await act(async () => {
          promise = setCookiesConsent({
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: ALL_OPTIONAL_COOKIES,
            refused: [],
          })
        })

        await expect(promise).resolves.toBeUndefined()
      })

      describe('When shouldLogInfo remote config is false', () => {
        beforeAll(() => {
          useRemoteConfigSpy.mockReturnValue({
            ...DEFAULT_REMOTE_CONFIG,
            shouldLogInfo: false,
          })
        })

        it('should not notify sentry', async () => {
          const { result } = renderUseCookies()
          const { setCookiesConsent } = result.current

          await act(async () => {
            await setCookiesConsent({
              mandatory: COOKIES_BY_CATEGORY.essential,
              accepted: ALL_OPTIONAL_COOKIES,
              refused: [],
            })
          })

          expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
        })
      })

      describe('When shouldLogInfo remote config is true', () => {
        beforeAll(() => {
          useRemoteConfigSpy.mockReturnValue({
            ...DEFAULT_REMOTE_CONFIG,
            shouldLogInfo: true,
          })
        })

        afterAll(() => {
          useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
        })

        it('should notify sentry', async () => {
          const { result } = renderUseCookies()
          const { setCookiesConsent } = result.current

          await act(async () => {
            await setCookiesConsent({
              mandatory: COOKIES_BY_CATEGORY.essential,
              accepted: ALL_OPTIONAL_COOKIES,
              refused: [],
            })
          })

          expect(eventMonitoring.captureException).toHaveBeenCalledWith(
            `can‘t log cookies consent choice ; reason: "unknown network error"`,
            { level: 'info', extra: { error } }
          )
        })
      })
    })
  })

  it('should set once device ID per device', async () => {
    mockGetDeviceId.mockReturnValueOnce('device-id-first')
    mockGetDeviceId.mockReturnValueOnce('device-id-second')
    const { result } = renderUseCookies()
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
      buildVersion,
      deviceId: 'device-id-first',
      choiceDatetime: TODAY.toISOString(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      },
    })
  })
})

const renderUseCookies = () =>
  renderHook(useCookies, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
