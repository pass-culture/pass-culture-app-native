import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { processHomepageEntry } from 'features/home/contentful'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import {
  homepageEntriesAPIResponse,
  adaptedHomepageEntry,
  adaptedSecondHomepageEntry,
} from 'tests/fixtures/homepageEntries'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { getEntries, BASE_URL, PARAMS, useUserProfileInfo, useHomepageModules } from './api'

const mockedUseAuthContext = useAuthContext as jest.Mock

const userProfileApiMock = jest.fn()
const userProfileAPIResponse: UserProfileResponse = {
  bookedOffers: {},
  domainsCredit: {
    all: { initial: 50000, remaining: 40000 },
    physical: { initial: 30000, remaining: 10000 },
    digital: { initial: 30000, remaining: 20000 },
  },
  email: 'email@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  needsToFillCulturalSurvey: true,
  roles: [],
  isEligibleForBeneficiaryUpgrade: false,
  showEligibleCard: false,
  id: 1234,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
}
server.use(
  rest.get(`${BASE_URL}/entries/${PARAMS}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  }),
  rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
    userProfileApiMock()
    return res(ctx.status(200), ctx.json(userProfileAPIResponse))
  })
)

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))
const entryId = homepageEntriesAPIResponse.items[1].sys.id

describe('Home api calls', () => {
  it('getEntries', async () => {
    const result = await getEntries()
    expect(result[0]).toEqual(adaptedHomepageEntry)
    expect(result[1]).toEqual(adaptedSecondHomepageEntry)
  })

  describe('useHomepageModules', () => {
    it('calls the API and returns the data', async () => {
      const { result, waitFor } = renderHook(useHomepageModules, {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.length > 0)
      expect(result.current).toEqual(processHomepageEntry(adaptedHomepageEntry))
    })

    it('calls the API and returns the data with specified entryId', async () => {
      const { result, waitFor } = renderHook(() => useHomepageModules(entryId), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.length > 0)
      expect(result.current).toEqual(processHomepageEntry(adaptedSecondHomepageEntry))
    })

    it('should log ConsultHome with specified entryId', async () => {
      const { result, waitFor } = renderHook(() => useHomepageModules(entryId), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.length > 0)
      expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { entryId })
    })
  })

  describe('useUserProfileInfo', () => {
    it('calls the API and returns the data', async () => {
      const { result, waitFor } = renderHook(useUserProfileInfo, {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })
      await waitFor(() => !result.current.isLoading)
      expect(result.current.data).toEqual(userProfileAPIResponse)
      expect(userProfileApiMock).toHaveBeenCalledTimes(1)
    })
    it("doesn't call the api if the user isn't logged in", async () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: false }))
      const { result, waitFor } = renderHook(useUserProfileInfo, {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })
      await waitFor(() => !result.current.isLoading)
      expect(userProfileApiMock).not.toHaveBeenCalled()
    })
  })
})
