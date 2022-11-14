import { rest } from 'msw'

import { UserProfileResponse, YoungStatusType } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/profile/api'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

const mockedUseAuthContext = useAuthContext as jest.Mock

const userProfileApiMock = jest.fn()
const userProfileAPIResponse: UserProfileResponse = {
  bookedOffers: {},
  domainsCredit: domains_credit_v1,
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
  status: { statusType: YoungStatusType.beneficiary },
}

server.use(
  rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
    userProfileApiMock()
    return res(ctx.status(200), ctx.json(userProfileAPIResponse))
  })
)

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

describe('useUserProfileInfo', () => {
  it('calls the API and returns the data', async () => {
    const { result } = renderHook(useUserProfileInfo, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(userProfileAPIResponse)
      expect(userProfileApiMock).toHaveBeenCalledTimes(1)
    })
  })

  it("doesn't call the api if the user isn't logged in", async () => {
    mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: false }))
    const { result } = renderHook(useUserProfileInfo, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(userProfileApiMock).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
    })
  })
})
