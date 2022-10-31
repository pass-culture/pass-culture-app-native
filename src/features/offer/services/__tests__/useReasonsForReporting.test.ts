import { rest } from 'msw'

import { OfferReportReasons } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { offerReportReasonResponseSnap } from 'features/offer/fixtures/offerReportReasonResponse'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { useReasonsForReporting } from '../useReasonsForReporting'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

server.use(
  rest.get<OfferReportReasons>(
    env.API_BASE_URL + '/native/v1/offer/report/reasons',
    (req, res, ctx) => res(ctx.status(200), ctx.json(offerReportReasonResponseSnap))
  )
)

describe('useReasonsForReporting hook', () => {
  afterEach(jest.resetAllMocks)

  it('should retrieve reasons for reporting data when logged in', async () => {
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: true }))
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const { result } = renderHook(useReasonsForReporting, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(true)

    await waitFor(() => {
      expect(result.current.data?.reasons.length).toEqual(
        offerReportReasonResponseSnap.reasons.length
      )
    })
  })

  it('should return null when not logged in', async () => {
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: true }))
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    }))

    const { result } = renderHook(useReasonsForReporting, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(false)
  })
})
