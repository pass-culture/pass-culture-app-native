import { BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import { AccountState } from 'api/gen'
import * as RefreshAccessTokenAPI from 'api/refreshAccessToken'
import { LoginRoutine, useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/types'
import { FAKE_USER_ID } from 'fixtures/fakeUserId'
import { SSOType } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import * as Keychain from 'libs/keychain/keychain'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const method = 'fromLogin'
const accessToken = 'access_token'
const COOKIES_CONSENT_KEY = 'cookies'
const cookiesChoice: CookiesConsent = {
  buildVersion: 1001005,
  deviceId: 'uuid',
  choiceDatetime: new Date(2022, 9, 29).toISOString(),
  consent: {
    mandatory: COOKIES_BY_CATEGORY.essential,
    accepted: ALL_OPTIONAL_COOKIES,
    refused: [],
  },
}

const mockResetSearch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()

jest.useFakeTimers()

jest.mock('api/api')
jest.mock('libs/campaign/campaign')
jest.mock('libs/keychain/keychain')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ resetSearch: mockResetSearch })),
}))

const scheduleAccessTokenRemovalSpy = jest.spyOn(
  RefreshAccessTokenAPI,
  'scheduleAccessTokenRemoval'
)

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('useLoginRoutine', () => {
  beforeEach(async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)
  })

  it('should saveRefreshToken', async () => {
    const mockSaveRefreshToken = jest.spyOn(Keychain, 'saveRefreshToken')
    const { result } = renderUseLoginRoutine()
    await act(loginFunction(result.current))

    await waitFor(() => expect(mockSaveRefreshToken).toHaveBeenCalledTimes(1))
  })

  it('should log login analytics', async () => {
    const { result } = renderUseLoginRoutine()
    await act(loginFunction(result.current))

    await waitFor(() => expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method }))
  })

  it('should log login analytics with sso type when defined', async () => {
    const { result } = renderUseLoginRoutine()
    await act(loginFunction(result.current, 'SSO_login'))

    await waitFor(() =>
      expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method, type: 'SSO_login' })
    )
  })

  it('should save access token to storage', async () => {
    const { result } = renderUseLoginRoutine()
    await act(loginFunction(result.current))

    const accessTokenStorage = await storage.readString('access_token')

    await waitFor(() => expect(accessTokenStorage).toEqual(accessToken))
  })

  it('should schedule access removal when it expires', async () => {
    const { result } = renderUseLoginRoutine()
    await act(loginFunction(result.current))

    await waitFor(() => expect(scheduleAccessTokenRemovalSpy).toHaveBeenCalledWith(accessToken))
  })

  describe('connectServicesRequiringUserId', () => {
    it('should set batch identifier', async () => {
      const { result } = renderUseLoginRoutine()
      await act(loginFunction(result.current))

      await waitFor(() =>
        expect(BatchProfile.identify).toHaveBeenNthCalledWith(1, FAKE_USER_ID.toString())
      )
    })

    it('should log set user id analytics', async () => {
      const { result } = renderUseLoginRoutine()
      await act(loginFunction(result.current))

      await waitFor(() => expect(firebaseAnalytics.setUserId).toHaveBeenCalledWith(FAKE_USER_ID))
    })

    it('should set user id in cookies consent storage', async () => {
      const { result } = renderUseLoginRoutine()
      await act(loginFunction(result.current))

      const cookiesConsentStorage = await storage.readObject(COOKIES_CONSENT_KEY)

      await waitFor(() =>
        expect(cookiesConsentStorage).toEqual({
          ...cookiesChoice,
          userId: FAKE_USER_ID,
        })
      )
    })
  })

  describe('resetContexts', () => {
    it('should reset search context because search results can be different for connected user (example: video games are hidden for underage beneficiaries)', async () => {
      const { result } = renderUseLoginRoutine()
      await act(loginFunction(result.current))

      await waitFor(() => expect(mockResetSearch).toHaveBeenCalledTimes(1))
    })

    it('should reset identity check context because user logged in can be different than previous user', async () => {
      const { result } = renderUseLoginRoutine()
      await act(loginFunction(result.current))

      await waitFor(() =>
        expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
      )
    })
  })
})

const renderUseLoginRoutine = () => {
  return renderHook(useLoginRoutine, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}

function loginFunction(login: LoginRoutine, analyticsType?: SSOType): () => Promise<void> {
  return async () => {
    await login(
      {
        accessToken,
        accountState: AccountState.ACTIVE,
        refreshToken: 'refresh_token',
      },
      method,
      analyticsType
    )
  }
}
