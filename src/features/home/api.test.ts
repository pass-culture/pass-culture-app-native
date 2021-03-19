import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { ExpenseDomain, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { homepageEntriesAPIResponse, adaptedHomepageEntries } from 'tests/fixtures/homepageEntries'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { getHomepageEntries, CONTENTFUL_BASE_URL, useUserProfileInfo } from './api'

const mockedUseAuthContext = useAuthContext as jest.Mock

const userProfileApiMock = jest.fn()
const userProfileAPIResponse: UserProfileResponse = {
  expenses: [
    {
      current: 89,
      domain: ExpenseDomain.All,
      limit: 200,
    },
  ],
  email: 'email@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  needsToFillCulturalSurvey: true,
  showEligibleCard: false,
  id: 1234,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
}
server.use(
  rest.get(
    `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}/entries?include=2&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
    }
  ),
  rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
    userProfileApiMock()
    return res(ctx.status(200), ctx.json(userProfileAPIResponse))
  })
)

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('Home api calls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getHomepageEntries', async () => {
    const result = await getHomepageEntries()
    expect(result).toEqual(adaptedHomepageEntries)
  })

  describe('useUserProfileInfo', () => {
    it('calls the API and returns the data', async () => {
      const { result, waitFor } = renderHook(useUserProfileInfo, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })
      await waitFor(() => {
        return result.current.data !== undefined
      })
      expect(result.current.data).toEqual(userProfileAPIResponse)
      expect(userProfileApiMock).toHaveBeenCalledTimes(1)
    })
    it("doesn't call the api if the user isn't logged in", async () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: false }))
      const { result, waitFor } = renderHook(useUserProfileInfo, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })
      await waitFor(() => !result.current.isLoading)
      expect(userProfileApiMock).not.toHaveBeenCalled()
    })
  })
})
