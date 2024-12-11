import { BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import { AccountState } from 'api/gen'
import * as RefreshAccessTokenAPI from 'api/refreshAccessToken'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/types'
import { FAKE_USER_ID } from 'fixtures/fakeUserId'
import { analytics } from 'libs/analytics'
import { SSOType } from 'libs/analytics/logEventAnalytics'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import * as Keychain from 'libs/keychain/keychain'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

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

jest.mock('api/api')
jest.mock('libs/campaign')
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

describe('useLoginRoutine', () => {
  beforeEach(async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)
  })

  it('should saveRefreshToken', async () => {
    const mockSaveRefreshToken = jest.spyOn(Keychain, 'saveRefreshToken')
    await renderUseLoginRoutine()

    expect(mockSaveRefreshToken).toHaveBeenCalledTimes(1)
  })

  it('should log login analytics', async () => {
    await renderUseLoginRoutine()

    expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method })
  })

  it('should log login analytics with sso type when defined', async () => {
    await renderUseLoginRoutine('SSO_login')

    expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method, type: 'SSO_login' })
  })

  it('should save access token to storage', async () => {
    await renderUseLoginRoutine()

    const accessTokenStorage = await storage.readString('access_token')

    expect(accessTokenStorage).toEqual(accessToken)
  })

  it('should schedule access removal when it expires', async () => {
    await renderUseLoginRoutine()

    expect(scheduleAccessTokenRemovalSpy).toHaveBeenCalledWith(accessToken)
  })

  describe('connectServicesRequiringUserId', () => {
    it('should set batch identifier', async () => {
      await renderUseLoginRoutine()

      expect(BatchProfile.identify).toHaveBeenNthCalledWith(1, FAKE_USER_ID.toString())
    })

    it('should log set user id analytics', async () => {
      await renderUseLoginRoutine()

      expect(firebaseAnalytics.setUserId).toHaveBeenCalledWith(FAKE_USER_ID)
    })

    it('should set user id in cookies consent storage', async () => {
      await renderUseLoginRoutine()

      const cookiesConsentStorage = await storage.readObject(COOKIES_CONSENT_KEY)

      expect(cookiesConsentStorage).toEqual({
        ...cookiesChoice,
        userId: FAKE_USER_ID,
      })
    })
  })

  describe('resetContexts', () => {
    it('should reset search context because search results can be different for connected user (example: video games are hidden for underage beneficiaries)', async () => {
      await renderUseLoginRoutine()

      expect(mockResetSearch).toHaveBeenCalledTimes(1)
    })

    it('should reset identity check context because user logged in can be different than previous user', async () => {
      await renderUseLoginRoutine()

      expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
    })
  })
})

const renderUseLoginRoutine = async (analyticsType?: SSOType) => {
  const { result } = renderHook(useLoginRoutine, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  const login = result.current
  await act(async () => {
    await login(
      {
        accessToken,
        accountState: AccountState.ACTIVE,
        refreshToken: 'refresh_token',
      },
      method,
      analyticsType
    )
  })
}
